// pages/Mapping/Mapping.js
var res = {};
var position_address = "";
var position_latitude = "";
var position_longitude = "";
Page({
  
  data: {
    address: position_address,
    latitude: position_latitude,
    longitude: position_longitude,
    points:[{"longitude": "","longitude": "" }],
    markers: [{
      // follow this format for markers
      iconPath: "/images/user.png",
      id: 0,
      latitude: 37.711442,
      longitude: -122.468097,
      width: 30,
      height: 30
      },
      {
        // follow this format for markers
        iconPath: "/images/user.png",
        id: 1,
        latitude: 37.7099,
        longitude: -122.4675,
        width: 30,
        height: 30
      }
    ]
  },

  goToLocation: function(e){
    var markerID = e.markerId;
    for(let marker of this.data.markers){
      if(markerID === -1){
        wx.showToast({
          title: 'fasdjfksaldfj',
        })
        break;
      }
      if(markerID === marker.id){
        wx.openLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
          scale: 18
        })
        break;
      }
    }
    // navigatet to next page
  }, 

  get_user_location: function(){
    var that = this
    var tempMarkers = this.data.markers
    wx.chooseLocation({
      success: function (res) {
        console.log(res,"location")
        console.log(res.name)
        console.log(res.latitude)
        console.log(res.longitude)
        console.log(res.address)
        position_address = res.address
        position_latitude = res.latitude
        position_longitude = res.longitude
        tempMarkers.push({
          iconPath: "/images/user.png",
          id: -1,
          latitude: position_latitude,
          longitude: position_longitude,
          width: 30,
          height: 30
        })
      that.setData({
        address: position_address,
        latitude: position_latitude,
        longitude: position_longitude,
        points: [{"longitude": position_longitude,"latitude": position_latitude }],
        markers: tempMarkers
      })
      // get all leavers location within current latitude/longtitude and put in markers array
      },
      fail: function () {
      // fail
      },
      complete: function () {
      // complete
      }
      })
  },

  onShow:function () {
     
  },

  

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