// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  // 一个小程序只能最多写50个云函数，所以将多个方法写到同一个云函数
  //koa风格的路由工具： tcbRouter 调用next执行下一中间件，ctx.body返回数据到小程序端
  app.router('playlist',async(ctx,next)=>{
    ctx.body = await db.collection('playlist').skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then(res => {
        return res
      })
  })
  app.router('musiclist',async(ctx,next)=>{
    ctx.body = await rp(`${BASE_URL}/playlist/detail?id=${parseInt(event.id)}`).then(res=>{
      return JSON.parse(res)
    })
  })
  app.router("musicUrl",async(ctx,next)=>{
    ctx.body = await rp(`${BASE_URL}/song/url?id=${parseInt(event.id)}`).then(res=>{
      return JSON.parse(res)
    })
  })
  app.router('lyric',async(ctx,next)=>{
    ctx.body =await rp(`${BASE_URL}/lyric?id=${event.id}`).then(res=>{
      return JSON.parse(res)
    })
  })
  return app.serve()
}