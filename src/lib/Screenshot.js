/**
 * Created by pengchaoyang on 2018/11/2
 */
const puppeteer=require('puppeteer')
//const PNG = require('pngjs').PNG;
const Jimp = require('jimp');
const devices = require('./DeviceDescriptors')
class Screenshot{
  constructor (){
    this.browser=null
  }

  async launch(){
    this.browser = await puppeteer.launch({args:[
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
        '-force-high-contrast'
        ]});
  }

  async getImage({
                   url,
                   width,
                   height,
                   type,
                   username,
                   password,
                   scale,
                   jpegQuality,
                   tz,
                   waitForSelector
  }){
    const page = await this.browser.newPage();
    if (width && height) {
      
      await page.setViewport({
        width: parseInt(width),
        height: parseInt(height),
        deviceScaleFactor: parseInt(scale),
      });
    }
    if (tz) {
      await page.emulateTimezone(tz);
    }

    if (username && password) {
      page.authenticate(username, password);
    }
    let waitUntilEvent = 'networkidle0';
    if (waitForSelector) {
      waitUntilEvent = 'load';
    }

    await page.goto(url,{
      waitUntil: waitUntilEvent,
      timeout: 6000
    });

    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, {visible: true, timeout: 5000 });
      console.log("Found selector");
    }

    let screenshot = {
      fullPage:false,
      omitBackground:true
    }
    
    let puppeteerImageType = "";
    if (type === "png" || type === "bmp") {
      screenshot.type = "png";
    } else if (type === "jpeg") {
      screenshot.type = "jpeg";
      if (jpegQuality) {
        screenshot.quality = parseInt(jpegQuality);
      } else {
        screenshot.quality = 85;
      }
    } 

    let imageBuffer = await page.screenshot(screenshot);
    await page.close();
    if (type === "bmp") {
      let image = await Jimp.read(imageBuffer);

      return await image.getBufferAsync(Jimp.MIME_BMP); 
    }
    
    return imageBuffer;
  }

  async destroy(){
    await this.browser.close();
  }
}
module.exports=Screenshot
