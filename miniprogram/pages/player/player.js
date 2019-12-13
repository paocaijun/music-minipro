// pages/player/player.js
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前播放的序号和id
let playIndex = 0;
let playId=0;
Page({
  data: {
    alPicUrl:"",
    isplaying:false,
    songname:"",
    musiclist:[]

  },
  onLoad: function (options) {
    playIndex = options.index
    playId =options.playingId
    this._getMusicDetail(options)
  },
  _getMusicDetail(opt){
    backgroundAudioManager.pause()
    let musiclist = wx.getStorageSync('musiclist')
    let music = musiclist[opt.index]
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
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url: "musicUrl",
        id: opt.playingId
      }
    }).then(res=>{
      backgroundAudioManager.src = res.result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.epname = music.al.name
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      wx.hideLoading()
      this.setData({
        isplaying:true
      })
    
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
    this._getMusicDetail({ playingId: this.data.musiclist[playIndex].id, index: playIndex})
  },
  nextPlay() {
    playIndex++
    if (playIndex > this.data.musiclist.length-1) {
      playIndex =0
    }
    this._getMusicDetail({ playingId: this.data.musiclist[playIndex].id, index: playIndex })
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