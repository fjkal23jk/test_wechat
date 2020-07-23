// pages/Code/Code.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open_id : ''
  },
  // I I 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      open_id: options.open_id
    })
  },

  
  withdraw: function(){
    const db = wx.cloud.database({
      env: 'test-4qsby'
    });

  },

  openMap: function(){
  
    const db = wx.cloud.database({
      env: 'test-4qsby'
    });
    db.collection('users').doc(this.open_id).get().then(
      res => {
        wx.openLocation({
          latitude: res.data.latitude,
          longitude: res.data.longitude,
        })
      }
    )
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