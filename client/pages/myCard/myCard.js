const app = getApp()

Page({
  data: {

  },

  onLoad: function (options) {
    var that = this
    var person = JSON.parse(options.person);
    this.setData({
      person: person,
    })
    // that.toPersonInfo();
    console.log(that.data.person)
  },

  toAddInfo: function () {
    var that = this;
    wx.navigateTo({
      url: '../addInfo/addInfo?person=' + JSON.stringify(that.data.person)
    })
  },

  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'We卡通',
      desc: app.globalData.nickName + '向你递了张名片!',
      path: '/pages/shareCard/shareCard?cardInfo=' + JSON.stringify(that.data.person)
    }
  }
})