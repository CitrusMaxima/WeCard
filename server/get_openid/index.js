const request = require("request");

function getOpenid(ctx) {
  return new Promise((resolve, reject) => {
    var appId = 'wxa5843608ed322322';
    var secret = '5daa8d969ab873748870247b7b6c6b57';
    var code = ctx.request.body.code;
    console.log(code);
    var req = {
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
      header: {
        'content-type': 'application/json'
      }
    };
    request.post(req, function (error, res, body) {
      console.log(res);
      if (!error && res.statusCode === 200) {
        resolve(body);
      }
      reject(error);
    });
  })
}


module.exports = {
  getOpenid
}