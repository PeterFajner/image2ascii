/*
outline:
- get image
- convert to pixel array
- create ASCII string
- output ASCII
- option to copy to clipboard?
*/
var Pixel = (function () {
    function Pixel(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
        this.ascii = Pixel.convert(this, "luminosity");
    }
    Pixel.convert = function (pix, avgMethod) {
        var r = pix.r;
        var g = pix.g;
        var b = pix.b;
        // convert to greyscale, there are three possible methods - http://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        var greyscale = 0;
        if (avgMethod == "lightness")
            greyscale = Pixel.lightness(r, g, b);
        else if (avgMethod == "average")
            greyscale = Pixel.average(r, g, b);
        else if (avgMethod == "luminosity")
            greyscale = Pixel.luminosity(r, g, b);
        // convert to ascii
        if (greyscale > 240)
            return "'";
        else if (greyscale > 200)
            return ".";
        else if (greyscale > 150)
            return ",";
        else if (greyscale > 100)
            return "~";
        else if (greyscale > 50)
            return "+";
        else
            return "#";
    };
    Pixel.lightness = function (r, g, b) {
        return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
    };
    Pixel.average = function (r, g, b) {
        return (r + g + b) / 3;
    };
    Pixel.luminosity = function (r, g, b) {
        return 0.21 * r + 0.72 * g + 0.07 * b;
    };
    return Pixel;
}());
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
    var pixelData = new Array();
    // create Pixel objects for each pixel
    for (var i = 0; i < imgData.length - 3; i += 4) {
        var pixel = new Pixel(imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]);
        pixelData.push(pixel);
    }
    // create output string
    var outString = "";
    for (var y = 0; y < img.height; y++) {
        for (var x = 0; x < img.width; x++) {
            var pixel = pixelData.shift(); // get the first element
            outString += pixel.ascii;
        }
        outString += "<br>";
    }
    // print outstring to document
    document.getElementById("output").innerHTML = outString;
}
function init() {
    document.getElementById("file-input").onchange = onUpload;
}
var canvas = document.getElementById("img-canvas");
var ctx = canvas.getContext("2d");
init();
