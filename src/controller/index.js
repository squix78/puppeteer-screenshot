/**
 * Created by pengchaoyang on 2018/11/9
 */
const Screenshot = require('../lib/Screenshot');
const Boom = require('boom');
const devices=require('../lib/DeviceDescriptors');
const deviceNames=devices.map(device=>device.name)

const instance=new Screenshot();
(async ()=>{
  await instance.launch()
})();

async function getMethod (ctx) {
  let options={
    url:ctx.query.url,
    width:ctx.query.width,
    height:ctx.query.height,
    type:ctx.query.type,
    username:ctx.query.username,
    password:ctx.query.password,
    scale:ctx.query.scale,
    jpegQuality:ctx.query.quality,
    tz:ctx.query.tz,
    waitForSelector:ctx.query.waitForSelector
  }
  if(!(options=checkOption(options,ctx))) return
  ctx.type = "png";
  try{
    ctx.body=await instance.getImage(options)
  }catch (e) {
    ctx.body=Boom.gatewayTimeout(e.message||'Service Unavailable').output;
  }
}

async function postMethod (ctx) {
  let params=ctx.request.body
  let options={
      url:params.url,
      width:params.width,
      height:params.width,
      type:params.type,
      username:params.username,
      password:params.password,
      scale:params.scale,
      jpegQuality:params.quality,
      tz:params.tz,
      waitForSelector:params.waitForSelector
  }
  if(!(options=checkOption(options,ctx))) return
  ctx.type = options.screenshot.type;
  try{
      ctx.body=await instance.getImage(options)
  }catch (e) {
      ctx.body=Boom.gatewayTimeout(e.message||'Service Unavailable').output;
  }
}

function checkOption(option,ctx){
    if(!/^https?:\/\/.+/.test(option.url)){
        ctx.body=Boom.badRequest('invalid url').output;
        return false;
    }
    if (!option.scale) {
      option.scale = 1;
    }
    if (!option.type) {
      option.type = "png";
    }
    return option;
}

function isNumber(str){
  return +str==str
}

module.exports={
  getMethod,
  postMethod
}
