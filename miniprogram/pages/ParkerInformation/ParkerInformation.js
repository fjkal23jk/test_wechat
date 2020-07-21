// pages/ParkerInformation/ParkerInformation.js
var info = {};
Page({
  data:{
    note: '',
    open_id: '',
    pickerHidden: true,
    chosen: ''
  },
  bindChange: function(e) {
    info[e.currentTarget.id] = e.detail.value
  },
  bindNoteChange: function(e){
    this.setData({
      note: e.detail.value
    })
  },
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },
  filled: function(){
    var size = 0;
    var data;
    for(data in info){
      if(info.hasOwnProperty(data)) size++;
    }
    if (size === 6) return true;
    else return false;
  },
  Map_Page: function(){
    // if something isn't entered, use a pop up to notifiy the user,
    // otherwise navigate to next page.
    if(!this.filled()){
      wx.showToast({
        title: 'Please Fill Out All Info',
        icon: 'none',
        duration: 2000
      });
    } else{
      info['note'] = this.data.note;
      const db = wx.cloud.database({
        env: 'test-4qsby'
      });
      console.log(info);
      var that = this
      db.collection('users').doc(this.data.open_id).update({
        data: {
          car_brand: info['car_brand'],
          car_color: info['car_color'],
          date: info['date'],
          license_plate: info['license_plate'],
          name: info['name'],
          note: info['note'],
          time: info['time'],
        }
      })
      wx.navigateTo({
        url: '../Mapping/Mapping?open_id=' + this.data.open_id
      })
    }
  },
  pickerConfirm(e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      chosen: e.detail.value
    })
  },

  pickerCancel() {
    this.setData({
      pickerHidden: true
    })
  },

  pickerShow() {
    this.setData({
      pickerHidden: false
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    info['data'] = e.detail.value;
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    info['time'] = e.detail.value;
    this.setData({
      time: e.detail.value
    })
  },

  onLoad: function (options) {
    console.log('At Parker page ->', options.open_id);
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
    console.log('showing...');
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