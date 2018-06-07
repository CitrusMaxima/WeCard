var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var QRCode = require('../../utils/webapp-qrcode.js')

var qrcode;
const app = getApp()

Page({
  data: {
    /*
    name: '',
    org: '',
    title: '',
    mobile: '',
    tel: '',
    email: '',
    adr: '',
    url: '',
    */
    tempFilePaths: '',
  },

  onLoad: function (options) {
    this.getLogo();

    if (options.person) {
      this.setData({
        person: JSON.parse(options.person),
      });
    }
    
    qrcode = new QRCode('canvas', {
      // text: "",
      // image: '/images/bg.jpg',
      width: 150,
      height: 150,
      colorDark: "black",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },


  // 获取logo
  getLogo: function () {
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
        // console.log(res.data);

        that.setData({
          logoUrl: res.data[0].logo_url,
        })

      },
      fail: function (res) {
        util.showModel('提示', '获取个人Logo失败');
      }
    })
  },



  tapHandler: function () {
    var that = this;
    that.setInfo();
    var person = JSON.stringify(that.data.person);
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.personInfo);
    qrcode.exportImage(function (path) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: path,
        name: 'file',

        success: function (res) {
          console.log(res)
          res = JSON.parse(res.data)
          console.log(res.data.imgUrl)
          that.setData({
            imgUrl: res.data.imgUrl,
          }),

            wx.navigateTo({
              url: '../index/index?imgUrl=' + that.data.imgUrl + '&person=' + person
            })
        },

        fail: function (e) {
          console.log(e)
        }
      })
    })
  },

  toVcf: function (person) {
    var vcf = {};
    var that = this;
    vcf.name = person.name && 'FN:' + person.name + '\r\n';
    vcf.mobile = person.mobile && 'TEL;CELL;VOICE:' + person.mobile + '\r\n';
    vcf.org = person.org && 'ORG:' + person.org + '\r\n';
    vcf.url = person.url && 'URL;WORK:' + person.url + '\r\n';
    vcf.adr = person.adr && 'ADR;WORK;PREF:' + person.adr + '\r\n';
    vcf.email = person.email && 'EMAIL;PREF;INTERNET:' + person.email + '\r\n';
    vcf.tel = person.tel && 'TEL;WORK;VOICE:' + person.tel + '\r\n';
    vcf.title = person.title && 'TITLE:' + person.title + '\r\n';

    if (vcf.name == 'undefined') vcf.name = null;
    if (vcf.mobile == 'undefined') vcf.mobile = null;
    if (vcf.org == 'undefined') vcf.org = null;
    if (vcf.url == 'undefined') vcf.url = null;
    if (vcf.adr == 'undefined') vcf.adr = null;
    if (vcf.email == 'undefined') vcf.email = null;
    if (vcf.tel == 'undefined') vcf.tel = null;
    if (vcf.title == 'undefined') vcf.title = null;

    return 'BEGIN:VCARD\r\nVERSION:3.0\r\n' + vcf.name + vcf.mobile + vcf.org + vcf.email + vcf.url + vcf.adr + vcf.tel + vcf.title + 'END:VCARD';
  },

  setInfo: function () {
    var person = {};
    var templateId = 1;
    var that = this;
    if (that.data.person) {
      person = that.data.person;
      templateId = that.data.person.template_id;
    }
    person.name = this.data.name;
    person.mobile = this.data.mobile;
    person.email = this.data.email;
    person.url = this.data.url;
    person.org = this.data.org;
    person.adr = this.data.adr;
    person.tel = this.data.tel;
    person.title = this.data.title;
    person.template_id = templateId;
    this.data.personInfo = that.toVcf(person);
    this.setData({
      person: person
    })
    // console.log(that.data.person)
    // console.log(person)
    // console.log(that.data.personInfo);
  },


  formSubmit: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value.name,
      org: e.detail.value.org,
      title: e.detail.value.title,
      mobile: e.detail.value.mobile,
      tel: e.detail.value.tel,
      email: e.detail.value.email,
      adr: e.detail.value.adr,
      url: e.detail.value.url,
    });

    that.setInfo();
    var person = JSON.stringify(that.data.person);
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.personInfo);
    qrcode.exportImage(function (path) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: path,
        name: 'file',

        success: function (res) {
          console.log(res)
          res = JSON.parse(res.data)
          console.log(res.data.imgUrl)
          that.setData({
            imgUrl: res.data.imgUrl,
          }),

            wx.navigateTo({
              url: '../index/index?imgUrl=' + that.data.imgUrl + '&person=' + person
            })
        },

        fail: function (e) {
          console.log(e)
        }
      })
    })
  }
})