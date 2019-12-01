/**
 * Created by pengchaoyang on 2018/11/2
 */
const puppeteer=require('puppeteer')
const devices=require('./DeviceDescriptors')
class Screenshot{
  constructor (){
    this.browser=null
  }

  async launch(){
    this.browser = await puppeteer.launch({args:[
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
        '--disable-lcd-text',
        '--ppapi-antialiased-text-enabled=0',
        '--ppapi-subpixel-rendering-setting=0',
        '--disable-composited-antialiasing=1',
        '--disable-canvas-aa',
        '--disable-2d-canvas-clip-aa',
        '--gpu-rasterization-msaa-sample-count=0',
        '--disable-font-antialiasing',
        '--disable-smooth-scrolling',
        '--disable-roboto-font-ui',
        '--reset-variation-state',
        '--disable-directwrite-for-ui',
        '--disable-hang-monitor',
        '--enable-low-res-tiling',
        '--enable-tile-compression=1',
        '--ui-enable-rgba-4444-textures',
        '--force-color-profile="srgb"',
        '--top-chrome-md=non-material',
        '--disable-display-color-calibration',
        ]});
  }

  async getImage({
                   url,
                   width,
                   height,
                   username,
                   password,
                   scale
  }){
    const page = await this.browser.newPage();
    if (width && height) {
      
      await page.setViewport({
        width: parseInt(width),
        height: parseInt(height),
        deviceScaleFactor: parseInt(scale),
      });
    }

      await page.goto(url,{
        waitUntil: 'networkidle2',
        timeout: 9000
      });

    if (username && password) {
      page.authenticate(username, password);
    }
    let screenshot = {
      type:"png",
      fullPage:true,
      omitBackground:false
    }

    let imageBuffer=await page.screenshot(screenshot);
    await page.close();
    return imageBuffer
  }

  async destroy(){
    await this.browser.close();
  }
}
module.exports=Screenshot
