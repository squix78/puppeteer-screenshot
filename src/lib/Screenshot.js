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
        '-force-high-contrast'
        ]});
  }

  async getImage({
                   url,
                   width,
                   height,
                   username,
                   password,
                   scale,
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
    let waitUntilEvent = 'networkidle2';
    if (waitForSelector) {
      waitUntilEvent = 'domcontentloaded';
    }

    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, {visible: true, timeout: 5000 });
      console.log("Found selector");
    }

    await page.goto(url,{
      waitUntil: waitUntilEvent,
      timeout: 6000
    });




    let screenshot = {
      type:"png",
      fullPage:true,
      omitBackground:true
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
