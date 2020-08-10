// pages/Confirm/Confirm.js
import drawQrcode from './weapp.qrcode.min.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    open_id: '',
    type: -1
  },

  getQRCode: function(){
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      typeNumber: 10,
      text: 'fuck',
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  openScanner: function(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res=>{
        wx.showToast({
          title: res.result,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type === '0'){
      this.setData({
        open_id: options.open_id,
        type: 0
      })
    } else {
      this.setData({
        open_id: options.open_id,
        type: 1
      })
    }
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