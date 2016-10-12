/*
outline:
- get image
- convert to pixel array
- create ASCII string
- output ASCII
- option to copy to clipboard?
*/

class Pixel
{
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    public greyscale: number;
    public ascii: string;
    constructor(public red: number, public green: number, public blue: number, public alpha: number)
    {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
        this.ascii = Pixel.convert(this, "luminosity");
    }
    public static convert(pix: Pixel, avgMethod: string): string
    {
        let r: number = pix.r;
        let g: number = pix.g;
        let b: number = pix.b;
        // convert to greyscale, there are three possible methods - http://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        let greyscale: number = 0;
        if (avgMethod == "lightness") greyscale = Pixel.lightness(r, g, b);
        else if (avgMethod == "average") greyscale = Pixel.average(r, g, b);
        else if (avgMethod == "luminosity") greyscale = Pixel.luminosity(r, g, b);
        // convert to ascii
        if (greyscale > 240) return "'";
        else if (greyscale > 200) return ".";
        else if (greyscale > 150) return ",";
        else if (greyscale > 100) return "~";
        else if (greyscale > 50) return "+";
        else return "#";

    }
    public static lightness(r: number, g: number, b: number): number
    {
        return (Math.max(r,g,b)+Math.min(r,g,b))/2;
    }
    public static average(r: number, g: number, b: number): number
    {
        return (r+g+b)/3;
    }
    public static luminosity(r: number, g: number, b: number): number
    {
        return 0.21*r + 0.72*g + 0.07*b;
    }
}

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
    canvas.style.width = img.width + "px";
    canvas.style.height = img.height + "px";
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // get pixels
    let imgData: Uint8ClampedArray = ctx.getImageData(0, 0, img.width, img.height).data; // a long list of repeating r,g,b,a numbers
    let pixelData: Array<Pixel> = new Array();
    // create Pixel objects for each pixel
    for (let i: number = 0; i < imgData.length - 3; i += 4) {
        let pixel: Pixel = new Pixel(imgData[i], imgData[i+1], imgData[i+2], imgData[i+3]);
        pixelData.push(pixel);
    }
    // create output string
    let outString = "";
    for (let y: number = 0; y < img.height; y++) {
        for (let x: number = 0; x < img.width; x++) {
            let pixel: Pixel = pixelData.shift(); // get the first element
            outString += pixel.ascii;
        }
        outString += "<br>";
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