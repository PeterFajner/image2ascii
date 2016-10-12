/*
outline:
- get image
- convert to pixel array
- create ASCII string
- output ASCII
- option to copy to clipboard?
*/
function onUpload(ev) {
    // get the file
    var files = ev.srcElement["files"];
    if (files.length == 0)
        return;
    var file = files[0];
    // get image
    var img = new Image();
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        img.src = reader.result;
        processImg(img);
    });
    reader.readAsDataURL(file);
}
function processImg(img) {
    // draw the image to the screen
    var scaledWidth = Math.floor(img.width / imgScale);
    var scaledHeight = Math.floor(img.height / imgScale);
    canvas.style.width = scaledWidth + "px";
    canvas.style.height = scaledHeight + "px";
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    // get pixels
    var imgData = ctx.getImageData(0, 0, scaledWidth, scaledHeight).data; // a long list of repeating r,g,b,a numbers
    var outString = "";
    var x = 0;
    var y = 0;
    for (var i = 0; i < imgData.length - 3; i += 4) {
        // get colour values
        var r = imgData[i];
        var g = imgData[i + 1];
        var b = imgData[i + 2];
        var a = imgData[i + 3];
        // convert to grayscale, there are three possible methods - http://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        var greyscale = 0;
        if (greyScaleMethod == "lightness")
            greyscale = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
        else if (greyScaleMethod == "average")
            greyscale = (r + g + b) / 3;
        else if (greyScaleMethod == "luminosity")
            greyscale = 0.21 * r + 0.72 * g + 0.07 * b;
        greyscale = greyscale * a / 255; // scale based on alpha
        // convert to ascii
        var ascii = "";
        if (greyscale > 240)
            ascii = "'";
        else if (greyscale > 200)
            ascii = ".";
        else if (greyscale > 150)
            ascii = ",";
        else if (greyscale > 100)
            ascii = "~";
        else if (greyscale > 50)
            ascii = "+";
        else
            ascii = "#";
        // add ascii to output string
        outString += ascii;
        x++;
        if (x >= scaledWidth) {
            x = 0;
            y++;
            outString += "<br>";
        }
    }
    // print outstring to document
    document.getElementById("output").innerHTML = outString;
}
function setGreyscaleMethod(fileInput, method) {
    greyScaleMethod = method;
}
function refresh() {
    var event = new Event("change");
    fileInput.dispatchEvent(event);
}
function sliderChanged() {
    imgScale = -parseInt(sliderScale.value);
    sliderScaleDisplay.innerHTML = "1:" + imgScale;
    refresh();
}
var canvas = document.getElementById("img-canvas");
var ctx = canvas.getContext("2d");
var greyScaleMethod = "luminosity";
var fileInput = document.getElementById("file-input");
var imgScale = 1; // denominator of scale; eg imgScale==5 is a scale of 1/5
fileInput.onchange = onUpload;
document.getElementById("check-luminosity").onclick = function () { greyScaleMethod = "luminosity"; refresh; };
document.getElementById("check-lightness").onclick = function () { greyScaleMethod = "lightness"; refresh; };
document.getElementById("check-average").onclick = function () { greyScaleMethod = "average"; refresh; };
var sliderScale = document.getElementById("slider-scale");
var sliderScaleDisplay = document.getElementById("slider-scale-display");
sliderScale.onchange = sliderChanged;
sliderChanged();
