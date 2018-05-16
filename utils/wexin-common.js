/*
微信小程序公共API 

*/


/******位置******/

function getLocation()
{
    wx.getLocation();
}


/**
 * 动画
 * 
*/
exports.createAnimation=({
  duration = 400, //	动画持续时间，单位ms
  timingFunction = 'linear', //定义动画的效果
  delay = 0, //动画延迟时间，单位 ms
  transformOrigin = '50% 50% 0' //设置transform-origin
})=>{
  return wx.createAnimation({
    duration,
    timingFunction,
    delay,
    transformOrigin
  })
}


/***
 * 获取用户信息
 * 
*/
exports.getUserName=()=>
{
  return  new Promise(()=>{

  })
}

exports.reLaunch=(url)=>{
  wx.reLaunch(url)
}
exports.navigateTo=(url)=>{
  wx.navigateTo(url)
}
