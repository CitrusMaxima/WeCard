var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    delBtnWidth: 180//删除按钮宽度单位（rpx）
  },

  onLoad: function (options) {
    
    // 页面初始化 options为页面跳转所带来的参数
    this.initEleWidth();
  },

  onReady: function () {

    // 页面渲染完成
  },

  onShow: function () {
    this.getCollectCard();
    // 页面显示
  },

  onHide: function () {

    // 页面隐藏
  },

  onUnload: function () {

    // 页面关闭
  },

  // 获取收藏名片列表
  getCollectCard: function () {
    var that = this;
    console.log(app.globalData.openId)

    wx.request({
      url: config.service.getCollectCard,
      data: {
        openId: app.globalData.openId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.length == 0) {
          that.setData({
            hasCollect: false
          })
        }
        else {
          that.setData({
            hasCollect: true,
            collectList: res.data
          })
        }
        
      },
      fail: function (res) {
        util.showModel('提示', '获取收藏列表失败');
      }
    })
  },

  // 删除收藏的名片
  deleteCollectCard: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var collectList = that.data.collectList;

    wx.request({
      url: config.service.deleteCollectCard,
      data: {
        openId: collectList[index].open_id,
        cardId: collectList[index].card_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          collectList: res.data,
        })
        that.getCollectCard();
        util.showSuccess('删除成功！');
      },
      fail: function (res) {
        util.showModel('提示', '删除失败');
      }
    })
  },

  touchS: function (e) {

    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){   //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var collectList = this.data.collectList;
      collectList[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        collectList: collectList
      });
    }
  },



  touchE: function (e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮

      var index = e.target.dataset.index;
      var collectList = this.data.collectList;

      if (disX >= 0 && disX <= 10) {
        if (collectList[index].txtStyle == 'left:0px' || collectList[index].txtStyle == null) {
          wx.navigateTo({
            url: '../shareCard/shareCard?cardInfo=' + JSON.stringify(collectList[index])
          })
        }
      }


      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var collectList = this.data.collectList;
      collectList[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        collectList: collectList
      });
    }
  },

  //获取元素自适应后的实际宽度

  getEleWidth: function (w) {

    var real = 0;

    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {

      return false;

      // Do something when catch error

    }
  },

  initEleWidth: function () {

    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})