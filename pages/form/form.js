// pages/form.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    success:false
  },
  bindChooseImage: function () {
    var self = this
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          images: tempFilePaths
        })
      },
    })
  },
  deleteImage:function(event){
    var dataset = event.currentTarget.dataset
    var images = this.data.images
    images.splice(dataset.index, 1)
    this.setData({
      images: images
    })
  },
  previewImage:function(event){
    var dataset = event.currentTarget.dataset
    var self = this
    wx.previewImage({
      current: dataset.src, 
      urls: self.data.images 
    })
  },
  returnHome:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  submitInfo:function(){
    this.setData({
      success:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
