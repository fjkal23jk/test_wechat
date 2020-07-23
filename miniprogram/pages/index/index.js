//index.js

// const { fail } = require("yargs");

//获取应用实例
const app = getApp()
var open_id = '';
var check_type = false;
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
    console.log('Mode page');
    if (check_type){
      wx.navigateTo({
        url: '../Code/Code?open_id=' + this.data.open_id
      })
    }
    else{
      wx.navigateTo({
        url: '../Mode/Mode?open_id=' + this.data.open_id
      })
    }
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
    if (typeof options.open_id !== 'undefined'){
      console.log('here is ' + options.open_id)
      this.setData({
        userInfo: app.globalData.userInfo,
        open_id: options.open_id,
        hasUserInfo: true
      })
      check_type = true
    } else {
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
              type: -1, // -1 initial, 0 leaver, 1 parker 
              time: '',
              date: ''
            }
          })
        })
      },
      error => console.log(error)
    );
    return promise;
  }
})