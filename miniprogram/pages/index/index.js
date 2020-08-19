//index.js

// const { fail } = require("yargs");

//获取应用实例
const app = getApp()
var open_id = '';
var check_type = false;
const db = wx.cloud.database({
  env: 'test-4qsby'
});
var EnableMsg = '';
let objectID = ''
let objectPoint = 0
const _ = db.command

Page({

  getCurrentPoint: function() {
    console.log('point is ->');
    const db = wx.cloud.database({
      env: 'test-4qsby'
    });
    var currPoint = '';
      var that = this;
      db.collection('users').doc(open_id).get().then(
        res => {
          currPoint = res.data.points;
          console.log('got current point')
          that.setData({
            currPoint
          })
        }
      )
  },

  Mode_Page: function() {
    var that = this
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
      console.log(curr_min)
      console.log(date.getHours())

      db.collection('users').doc(that.data.open_id).get({
        success: res=> {
          EnableMsg = res.data.encodedMsg
          if (res.data.date < curr_full_date && res.data.type === 0){
            resolve (true);
          }
          else{
            var total_mins = parseInt(res.data.time.substring(0,2))*60 + parseInt(res.data.time.substring(3))
            console.log(total_mins);
            console.log(curr_full_time); 
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
        console.log("resolve->",resolve)
        if (resolve === true){
          //update for points
          // check parker's location, if parker's location does not exsist, then reset all
          // else{
          //      if parker in range, leaver decrement point  
          //} 
          db.collection('users').where({
            encodedMsg: EnableMsg
          }).get({
            success: result => {
              // parker and leaver exist
              console.log("line 96")
              if(result.data.length === 2){
                if(result.data[0]._id === res.data._id){
                  objectID = result.data[1]._id
                  objectPoint = result.data[1].points
                } else {
                  objectID = result.data[0]._id
                  objectPoint = result.data[0].points
                }
              }
              db.collection('users').doc(objectID).get({
                success: result_for_object => {
                  console.log("line 108")
                  if (result_for_object.data.current_Time <= result_for_object.data.time && 
                    result_for_object.data.current_latitude <= result_for_object.data.latitude + 0.003 && 
                    result_for_object.data.current_latitude >= result_for_object.data.latitude -0.003 && 
                    result_for_object.data.current_Longitude <= result_for_object.data.longitude + 0.003 && 
                    result_for_object.data.current_Longitude >= result_for_object.data.longitude - 0.003 ) {
                      console.log("line 114")
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
                          current_latitude: '',
                          points: _.inc(-1)
                          }
                        })
                  }
                  else{
                    console.log("in else")
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
                  }
                },
                fail: err=>{
                  console.log("line 158")
                }
              })
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
        console.log('Mode page');
        setTimeout(function(){ 
        if (check_type){
          wx.navigateTo({
            url: '../Code/Code?open_id=' + that.data.open_id
          })
        }
        else{
          wx.navigateTo({
            url: '../Mode/Mode?open_id=' + that.data.open_id
          })
        }}, 2000);
      }
      }
    )
    
    
  },

  data: {
    open_id: '',
    motto: 'Current Point: ',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currPoint: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../Mode/Mode'
    })
  },
  onLoad: function (options) {
    // get open_id
    // set hasUserInfo -> true
    console.log('here is open_id->' + options.open_id)
    console.log('here is type->' + options.type)
    console.log('here is check_type->' + check_type)

    if (typeof options.open_id !== 'undefined' && options.type !== '-1'){
      console.log('Getted in the if statement')
      this.setData({
        userInfo: app.globalData.userInfo,
        open_id: options.open_id,
        hasUserInfo: true
      })
      check_type = true
    } else {
      check_type = false
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
      } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    this.getOpenID().then(
      res=>{
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          open_id: res
        })
      }
      
    )
  },


  getOpenID() {
    let promise = new Promise(function(resolve, reject) {
      var openid = 'DEFAULT';
      wx.cloud.callFunction({
        name: 'getOpenID',
        complete: res=> {
          console.log('Success! openid: ', res.result.openId)
          openid = res.result.openId;
          open_id = openid;
          resolve(openid);
        },
        fail: err=>{
          openid = 'error'
          console.log(err);
          reject(new Error("…")); 
        }
      })
    });
    promise.then(
      function(result){
        const db = wx.cloud.database({
          env: 'test-4qsby'
        })
        // TODO: perform different searches
        db.collection('users').doc(result).get().then(res => {
          // res.data 包含该记录的数据
          console.log('User already exist')
          console.log(res.data)
          console.log(res.data.type)
          if (res.data.type !== -1){
            console.log("line 149")
            check_type = true
          }
        }).catch(function(err){
          // insert & initalize points
          console.log('Inserting new user');
          db.collection('users').add({
            data:{
              _id: result,
              points: 100,
              name: '',
              longitude: '',
              latitude: '',
              car_brand: '',
              car_color: '',
              license_plate: '',
              type: -1, // -1 initial, 0 leaver, 1 parker , 2 in process 
              time: '00:00',
              date: '0000-00-00',
              parkingOn: '', // for parker, store leaver's _id
              encodedMsg: '',
              current_Time: '',
              current_Longitude: '',
              current_latitude: '',
            }
          })
        })
      },
      error => console.log(error)
    );
    return promise;
  }
})