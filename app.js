//app.js
App({
  globalData:{
    url: "https://dfc0b424.ngrok.io",
    userInfo: null,
    openid: '',
    sessionKey: "szu0/z63GeoRUv3qt+p60g==",
    unionid: "o18tW0gyYhMyk_4-vZTLl02GkAx0"
  },
  onLaunch: function () {
    if(!this.globalData.unionid){
      // 登录
      wx.login({
        success: res => {
          wx.request({
            url: this.globalData.url + '/wechat/user/login',
            data: {
              "code": res.code
            },
            success: res => {
              this.globalData.openid = res.openid
              this.globalData.sessionKey = res.sessionKey
              this.globalData.unionid = res.unionid
            },
            fail: res => {
              console.log(res)
            }
          })
        }
      })
    }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log(res)
            }
          })
        }
      }
    })
  }
})