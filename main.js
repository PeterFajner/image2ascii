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
    canvas.style.width = img.width + "px";
    canvas.style.height = img.height + "px";
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // get pixels
    var imgData = ctx.getImageData(0, 0, img.width, img.height).data; // a long list of repeating r,g,b,a numbers
    var outString = "";
    var x = 0;
    var y = 0;
    for (var i = 0; i < imgData.length - 3; i += 4) {
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
        if (x == img.width) {
            outString += "<br>";
            x = 0;
            y++;
        }
    }
    // print outstring to document
    document.getElementById("output").innerHTML = outString;
}
function setGreyscaleMethod(fileInput, method) {
    greyScaleMethod = method;
    var event = new Event("change");
    fileInput.dispatchEvent(event);
}
function init() {
    var fileInput = document.getElementById("file-input");
    fileInput.onchange = onUpload;
    document.getElementById("check-luminosity").onclick = function () { setGreyscaleMethod(fileInput, "luminosity"); };
    document.getElementById("check-lightness").onclick = function () { setGreyscaleMethod(fileInput, "lightness"); };
    document.getElementById("check-average").onclick = function () { setGreyscaleMethod(fileInput, "average"); };
}
var canvas = document.getElementById("img-canvas");
var ctx = canvas.getContext("2d");
var greyScaleMethod = "luminosity";
init();
