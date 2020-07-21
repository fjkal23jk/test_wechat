// pages/Mapping/Mapping.js
var res = {};
var position_address = "";
var position_latitude = "";
var position_longitude = "";
Page({
  
  data: {
    open_id: "",
    address: position_address,
    latitude: position_latitude,
    longitude: position_longitude,
    points:[{"longitude": "","longitude": "" }],
    markers: [],
    show: false,
    selectedButton: "",
    selectedMarker: {
      longitude: 0,
      latitude: 0
    },
    buttons: [
      {
          type: 'primary',
          className: '',
          text: 'Confirm',
          value: 1
      }],
    destination: "" 
  },
  goToLocation: function(e){
    var markerID = e.markerId;
    for(let marker of this.data.markers){
      if(markerID === -1){
        wx.showToast({
          title: 'Self',
        })
        break;
      }
      if(markerID === marker.id){
        this.setData({
          show: true,
          destination: marker.callout.content,
          selectedMarker: {
            latitude: marker.latitude,
            longitude: marker.longitude
          }
        })

      }
    }
    // navigatet to next page
  }, 

  get_user_location: function(){
    var that = this
    var tempMarkers = this.data.markers
    that.setData({
      markers: []
    })
    let promise = new Promise(function(resolve, reject){
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
            height: 30,
            
          })
        that.setData({
          address: position_address,
          latitude: position_latitude,
          longitude: position_longitude,
          points: [{"longitude": position_longitude,"latitude": position_latitude }],
          markers: tempMarkers
        })
        resolve([position_latitude, position_longitude]);
        // get all leavers location within current latitude/longtitude and put in markers array
        },
        fail: function () {
        // fail
          reject(new Error("…"));
        },
        complete: function () {
        // complete
        }
        })
    });
    promise.then(
      function(result){
        const db = wx.cloud.database({
          env: 'test-4qsby'
        })
        var longitudeMax = Math.max(result[1] - 0.003, result[1] + 0.003)
        var longitudeMin = Math.min(result[1] - 0.003, result[1] + 0.003)
        var latitudeMax = Math.max(result[0] - 0.003, result[0] + 0.003)
        var latitudeMin = Math.min(result[0] - 0.003, result[0] + 0.003)
        db.collection('users').where({
          longitude: db.command.gt(longitudeMin).and(db.command.lt(longitudeMax)),
          latitude: db.command.gt(latitudeMin).and(db.command.lt(latitudeMax))
        }).get({
          success: res => {
            console.log(res);
            var i = 0;
            for (var key in res.data) {
              tempMarkers.push({
                iconPath: "/images/user.png",
                id: i,
                latitude: res.data[key].latitude,
                longitude: res.data[key].longitude,
                width: 30,
                height: 30,
                callout: {
                  content: res.data[key].name,
                  fontSize: 14,
                  bgColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#CCC",
                  padding: 4,
                  display: "BYCLICK",
                  textAlign: "center"
                  }
              })
              i++;
            }
            that.setData({
              markers: tempMarkers
            })
            console.log('done')
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    )
    
  },

  buttontap: function(e){
    console.log(e.detail)
    if(e.detail.item.text === 'Confirm'){
      const db = wx.cloud.database({
        env: 'test-4qsby'
      })
      db.collection('users').doc(this.data.open_id).update({
        data: {
          type: 1, // -1 initial, 0 leaver, 1 parker,
          latitude: this.data.selectedMarker.latitude,
          longitude: this.data.selectedMarker.longitude
        }
      })
      
      // redirect to index
      
    } else {
      console.log('err')
    }

  },

  onShow:function () {
     
  },

  

  onLoad: function (options) {
    console.log('At Mapping page ->', options.open_id);
    this.setData({
      open_id: options.open_id
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