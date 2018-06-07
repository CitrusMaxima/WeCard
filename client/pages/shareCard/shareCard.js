var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {

  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var cardInfo = JSON.parse(options.cardInfo);
    that.setData({
      cardInfo: cardInfo,
    })
    console.log(that.data.cardInfo);
    that.ifCollected();
  },

  onShow: function () {
    
  },

  // 添加到联系人
  addToContacts: function () {
    var that = this
    wx.addPhoneContact({
      firstName: that.data.cardInfo.name,
      mobilePhoneNumber: that.data.cardInfo.mobile,
      organization: that.data.cardInfo.org,
      title: that.data.cardInfo.title,
      workPhoneNumber: that.data.cardInfo.tel,
      email: that.data.cardInfo.email,
      addressCity: that.data.cardInfo.adr,
      url: that.data.cardInfo.url,

      success: function (res) {
        util.showSuccess('添加成功！')
      },
      fail: function (res) {
        util.showSuccess('添加失败！')
      }
    })
  },

  // 跳转到我的名片列表
  aboutMe: function() {
    wx.switchTab({
      url: '../aboutMe/aboutMe'
    })
  },

  // 判断是否已收藏
  ifCollected: function() {
    var that = this;

    wx.request({
      url: config.service.ifCollected,
      data: {
        cardId: that.data.cardInfo.card_id,
        openId: app.globalData.openId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.length == 0) {
          that.setData({
            collected: false
          })
        }
        else {
          that.setData({
            collected: true
          })
        }
      },
      fail: function (res) {
        util.showModel('提示', '名片创建失败');
      }
    })
  },
  
  // 添加到收藏
  addCollectCard: function () {
    var that = this;

    wx.request({
      url: config.service.addCollectCard,
      data: {
        cardId: that.data.cardInfo.card_id,
        openId: app.globalData.openId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        util.showSuccess('收藏成功！');
        that.setData({
          collected: true
        })
      },
      fail: function (res) {
        util.showModel('提示', '收藏失败！');
      }
    })
  },

  // 取消收藏
  deleteCollectCard: function () {
    var that = this;

    wx.request({
      url: config.service.deleteCollectCard,
      data: {
        cardId: that.data.cardInfo.card_id,
        openId: app.globalData.openId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        util.showSuccess('取消收藏成功！');
        that.setData({
          collected: false
        })
      },
      fail: function (res) {
        util.showModel('提示', '取消收藏失败！');
      }
    })
  },

  // 分享
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'We卡通',
      desc: app.globalData.nickName + '向你递了张名片!',
      path: '/pages/shareCard/shareCard?cardInfo=' + JSON.stringify(that.data.cardInfo)
    }
  }
})