// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const URL='http://musicapi.xiecheng.live/personalized'
const rp =require('request-promise')
const db = cloud.database()
const playlistCollection= db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get().data
  // 小程序一次只能取100条,需多次取所有数据存储到云存储空间
  const count= await playlistCollection.count()
  const total = count.total;
  const MAX_LIMIT=100
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  let task=[]
  for(let i=0;i<batchTimes;i++){
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }
  let list =[]
  Promise.all(task).then(arr=>{
      list= arr.reduce((total, i) => {
        return total.data.concat(i.data)
      })
  })
 
  let playlist =await rp(URL).then(res=>{
    return JSON.parse(res).result
  })
  let uniFlag =true
  let newData=[]
  for(let i=0,len=list.length;i<len;i++){
    uniFlag = true
    for(let j=0;j<playlist.length;j++){
      if(list[i].id===playlist[j].id){
        uniFlag = false
        break
      }
      if (uniFlag){
        newData.push(playlist[j])
      }
    }
  }

  newData.forEach(item =>{
    playlistCollection.add({
      data: {
        ...item,
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('成功')
    }).catch(err=>{
      console.log('失败')
    })
  })

  return newData.length
}




















