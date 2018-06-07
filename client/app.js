//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var ocr = require('./utils/ocr.js')
var util = require('./utils/util.js')

App({
  globalData: {
    openId: null,
    nickName: null
  },
  nikcName: undefined,
  //ip: 'https://3mdv08q0.qcloud.la',
  ip: 'https://110298881.showmecard.xyz',
  baiduOcrToken: '',
  onLaunch: function () {
    util.showBusy("请稍候", 1000);

    qcloud.setLoginUrl(config.service.loginUrl)

    var that = this
    ocr.initOcr(that)

    wx.getUserInfo({
      success: function (res) {
        that.globalData.nickName = res.userInfo.nickName;
      }
    })

    wx.login({
      //获取code
      success: function (res) {
        var code = res.code //返回code

        // 获取openid
        wx.request({
          url: config.service.getUserInfo,
          data: {
            code : code
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            that.globalData.openId = res.data.openid;//返回openid
            wx.hideLoading();
          }
        })
        
      }
    })

    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.getUserInfo({
          success: function (res) {
            that.nickName = res.userInfo.nickName
          },
          fail: function (res) {
            console.log(res)
            util.showSuccess('授权成功')
          }
        })
      },
      fail: function (res) {
        console.log(res)
        util.showModel('提示','授权失败')
      }
    })
  },


})