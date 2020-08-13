// pages/Confirm/Confirm.js
import drawQrcode from './weapp.qrcode.min.js'
const db = wx.cloud.database({
  env: 'test-4qsby'
});



Page({

  /**
   * 页面的初始数据
   */
  data: {
    open_id: '',
    type: -1,
    encodedMsg: '',
    status: '',
    canClick: false,
    objectID: '',
    objectPoint: 0
  },

  getQRCode: function(){
    let that = this
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      typeNumber: 10,
      text: that.data.encodedMsg,
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  openScanner: function(){
    let that = this
    const _ = db.command
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res=>{
        console.log(res.result)
        console.log(that.data.encodedMsg)
        if(that.data.encodedMsg === res.result){   
          
          wx.showToast({
            title: 'Confirmed',
          })
          that.setData({
            status: 'Confirmed',
            canClick: true
          })
          db.collection('users').doc(that.data.open_id).update({
            data:{
              points: _.inc(-1),
              name: '',
              longitude: '',
              latitude: '',
              car_brand: '',
              car_color: '',
              license_plate: '',
              type: -1, // -1 initial, 0 leaver, 1 parker 
              time: '00:00',
              date: '0000-00-00',
              parkingOn: '',
              encodedMsg: ''
            }
          })
        } else {
          wx.showToast({
            title: 'wrong person',
          })
        }
      }
    })
  },

  finishConfirm: function(){
    let that = this
    const _ = db.command
    // leaver clicks finish
    if(this.data.type === 0){
      db.collection('users').doc(this.data.objectID).get({
        success: res=>{
          // the right parker scanned the qrcode
          if(res.data.points < that.data.objectPoint){
            db.collection('users').doc(that.data.open_id).update({
              data:{
                points: _.inc(1),
                name: '',
                longitude: '',
                latitude: '',
                car_brand: '',
                car_color: '',
                license_plate: '',
                type: -1, // -1 initial, 0 leaver, 1 parker 
                time: '00:00',
                date: '0000-00-00',
                parkingOn: '',
                encodedMsg: ''
              }, success: result => {
                wx.reLaunch({
                  url: '../index/index?open_id=' + that.data.open_id + '&type=-1'
                })
              }
            })
          } else { // parker didn't scan yet    
            wx.showToast({
              title: 'Parker Scanned Failed',
            })
          }
        }
      })
      

    } else { // parker clicks finish
      if(this.data.canClick === true){
        wx.reLaunch({
          url: '../index/index?open_id=' + that.data.open_id + '&type=-1'
        })
      } else {
        wx.showToast({
          title: 'Scan Item First',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.type === '0'){
      that.setData({
        open_id: options.open_id,
        type: 0,
        objectID: options.objectID,
        objectPoint: options.objectPoint
      })
    } else {
      that.setData({
        open_id: options.open_id,
        type: 1
      })
    }
    db.collection('users').doc(options.open_id).get({
      success: res =>{
        that.setData({
          encodedMsg: res.data.encodedMsg
        })
      }
    })

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