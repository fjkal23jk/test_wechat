// pages/Code/Code.js
const db = wx.cloud.database({
  env: 'test-4qsby'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    open_id : '',
    current_full_date: '',
    current_full_time: 0,
    show: false,
    buttons: [
      {
          type: 'primary',
          className: '',
          text: 'Confirm',
          value: 1
      }],
      date: '',
      time:''
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
    // 1. confirm ability to cancel-> compare the current time, and the target time
    var date = new Date()
    var current_time = date.getHours() * 60 + date.getMinutes()
    var current_date = date.getDate()
    if (current_date < 10){
      current_date = '0' + current_date
    }
    var current_month = date.getMonth()+1
    if (current_month < 10){
      current_month = '0' + current_month
    }
    var current_year = date.getFullYear()
    this.setData({
      current_full_date: current_year+'-'+current_month+'-'+current_date,
      current_full_time: current_time
    })
    var that = this
    db.collection('users').doc(this.data.open_id).get().then(
      res => {
        var booked_time = parseInt(res.data.time.substring(0, 2))*60 + parseInt(res.data.time.substring(3, )) - 30;
        var booked_date = res.data.date;
        that.setData({
          time: res.data.time,
          date: res.data.date
        })
        // 2. confirm action if able to cancel
        if (booked_date > that.data.current_full_date){
          that.setData({
            show: true
          })
        }
        else if (booked_date === that.data.current_full_date){
          if (booked_time > that.data.current_full_time){
            that.setData({
              show: true
            })
          }
        }
        else{
          //cannot cancel
          wx.showToast({
            title: 'Too Late',
          })
        }
      }
      
    )
    
    // 3. cancel the task


  },
  confirm_whitdraw: function(){
    const db = wx.cloud.database({
      env: 'test-4qsby'
    });
    db.collection('users').doc(this.data.open_id).update({
            data:{
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
    wx.reLaunch({
      url: '../index/index?open_id=' + this.data.open_id + '&type=-1'
    })
  }, //special type for booked spot(in process)

  confirm: function(){
    db.collection('users').doc(this.data.open_id).get({
      success: res=>{
        if(res.data.type === 0){

          wx.redirectTo({
            url: '../Confirm/Confirm?open_id=' + this.data.open_id + '&type=0'
          })
        } else if(res.data.type === 1){

          wx.redirectTo({
            url: '../Confirm/Confirm?open_id=' + this.data.open_id + '&type=1'
          })
        }
      }
    })
  },


  openMap: function(){
  
    const db = wx.cloud.database({
      env: 'test-4qsby'
    });
    db.collection('users').doc(this.data.open_id).get().then(
      res => {
        console.log(res)
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