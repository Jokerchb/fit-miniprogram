// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var that = this;
  var openid = event.openid
  try{
        return await db.collection("sigh").where({  	
            _openid: openid
         }).limit(1000).get({
          success(res)
          {
            console.log(res)
          }
        })
      }catch(e){
        console.log(e)
      }
}