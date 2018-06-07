module.exports = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    let appId = "wxa5843608ed322322";
    let secret = "5daa8d969ab873748870247b7b6c6b57";
    let { js_code } = req.body;
    let opts = {
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
    }
    let r1 = await Ut.promiseReq(opts);
    r1 = JSON.parse(r1);
    console.log(r1);
    res.json(r1);
  }
  catch (e) {
    console.log(e);
    res.json('');
  }
}