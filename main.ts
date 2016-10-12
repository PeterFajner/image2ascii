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
        processImg(img, "luminosity");
    });
    reader.readAsDataURL(file);
}

function processImg(img: HTMLImageElement, greyScaleMethod: string)
{
    // draw the image to the screen
    canvas.style.width = img.width + "px";
    canvas.style.height = img.height + "px";
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // get pixels
    let imgData: Uint8ClampedArray = ctx.getImageData(0, 0, img.width, img.height).data; // a long list of repeating r,g,b,a numbers
    let outString = "";
    let x: number = 0;
    let y: number = 0;
    for (let i: number = 0; i < imgData.length - 3; i += 4) {
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
        if (x == img.width) {
            outString += "<br>"
            x = 0;
            y++;
        }
    }
    // print outstring to document
    document.getElementById("output").innerHTML = outString;
    

}

function init()
{
    document.getElementById("file-input").onchange = onUpload;
}

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("img-canvas");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
init();