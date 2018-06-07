const inspect = require('util').inspect
const Busboy = require('busboy')

const request = require("request");
/*
// 请求返回 promise，便于异步处理
function doBaiduOcrRequest(token, imgBase64) {
  return new Promise((resolve, reject) => {
    request.post('https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + token, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    }).form({ image: imgBase64 });
  });
}
*/

function doBaiduOcrRequest(token, imgBase64) {

  return new Promise((resolve, reject) => {
    var data = "{\"inputs\":[{\"image\":{\"dataType\":50,\"dataValue\":\"" + imgBase64 + "\"}}]}";

    var req = {
      url: "https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json",
      method: "POST",
      json: true,
      headers: {
        "Authorization": "APPCODE e3c17dd84a6941fd8508951581d990b5",
      },
      form: data
    };
    request.post(req, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
  
}


/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @return {promise}
 */
function cardRecognition(ctx) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({ headers: req.headers })

  return new Promise((resolve, reject) => {
    console.log('图片上传中...')
    let result = {
      success: false,
      formData: {},
      ocrResult: {},
      buf: new Buffer([])
    }

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

      file.on('data', function (chunk) {
        result.buf = Buffer.concat([result.buf, Buffer.from(chunk)])
      })

      // 文件写入事件结束
      file.on('end', function () {
        result.formData['base64'] = result.buf.toString('base64')
        console.log('获取图片成功！')
      })
    })

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData[fieldname] = val;
    });

    // 解析结束事件
    busboy.on('finish', async function () {
      result.success = true
      const ocrResult = await doBaiduOcrRequest(result.formData.baidu_ocr_token, result.formData.base64)
      // 百度
      //result.ocrResult = JSON.parse(ocrResult)
      // 阿里
      result.ocrResult = ocrResult

      // 清除转发信息
      result.formData = { msg: '任务完，已清除' }
      result.buf = { msg: '任务完，已清除' }

      resolve(result)

      console.log('代理百度ocr识别请求结束')
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('获取图片文件出错')
      reject(result)
    })

    req.pipe(busboy)
  })

}

module.exports = {
  cardRecognition
}