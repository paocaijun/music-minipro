// pages/player/player.js
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前播放的序号和id
let playIndex = 0;
let playId=0;
// 获取app.js页面的内容
const app = getApp()
Page({
  data: {
    alPicUrl:"",
    isplaying:false,
    songname:"",
    musiclist:[],
    isLyricHidden:true,
    lyric:"",
    isSameMusic:false

  },
  onLoad: function (options) {
    playIndex = options.index
    playId = options.musicId
    this._getMusicDetail(options)
  },
  changeLyricType(){
    this.setData({
      isLyricHidden: !this.data.isLyricHidden
    })
  },
  timeUpdate(event){
    this.selectComponent('.x-lyric').update(event.detail.currentT)
  },
  // 初始化播放
  _getMusicDetail(opt){
    //播放之前判断是否为同一首歌曲
    if(opt.musicId ==app.getMusicId()){
      this.setData({
        isSameMusic : true
      })
    }else{
      backgroundAudioManager.pause()
      this.setData({
        isSameMusic: false
      })
    }
    console.log(this.data.isSameMusic,'this.data.isSameMusic ')
    let musiclist = wx.getStorageSync('musiclist')
    let music = musiclist[opt.index]
    // 更新当前播放歌曲的id
    app.setMusicId(opt.musicId)
    this.setData({
      songname:music.name,
      alPicUrl: music.al.picUrl,
      musiclist: musiclist
    })
    wx.setNavigationBarTitle({
      title: music.name,
    })
    wx.showLoading({
      title: '歌曲加载中',
    })
    // 获取音乐播放链接
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url: "musicUrl",
        id: opt.musicId
      }
    }).then(res=>{
      // 无法播放VIP歌单 
      if (res.result.data[0].url==null){
        wx.showToast({
          title:"无权限播放"
        })
        return
      }
      if (!this.data.isSameMusic){
        backgroundAudioManager.src = res.result.data[0].url // 每次赋值src时重新播放
        backgroundAudioManager.title = music.name
        backgroundAudioManager.epname = music.al.name
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
      }
      wx.hideLoading()
      this.setData({
        isplaying:true
      })
      // 获取歌词
      wx.cloud.callFunction({
        name: "music",
        data: {
          $url: "lyric",
          id: opt.musicId
        }
      }).then(res => {
        let lyric = '暂无歌词'
        if (res.result.lrc){
          lyric = res.result.lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  // 系统控制按钮同步播放按钮
  pauseMusic(){
    this.setData({
      isplaying:false
    })
  },
  startMusic(){
    this.setData({
      isplaying: true
    })
  },
  togglePlay(){
    this.data.isplaying ? backgroundAudioManager.pause() : backgroundAudioManager.play()
    this.setData({
      isplaying: !this.data.isplaying
    })
  },
  prePlay(){
    playIndex--
    if (playIndex<0){
      playIndex = this.data.musiclist.length-1
    }
    this._getMusicDetail({ musicId: this.data.musiclist[playIndex].id, index: playIndex})
  },
  nextPlay() {
    playIndex++
    if (playIndex > this.data.musiclist.length-1) {
      playIndex =0
    }
    this._getMusicDetail({ musicId: this.data.musiclist[playIndex].id, index: playIndex })
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