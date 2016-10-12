/*
outline:
- get image
- convert to pixel array
- create ASCII string
- output ASCII
- option to copy to clipboard?
*/

function onUpload(ev: Event)
{
    // get the file
    let files: FileList = ev.srcElement["files"];
    if (files.length == 0) return;   
    let file: File = files[0];

    // get image
    let img: HTMLImageElement = new Image();
    let reader: FileReader = new FileReader();
    reader.addEventListener("load", ()=>{
        img.src=reader.result;
        processImg(img);
    });
    reader.readAsDataURL(file);
}

function processImg(img: HTMLImageElement)
{
    // draw the image to the screen
    let scaledWidth: number = Math.floor(img.width/imgScale);
    let scaledHeight: number = Math.floor(img.height/imgScale);
    canvas.style.width = scaledWidth + "px";
    canvas.style.height = scaledHeight + "px";
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // get pixels
    let imgData: Uint8ClampedArray = ctx.getImageData(0, 0, scaledWidth, scaledHeight).data; // a long list of repeating r,g,b,a numbers
    let outString = "";
    let x: number = 0;
    let y: number = 0;
    for (let i: number = 0; i < imgData.length - 3; i += 4) {
        // get colour values
        let r: number = imgData[i];
        let g: number = imgData[i+1];
        let b: number = imgData[i+2];
        let a: number = imgData[i+3];
        // convert to grayscale, there are three possible methods - http://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        let greyscale: number = 0;
        if (greyScaleMethod == "lightness") greyscale = (Math.max(r,g,b)+Math.min(r,g,b))/2;
        else if (greyScaleMethod == "average") greyscale = (r+g+b)/3;
        else if (greyScaleMethod == "luminosity") greyscale = 0.21*r + 0.72*g + 0.07*b;
        greyscale = greyscale * a/255; // scale based on alpha
        // convert to ascii
        let ascii: string = "";
        if (greyscale > 240) ascii = "'";
        else if (greyscale > 200) ascii = ".";
        else if (greyscale > 150) ascii = ",";
        else if (greyscale > 100) ascii = "~";
        else if (greyscale > 50) ascii = "+";
        else ascii = "#";
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

function setGreyscaleMethod(fileInput: HTMLElement, method: string)
{
    greyScaleMethod = method;
    
}

function refresh()
{
    let event = new Event("change");
    fileInput.dispatchEvent(event);
}

function sliderChanged()
{
    imgScale = -parseInt(sliderScale.value);
    sliderScaleDisplay.innerHTML = "1:" + imgScale;
    refresh(); 
}

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("img-canvas");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
let greyScaleMethod: string = "luminosity";
let fileInput: HTMLElement = document.getElementById("file-input");
let imgScale: number = 1; // denominator of scale; eg imgScale==5 is a scale of 1/5
fileInput.onchange = onUpload;
document.getElementById("check-luminosity").onclick = function() {greyScaleMethod = "luminosity"; refresh;};
document.getElementById("check-lightness").onclick = function() {greyScaleMethod = "lightness"; refresh;};
document.getElementById("check-average").onclick = function() {greyScaleMethod = "average"; refresh;};
let sliderScale: HTMLInputElement = <HTMLInputElement>document.getElementById("slider-scale");
let sliderScaleDisplay: HTMLElement = document.getElementById("slider-scale-display");
sliderScale.onchange = sliderChanged;
sliderChanged();
