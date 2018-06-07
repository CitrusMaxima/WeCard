var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var ocr = require('../../utils/ocr.js')
var imgHelper = require('../../utils/img_helper.js')

var app

Page({
  data: {
    animScope: {
      DESC: true,
      obtainImgInit: true,
      cardInfoInit: true,
      copyInit: true
    }
  },

  // 重置显示结果动画
  resetResultAnim: function () {
    this.setData({
      animScope: {
        cardInfoInit: true,
        copyInit: true
      }
    })

    this.animCardInfo(true)
    this.animCopy(true)


  },

  // 显示结果动画
  anim4result: function () {

    this.animCardInfo()

    this.animCopy()

  },

  onLoad: function (res) {
    app = getApp()
  },

  animObtainImg: function (reserve) {
    // 获取照片动画
    var animObtainImg = wx.createAnimation({
      timingFunction: 'ease',
    })
    animObtainImg.opacity(reserve ? 0 : 1).step({ duration: 2000 })
    this.setData({
      animObtainImg: animObtainImg.export()
    })
  },

  animCardInfo: function (reserve) {
    // 名片动画
    var animCardInfo = wx.createAnimation({
      timingFunction: 'ease',
    })
    animCardInfo.opacity(reserve ? 0 : 1).translateX(reserve ? '-800px' : 0).step({ duration: 800 })
    this.setData({
      animCardInfo: animCardInfo.export()
    })
  },

  animCopy: function (reserve) {
    // 复制按钮动画
    var animCopy = wx.createAnimation({
      timingFunction: 'ease',
    })
    animCopy.opacity(reserve ? 0 : 1).translateX(reserve ? '800px' : 0).step({ duration: 1000 })
    this.setData({
      animCopy: animCopy.export()
    })
  },

  takePhoto: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 重置动画
        that.resetResultAnim()
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgFile = res.tempFiles[0];
        that.setData({
          imgFile: imgFile,
          // cardInfo: false
        })

        // 显示获取名片照片模块
        that.animObtainImg()

        console.log(imgFile.size / 1024 + 'kb')
        if (res.size > 1024 * 1024 * 3) {
          util.showModel('错误', '图片需要小于 3M')
        } else {
          that.ocrOption(imgFile.path);
        }

      }
    })
  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 重置动画
        that.resetResultAnim()
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgFile = res.tempFiles[0];
        that.setData({
          imgFile: imgFile,
          // cardInfo: false
        })

        // 显示获取名片照片模块
        that.animObtainImg()

        console.log(imgFile.size / 1024 + 'kb')
        if (res.size > 1024 * 1024 * 3) {
          util.showModel('错误', '图片需要小于 3M')
        } else {
          that.ocrOption(imgFile.path);
        }

      }
    })
  },

  reChooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera','album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 重置动画
        that.resetResultAnim()
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgFile = res.tempFiles[0];
        that.setData({
          imgFile: imgFile,
          // cardInfo: false
        })

        // 显示获取名片照片模块
        that.animObtainImg()

        console.log(imgFile.size / 1024 + 'kb')
        if (res.size > 1024 * 1024 * 3) {
          util.showModel('错误', '图片需要小于 3M')
        } else {
          that.ocrOption(imgFile.path);
        }

      }
    })
  },

  // ocr识别
  ocrOption: function (img) {
    util.showBusy("OCR识别中...")
    var that = this
    var ret = ocr.getCard({
      imgPath: img,
      success: function (result) {
        wx.hideLoading();
        if (result) {
          result = JSON.parse(result)
          for (var i = 0; i < result.addr.length; i++) {
            var str = result.addr[i];
            if (str.substr(0, 1) == ':')
              str = str.substr(1);
            result.addr[i] = str;
          }
          that.setData({
            cardInfo: result
          })
          console.log(result)
          that.anim4result()
        } else {
          util.showModel('提示', '未识别到名片信息')
        }

      },
      fail: function () {
        wx.hideLoading();
        util.showModel('提示', '识别失败')
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgFile.path,
      urls: [this.data.imgFile.path]
    })
  },

  // 添加到联系人
  addToContacts: function () {
    var that = this
    wx.addPhoneContact({
      firstName: that.data.cardInfo.name,
      mobilePhoneNumber: that.data.cardInfo.tel_cell[0],
      organization: that.data.cardInfo.company[0],
      title: that.data.cardInfo.title[0],
      workPhoneNumber: that.data.cardInfo.tel_work[0],
      email: that.data.cardInfo.email[0],
      addressCity: that.data.cardInfo.addr[0],

      success: function (res) {
        util.showSuccess('添加成功！')
      },
      fail: function (res) {
        util.showSuccess('添加失败！')
      }
    })
  }
})