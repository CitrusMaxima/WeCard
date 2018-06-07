const client_id = 'svin6l6OYtUwVqCVT09qjU4P'
const client_secret = 'gAKoXubkpgIqLiMrEITiOo8rqhedvpXg '
var app

var __getBaiduToken = function (options) {
  var tokenCache

  options = {
    success: options && options.success ? options.success : function () { },
    fail: options && options.fail ? options.fail : function () { }
  }

  //取缓存token
  try {
    tokenCache = wx.getStorageSync('baidu_ocr_token')
    if (tokenCache) {
      // 单位： s
      var tokenTime = (new Date().getTime() - tokenCache.inTime) / 1000
      // 提前token过期一小时前更新token防止临界点
      if (tokenTime > tokenCache.expires_in - 3600) {
        tokenCache = null
      }
    }
  } catch (e) {
    console.log(e)
  }

  if (tokenCache) {
    app.baiduOcrToken = tokenCache.access_token
    options.success(app.baiduOcrToken)
    return
  }

  //缓存token没有，重新获取
  wx.request({
    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    dataType: "json",
    success(result) {
      console.log('获取token成功')
      if (result.data.access_token) {
        result.data.inTime = new Date().getTime()
        wx.setStorageSync('baidu_ocr_token', result.data)
        app.baiduOcrToken = result.data.access_token
        options.success(app.baiduOcrToken)
      } else {
        options.fail()
      }

    },
    fail(error) {
      console.log('request fail', error);
      options.fail()
    }
  })
}

var initOcr = function (aplication) {
  app = aplication
  __getBaiduToken()
}

var getCard = function (options) {

  options = {
    imgPath: options.imgPath ? options.imgPath : "",
    success: options.success ? options.success : function () { },
    fail: options.fail ? options.fail : function () { },
    complete: options.complete
  }

  __getBaiduToken({
    success: function (token) {
      wx.uploadFile({
        url: app.ip + '/weapp/card_search',
        filePath: options.imgPath,
        name: 'image',
        dataType: 'json',
        formData: {
          baidu_ocr_token: token
        },
        success(result) {
          console.log('获取名片成功')

          try {
            let r = JSON.parse(result.data)
            // console.log(r.data.outputs[0].outputValue.dataValue)
            // 百度
            // options.success(r.data.words_result)
            // 阿里
            options.success(r.data.outputs[0].outputValue.dataValue)
          } catch (e) {
            console.log(e)
            options.fail()
          }

        },
        fail(error) {
          console.log('request fail', error);
          options.fail()
        },
        complete(info) {
          if (options.complete) options.complete()
        }

      })
    },
    fail: function () {
      options.fail()
    }
  });

}

module.exports = { getCard, initOcr }


