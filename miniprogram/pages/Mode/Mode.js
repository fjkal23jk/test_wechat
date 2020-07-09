Page({
  Parker: function() {
    console.log('point is ->');
  },

  Leaver: function() {
    console.log('Mode page');
  },

  data: {
    open_id: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function(options){
    console.log(options.open_id);
    this.setData({
      open_id: options.open_id
    })
  }
})