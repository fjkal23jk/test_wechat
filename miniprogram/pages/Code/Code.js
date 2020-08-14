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
    let that = this
    let promise = new Promise(function(resolve, reject){
      var date = new Date();
      var curr_year = date.getFullYear(); 
      var curr_month = date.getMonth()+1;
      if (curr_month < 10){
        curr_month = "0"+curr_month;
      }
      var curr_date = date.getDate();
      if (curr_date < 10){
        curr_date = "0"+curr_date;
      }
      var curr_full_date = curr_year+"-"+curr_month+"-"+curr_date;
      var curr_min = date.getMinutes()+3;
      if (curr_min < 10){
        curr_min = "0"+curr_min;
      }
      var curr_hour = date.getHours()*60;
      var curr_full_time = curr_hour + parseInt(curr_min);
    
      db.collection('users').doc(that.data.open_id).get({
        success: res=> {
          if (res.data.date < curr_full_date && res.data.type === 0){
            resolve (true);
          }
          else{
            var total_mins = parseInt(res.data.time.substring(0,2))*60 + parseInt(res.data.time.substring(3)) 
            if ( total_mins < curr_full_time && res.data.type === 0){
              resolve (true);
            }
            else{
              console.log("here")
              resolve (false);
            }
          }
        }
      })
      
    });
    promise.then(
      function(resolve){
        if(resolve){
          db.collection('users').doc(that.data.open_id).update({
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
              encodedMsg: '',
              current_Time: '',
              current_Longitude: '',
              current_latitude: ''
              }
            })
          wx.reLaunch({
            url: '../index/index?open_id=' + that.data.open_id + '&type=-1'
          })
          wx.showToast({
            title: 'Time Passed',
          })
        }
        else{
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
        }
      }
    )
   


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
              encodedMsg: '',
              current_Time: '',
              current_Longitude: '',
              current_latitude: ''
            }
    })
    wx.reLaunch({
      url: '../index/index?open_id=' + this.data.open_id + '&type=-1'
    })
  }, //special type for booked spot(in process)

  confirm: function(){
    let that = this
    let promise = new Promise(function(resolve, reject){
      var date = new Date();
      var curr_year = date.getFullYear(); 
      var curr_month = date.getMonth()+1;
      if (curr_month < 10){
        curr_month = "0"+curr_month;
      }
      var curr_date = date.getDate();
      if (curr_date < 10){
        curr_date = "0"+curr_date;
      }
      var curr_full_date = curr_year+"-"+curr_month+"-"+curr_date;
      var curr_min = date.getMinutes()+3;
      if (curr_min < 10){
        curr_min = "0"+curr_min;
      }
      var curr_hour = date.getHours()*60;
      var curr_full_time = curr_hour + parseInt(curr_min);

      db.collection('users').doc(that.data.open_id).get({
        success: res=> {
          if (res.data.date < curr_full_date && res.data.type === 0){
            resolve (true);
          }
          else{
            var total_mins = parseInt(res.data.time.substring(0,2))*60 + parseInt(res.data.time.substring(3)) 
            if ( total_mins < curr_full_time && res.data.type === 0){
              resolve (true);
            }
            else{
              console.log("here")
              resolve (false);
            }
          }
        }
      })
      
    });
    promise.then(
      function(resolve){
        if(resolve){
          db.collection('users').doc(that.data.open_id).update({
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
              encodedMsg: '',
              current_Time: '',
              current_Longitude: '',
              current_latitude: ''
              }
            })
          wx.reLaunch({
            url: '../index/index?open_id=' + that.data.open_id + '&type=-1'
          })
          wx.showToast({
            title: 'Time Passed',
          })
        }
        else{
          db.collection('users').doc(this.data.open_id).get({
            success: res=>{
              if(res.data.type === 0){
                db.collection('users').where({
                  encodedMsg: res.data.encodedMsg
                }).get({
                  success: result => {
                    // parker and leaver exist
                    if(result.data.length === 2){
                      let objectID = ''
                      let objectPoint = 0
                      if(result.data[0]._id === res.data._id){
                        objectID = result.data[1]._id
                        objectPoint = result.data[1].points
                      } else {
                        objectID = result.data[0]._id
                        objectPoint = result.data[0].points
                      }
                      db.collection('users').doc(objectID).get({
                       success: res=>{
                        if (res.data.current_Time <= res.data.time && res.data.current_latitude <= res.data.latitude + 0.003 && 
                            res.data.current_latitude >= res.data.latitude -0.003 && res.data.current_Longitude <= res.data.longitude + 0.003
                            && res.data.current_Longitude >= res.data.longitude - 0.003 ) {
                          wx.redirectTo({
                            url: '../Confirm/Confirm?open_id=' + this.data.open_id + '&type=0' + '&objectID=' + objectID + '&objectPoint=' + objectPoint
                          })
                        }
                       }
                      })
                      
                      
                    } else { // only leaver exist, parker withdrawn or leaver isn't selected yet
                      wx.showToast({
                        title: 'Parker Not Ready',
                      })
                    }
                  }
                })
      
              } else if(res.data.type === 1){
                var date = new Date();
                var curr_min = date.getMinutes();
                if (curr_min < 10){
                  curr_min = "0"+curr_min;
                }
                var curr_hour = date.getHours();
                if (curr_hour < 10){
                  curr_hour = "0"+curr_hour;
                }
                var curr_full_time = curr_hour +":"+ parseInt(curr_min);
                wx.getLocation({
                  type: 'wgs84',
                  success (res) {
                    let latitude = res.latitude
                    let longitude = res.longitude
                  }
                })
                db.collection("users").doc(res.data._id).update({
                  current_Time: curr_full_time,
                  current_latitude: latitude,
                  current_Longitude: longitude
                })
                wx.redirectTo({
                  url: '../Confirm/Confirm?open_id=' + this.data.open_id + '&type=1'
                })
              }
            }
          })
        }
      }
    )
    
  },


  openMap: function(){
    let that = this
    let promise = new Promise(function(resolve, reject){
      var date = new Date();
      var curr_year = date.getFullYear(); 
      var curr_month = date.getMonth()+1;
      if (curr_month < 10){
        curr_month = "0"+curr_month;
      }
      var curr_date = date.getDate();
      if (curr_date < 10){
        curr_date = "0"+curr_date;
      }
      var curr_full_date = curr_year+"-"+curr_month+"-"+curr_date;
      var curr_min = date.getMinutes()+3;
      if (curr_min < 10){
        curr_min = "0"+curr_min;
      }
      var curr_hour = date.getHours()*60;
      var curr_full_time = curr_hour + parseInt(curr_min);
    
      db.collection('users').doc(that.data.open_id).get({
        success: res=> {
          if (res.data.date < curr_full_date && res.data.type === 0){
            resolve (true);
          }
          else{
            var total_mins = parseInt(res.data.time.substring(0,2))*60 + parseInt(res.data.time.substring(3)) 
            if ( total_mins < curr_full_time && res.data.type === 0){
              resolve (true);
            }
            else{
              console.log("here")
              resolve (false);
            }
          }
        }
      })
      
    });
    promise.then(
      function(resolve){
        if(resolve){
          db.collection('users').doc(that.data.open_id).update({
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
              encodedMsg: '',
              current_Time: '',
              current_latitude: '',
              current_Longitude: ''
              }
            })
          wx.reLaunch({
            url: '../index/index?open_id=' + that.data.open_id + '&type=-1'
          })
          wx.showToast({
            title: 'Time Passed',
          })
        }
        else{
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
        }
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