// pages/Mapping/Mapping.js
var res = {};
var position_address = "";
var position_latitude = "";
var position_longitude = "";
var time = "";
var date = "";
const db = wx.cloud.database({
  env: 'test-4qsby'
});
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
      _id:''
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
            _id: marker._id
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
            _id: that.data.open_id
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
        var longitudeMax = Math.max(result[1] - 0.003, result[1] + 0.003)
        var longitudeMin = Math.min(result[1] - 0.003, result[1] + 0.003)
        var latitudeMax = Math.max(result[0] - 0.003, result[0] + 0.003)
        var latitudeMin = Math.min(result[0] - 0.003, result[0] + 0.003)

        var min = time.substring(2)
        var hrMax = String(parseInt(time.substring(0,2)) + 1) + min
        var hrMin = String(parseInt(time.substring(0,2)) - 1) + min

        console.log('hrMax: ' + hrMax)
        console.log('hrMin: ' + hrMin)
        console.log(that.data.open_id)

        db.collection('users').where({
          longitude: db.command.gt(longitudeMin).and(db.command.lt(longitudeMax)),
          latitude: db.command.gt(latitudeMin).and(db.command.lt(latitudeMax)),
          date: date,
          time: db.command.gt(hrMin).and(db.command.lt(hrMax))
        }).get({
          success: res => {
            console.log(res);
            var i = 0;
            let leaverArray = [];
            let processingArray = [];
            for (let key in res.data) {
              if(res.data[key].type === 0){
                leaverArray.push(res.data[key]);
              } else if(res.data[key].type === 1){
                processingArray.push(res.data[key].parkingOn)
              }
            }
            let resultArray = leaverArray.filter(n => !processingArray.includes(n._id))
            console.log(resultArray);
            for(let key in resultArray){
              tempMarkers.push({
                iconPath: "/images/user.png",
                id: i,
                latitude: resultArray[key].latitude,
                longitude: resultArray[key].longitude,
                time: resultArray[key].time,
                date: resultArray[key].date,
                _id: resultArray[key]._id,
                width: 30,
                height: 30,
                callout: {
                  content: resultArray[key].name,
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
            resolve()
          },
          fail: err => {
            console.log(err);
            reject()
          }
        })
      })

    
  },

  buttontap: function(e){
    console.log(e.detail)
    var that = this
    if(e.detail.item.text === 'Confirm'){
      let promise = new Promise(function(resolve, reject){
        db.collection('users').doc(that.data.open_id).update({
          data: {
            type: 1, // -1 initial, 0 leaver, 1 parker, 2, process
            latitude: that.data.selectedMarker.latitude,
            longitude: that.data.selectedMarker.longitude,
            time: that.data.selectedMarker.time,
            parkingOn: that.data.selectedMarker._id
          },
          success: function(){
            resolve()
          },
          fail: function(err){
            console.log(err)
            reject()
          }
        })
        console.log(that.data.selectedMarker._id);
      })
      promise.then(function(){
        // redirect to index
        wx.reLaunch({
          url: '../index/index?open_id=' + that.data.open_id + '&type=1'
        })
      }).catch(
        function(){
          console.log('error...')
        }
      )

      
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