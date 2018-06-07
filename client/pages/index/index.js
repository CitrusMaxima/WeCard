//index.js
//获取应用实例

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({
  data: {
    // text:"这是一个页面"
    //template_id: 1,
  },

  onLoad: function (options) {
    var that = this
    var person = JSON.parse(options.person)
    that.setData({
      person: person,
      imgUrl: options.imgUrl,
      template_id: person.template_id,
    });
    // that.toPersonInfo();
    console.log(that.data.person)
  },
  onShow: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var that = this;
    var touchMove = e.changedTouches[0].pageX;
    
    // 向右滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      //flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");

      if (that.data.template_id == 1) {
        that.setData({
          template_id: 2
        });
      }
      else if (that.data.template_id == 2) {
        that.setData({
          template_id: 1
        });
      }
    }

    // 向左滑动  
    if (touchMove - touchDot >= 40 && time < 10) {
      //flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");

      if (that.data.template_id == 1) {
        that.setData({
          template_id: 2
        });
      }
      else if (that.data.template_id == 2) {
        that.setData({
          template_id: 1
        });
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  saveCard: function() {
    var that = this;
    that.data.person.template_id = that.data.template_id;

    if (that.data.person.card_id) {
      // 修改名片
      wx.request({
        url: config.service.updateCard,
        data: {
          imgUrl: that.data.imgUrl,
          person: that.data.person
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          util.showSuccess('名片修改成功！');
          setTimeout(function () {
            wx.switchTab({
              url: '../aboutMe/aboutMe'
            })
          }, 1700)

        },
        fail: function (res) {
          util.showModel('提示', '名片修改失败');
        }
      })
    }
    else {
      // 新建名片
      wx.request({
        url: config.service.addCard,
        data: {
          openId: app.globalData.openId,
          imgUrl: that.data.imgUrl,
          person: that.data.person
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          util.showSuccess('名片创建成功！');
          setTimeout(function () {
            wx.switchTab({
              url: '../aboutMe/aboutMe'
            })
          }, 1700)
          
        },
        fail: function (res) {
          util.showModel('提示', '名片创建失败');
        }
      })
    }

    
  },

})
