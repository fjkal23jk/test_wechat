// pages/Mapping/Mapping.js
var res = {};
var position_address = "";
var position_latitude = "";
var position_longitude = "";
var time = "";
var date = "";
Page({
  
  data: {
    open_id: "",
    address: position_address,
    latitude: position_latitude,
    longitude: position_longitude,
    points:[{"longitude": "","latitude": "" }],
    markers: [],
    show: false,
    selectedButton: "",
    selectedMarker: {
      longitude: 0,
      latitude: 0,
      time: '',
      date: '',
      _openid:''
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
            longitude: marker.longitude,
            time: marker.time,
            date: marker.date,
            _openid: marker._openid
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
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
    let promise = new Promise(function(resolve, reject){
      console.log("choosing Location")
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
        fail: function (err) {
        // fail
          console.log(err)
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

        var min = time.substring(2)
        var hrMax = String(parseInt(time.substring(0,2)) + 1) + min
        var hrMin = String(parseInt(time.substring(0,2)) - 1) + min

        console.log('hrMax: ' + hrMax)
        console.log('hrMin: ' + hrMin)
        db.collection('users').where({
          longitude: db.command.gt(longitudeMin).and(db.command.lt(longitudeMax)),
          latitude: db.command.gt(latitudeMin).and(db.command.lt(latitudeMax)),
          date: date,
          time: db.command.gt(hrMin).and(db.command.lt(hrMax)),
          type: 0
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
                time: res.data[key].time,
                date: res.data[key].date,
                _openid: res.data[key]._openid,
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
          type: 1, // -1 initial, 0 leaver, 1 parker, 2, process
          latitude: this.data.selectedMarker.latitude,
          longitude: this.data.selectedMarker.longitude,
          time: this.data.selectedMarker.time
        }
      })
      db.collection('users').doc(this.data._openid).update({
        data: {
          type: 2, // -1 initial, 0 leaver, 1 parker, 2, process
        }
      })
      // redirect to index
      wx.reLaunch({
        url: '../index/index?open_id=' + this.data.open_id + '&type=1'
      })
      
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
    const db = wx.cloud.database({
      env: 'test-4qsby'
    })
    db.collection('users').doc(this.data.open_id).get().then(
      res => {
        time = res.data.time;
        date = res.data.date;
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