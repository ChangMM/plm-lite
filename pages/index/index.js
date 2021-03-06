//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    viewIndex:2,
    introIndex:1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindIntroTap: function(event) {
    var dataset = event.currentTarget.dataset
    var veiwIndex = dataset.viewindex
    var introIndex = dataset.introindex
    if (this.data.viewIndex == veiwIndex && this.data.introIndex == introIndex) {
      introIndex = 0
    }
    this.setData({
      viewIndex: veiwIndex,
      introIndex: introIndex
    })
  },
  goForm:function(){
    console.log(app.globalData)
    wx.navigateTo({
      url: '/pages/form/form'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '七色堇疾病预后小程序',
      path: '/pages/index/index'
    }
  }
})
