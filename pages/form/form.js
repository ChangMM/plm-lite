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
        resolve(res.data)
      },
      fail: function (res) {
        reject("服务器错误，请稍后重试")
      },
      complete: function (res) {},
    })
  })
}

var showTip = (self, message) => {
  self.setData({
    tip_show: true,
    tip_message: message
  })
  setTimeout(() => {
    self.setData({
      tip_show: false
    })
  }, 2000)
}

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
    success:false,
    tip_message:"这是一个提示信息",
    tip_show: false,
    is_uploading: false
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
        var images = self.data.images
        self.setData({
          images: images.concat(tempFilePaths)
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
    this.setData({
      success: false
    })
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  submitInfo:function(){
    if (this.data.disease_name.trim() == ""){
      showTip(this, "请填写疾病名称")
      return
    }
    if (this.data.disease_genetic.trim() == "") {
      showTip(this, "请填写家族病史")
      return
    }
    if (this.data.disease_year.trim() == "") {
      showTip(this, "请填写确诊年份")
      return
    }
    if (this.data.phone.trim() == "") {
      showTip(this, "请填写手机号")
      return
    }
    if (!(/^1\d{10}$/.test(this.data.phone))) {
      showTip(this, "手机号格式不对")
      return
    }

    if (this.data.images.length == 0) {
      showTip(this, "请添加基因测序报告的图片")
      return
    }

    if (this.data.is_uploading) {
      return
    } else {
      this.setData({
        is_uploading: true
      })
    }

    //1. 上传图片
    const promises = this.data.images.map(function (src) {
      return uploadImage(src);
    });

    var self = this

    Promise.all(promises).then((data) => {
      console.log(data)
      for(var i = 0; i <data.length; i++){
        var temp = JSON.parse(data[i])
        if(temp.code == "000000"){
          uploaded_iamges.push(temp.data.imagePath)
          console.log(uploaded_iamges)
        }
      }
      //2.提交包括处理后的图片的数据
      wx.request({
        url: app.globalData.url + "/diseaseReport/upload",
        method: "POST",
        data: {
          unionId: app.globalData.unionid,
          diseaseName: this.data.disease_name,
          familyMedicalHistory: this.data.disease_genetic,
          diagnosisDate: this.data.disease_year,
          reportPhone: this.data.phone,
          reportImages: uploaded_iamges.join(',')
        },
        success: res => {
          if(res.data.code == "000000"){
            self.setData({
              success: true
            })
          } else {
            showTip(self, "提交失败请重试")
          }
          self.setData({
            is_uploading: false
          })
          console.log(res)
        },
        fail: res => {
          self.setData({
            is_uploading: false
          })
          console.log(res)
        }
      })
    }).catch(function (reason) {
      console.log(2)
      showTip(self, reason)
      self.setData({
        is_uploading: false
      })
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '七色堇疾病预后小程序',
      path: '/pages/index/index'
    }
  }
})
