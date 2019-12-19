# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

1、在小程序里面，规定所有的手机宽度为750rpx；这是一个相对单位，代表把屏幕分成了750份，
（理论上根据手机大小不同，显示的宽度也不同，屏幕宽点，字体等就会相对大点，所以不能用px做单位）；理解下rem布局的方式
2、父组件触发子组件的方法,选取子组件调用
：this.selectComponent('.x-lyric').updateFn(data)
3、子组件触发父组件定义的方法：
父：<x-pro bind:timeUpdate='timeUpdate'/>
子：this.triggerEvent('timeUpdate', { data})

4、在app.js定义全局数据,globalData对象，在其他页面通过getApp()方法获取app.js里面的对象

5、页面离开之后如何数据保持：
在列表点击进入播放之后，再退回列表（com/musiclist），playingId能保持不变，
而再次进入播放页面时（page/player），data.musicname等已恢复默认值，需要重新赋值，why