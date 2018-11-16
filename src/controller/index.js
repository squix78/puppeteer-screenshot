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
    screenshot:{
      type:ctx.query.type,
      quality:ctx.query.quality,
      fullPage:ctx.query.fullPage,
      clip:{
        x:ctx.query.x,
        y:ctx.query.y,
        width:ctx.query.w,
        height:ctx.query.h,
      },
      omitBackground:ctx.query.o
    },
    device:ctx.query.device
  }
  if(!(options=checkOption(options,ctx))) return
  ctx.type = options.screenshot.type;
  ctx.body=await instance.getImage(options)
}

async function postMethod (ctx) {
  let params=ctx.request.body
  let options={
      url:params.url,
      screenshot:params.screenshot,
      html:params.html,
      style:params.style,
      script:params.script,
      waitFor:params.waitFor,
      device:params.device
  }
  if(!(options=checkOption(options,ctx))) return
  ctx.type = options.screenshot.type;
  ctx.body=await instance.getImage(options)
}

function checkOption(option,ctx){
    let screenshot=option.screenshot||{type:'png'}
    let style=option.style
    let script =option.script

    if(!/^https?:\/\/.+/.test(option.url)){
        ctx.body=Boom.badRequest('invalid url').output;
        return false
    }
    if(!screenshot.fullPage){
        delete screenshot.clip
    }
    if(screenshot.type&&!/^jpeg$|^png$/.test(screenshot.type)){
        ctx.body=Boom.badRequest('invalid type. Optional [jpeg,png]').output;
        return false
    }
    if(screenshot.quality&&!Number.isInteger(screenshot.quality)){
        ctx.body=Boom.badRequest(`quality is a number`).output;
        return false
    }
    screenshot.omitBackground=!!screenshot.omitBackground
    if(option.device&&deviceNames.indexOf(option.device)===-1){
        ctx.body=Boom.badRequest(`invalid device. Optional [${deviceNames}]`).output;
        return false
    }else{
        option.device=devices[option.device||'iPhone 8']
    }
    option.screenshot=screenshot

    if(style&&typeof style!=='object'){
        ctx.body=Boom.badRequest(`style must be an object. {url,content}`).output;
        return false
    }
    if(style&&style.content){
        delete style.url
    }

    if(script&&typeof script!=='object'){
        ctx.body=Boom.badRequest(`script must be an object. {url,content,type}`).output;
        return false
    }
    if(script&&script.content){
        delete script.url
    }

    return option
}

module.exports={
  getMethod,
  postMethod
}