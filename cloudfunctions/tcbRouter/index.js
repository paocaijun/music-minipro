// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')

// 云函数入口函数,koa洋葱模型，ctx上下文
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  app.use(async(ctx,next)=>{
    ctx.data={}
    ctx.data.test='大家都有的参数'
    await next()
  })
  app.router('musiclist',async(ctx,next)=>{
    ctx.data.musicName='相遇'
    await next()
  },async(ctx,next)=>{
    ctx.data.musicType='小情歌'
    ctx.body={data:ctx.data}
  })
  return app.serve()
  
}