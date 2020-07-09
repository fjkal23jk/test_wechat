// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-4qsby'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return event.userInfo;
}