var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    tempFilePaths: '',
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
  },

  onLoad: function (options) {
    

    // 页面初始化 options为页面跳转所带来的参数
    this.initEleWidth();
  },

  onReady: function () {

    // 页面渲染完成
  },

  onShow: function () {
    //util.showModel('提示', app.globalData.openId);
    this.getCard();
    // 页面显示
  },

  onHide: function () {

    // 页面隐藏
  },

  onUnload: function () {

    // 页面关闭
  },

  // 跳转
  toaddInfo: function () {
    wx.navigateTo({
      url: '../addInfo/addInfo'
    })
  },

  // 获取名片列表
  getCard: function() {
    var that = this;
    console.log(app.globalData.openId);

    wx.request({
      url: config.service.getCard,
      data: {
        openId: app.globalData.openId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data);

        if (res.data.length != 0) {
          that.getLogo();
        }


        that.setData({
          cardList: res.data,
        })

      },
      fail: function (res) {
        util.showModel('提示', '获取个人名片列表失败');
      }
    })
  },

  // 获取logo
  getLogo: function() {
    var that = this;

    wx.request({
      url: config.service.getLogo,
      data: {
        openId: app.globalData.openId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data);

        that.setData({
          logoUrl: res.data[0].logo_url,
        })

      },
      fail: function (res) {
        util.showModel('提示', '获取个人Logo失败');
      }
    })
  },

  //上传头像
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePath: res.tempFilePaths[0]
        })

        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: that.data.tempFilePath,
          name: 'file',

          success: function (res) {
            res = JSON.parse(res.data);
            console.log(res.data.imgUrl);

            wx.request({
              url: config.service.setLogo,
              data: {
                openId: app.globalData.openId,
                logoUrl: res.data.imgUrl,
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                // console.log(res.data);
                util.showSuccess('上传成功！');
                that.getLogo();
              },
              fail: function (res) {
                util.showModel('提示', '上传个人Logo失败');
              }
            })
          },

          fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },

  deleteCard: function(e) {
    var that = this;
    var cardId = e.target.dataset.text;
    console.log("card_id: " + cardId)
    
    wx.request({
      url: config.service.deleteCard,
      data: {
        cardId: cardId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          cardList: res.data,
        })
        that.getCard();
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
      } else if (disX > 0) {   //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var cardList = this.data.cardList;
      cardList[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        cardList: cardList
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
      var cardList = this.data.cardList;

      if (disX >= 0 && disX <= 10) {
        if (cardList[index].txtStyle == 'left:0px' || cardList[index].txtStyle == null) {
          wx.navigateTo({
            url: '../myCard/myCard?person=' + JSON.stringify(cardList[index])
          })
        }
      }

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      console.log(txtStyle);

      //获取手指触摸的是哪一项
      
      cardList[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        cardList: cardList
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