// pages/form.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    disease_name: "",
    disease_genetic: "",
    disease_year: "",
    phone: "",
    images: [],
    success:false
  },
  bindDiseaseName: function (e) {
    this.setData({
      disease_name: e.detail.value
    })
  },
  bindDiseaseGenetic: function (e) {
    this.setData({
      disease_genetic: e.detail.value
    })
  },
  bindDiseaseYear: function (e) {
    this.setData({
      disease_year: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
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
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  submitInfo:function(){
    if (this.data.disease_name.trim() == ""){
      console.log("请填写疾病名称")
      return
    }
    if (this.data.disease_genetic.trim() == "") {
      console.log("请填写家族病史")
      return
    }
    if (this.data.disease_year.trim() == "") {
      console.log("请填写确诊年份")
      return
    }
    if (this.data.phone.trim() == "") {
      console.log("请填写手机号")
      return
    }
    if (!(/^1\d{10}$/.test(this.data.phone))) { 
      console.log("手机号格式不对")
      return
    }
    wx.request({
      url: app.globalData.url + "/diseaseReport",
      method: "POST",
      data:{
        unionId: "123456",
        diseaseName: this.data.disease_name,
        familyMedicalHistory: this.data.disease_genetic,
        diagnosisDate: this.data.disease_year,
        reportPhone: this.data.phone
      },
      success: res => {
        console.log(res)
      },
      fail: res=> {
        console.log(res)
      }
    })
    // this.setData({
    //   success:true
    // })
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
