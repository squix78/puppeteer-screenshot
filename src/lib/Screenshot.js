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
        '--font-render-hinting=none'

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
