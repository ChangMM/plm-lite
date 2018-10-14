// pages/form.js
const app = getApp()
var uploaded_iamges = []

// upload images
var uploadImage =  (src) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.url + '/wechat/file/upload/reportImages',
      filePath: src,
      name: 'file',
      success: function (res) {
        resolve(res)
      },
      fail: function (res) { 
        resolve(res)
      },
      complete: function (res) {},
    })
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    disease_name: "测试疾病名称",
    disease_genetic: "测试家族遗传病史",
    disease_year: "测试年份",
    phone: "13476178804",
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

    if (this.data.images.length == 0) {
      console.log("请添加基因测序报告的图片")
      return
    }

    //1. 上传图片
    const promises = this.data.images.map(function (src) {
      return uploadImage(src);
    });

    Promise.all(promises).then(function (data) {
      console.log(data)
      for(var i = 0; i <data.length; i++){
        var temp = data[i]
        if(temp.code == "000000"){
          uploaded_iamges.push(temp.data.imagePath)
        }
      }
    }).catch(function (reason) {
      console.log(res)
    });

    //2.提交包括处理后的图片的数据
    wx.request({
      url: app.globalData.url + "/diseaseReport/upload",
      method: "POST",
      data:{
        unionId: app.globalData.unionid,
        diseaseName: this.data.disease_name,
        familyMedicalHistory: this.data.disease_genetic,
        diagnosisDate: this.data.disease_year,
        reportPhone: this.data.phone,
        reportImages: uploaded_iamges.join(',')
      },
      success: res => {
        console.log(res)
      },
      fail: res=> {
        console.log(res)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
