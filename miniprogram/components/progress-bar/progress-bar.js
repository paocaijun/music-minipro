// 不需要展示在页面的数据即可定义在此
let movableAreaWidth = 0
let movableViewWidth = 0
// 再次获取背景音频
const backgroundAudioManager = wx.getBackgroundAudioManager()
let isMoving = false
Component({
  properties: {
    isSameMusic: Boolean
  },
  data: {
    showTime:{
      current:"00.00",
      total:"00.00"
    },
    movableDis:0,
    progress:0

  },
  lifetimes:{
    ready(){
      this._getMovableDis()
      this._bindBGMEvent()
      // 如果世同一首歌重新获取总时间
      if (this.properties.isSameMusic) {
        this._setTime()
      }
     
    }
  },
 
  methods: {
    bindchange(par){
      if (par.detail.source =='touch'){
        this.data.progress = par.detail.x/(movableAreaWidth-movableViewWidth)*100
        this.data.movableDis = par.detail.x
        isMoving =true
      }
    },
    // 拖拉进度条时不需要设置时间，seek方法会自动定位到那个时间
    bindtouchend(par){
      isMoving = false
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis
      })
      let seekT = backgroundAudioManager.duration * this.data.progress/100
      backgroundAudioManager.seek(seekT)

    },
   
    _getMovableDis(){
      let query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(res=>{
        movableAreaWidth = res[0].width
        movableViewWidth = res[1].width
      })

    },
    _bindBGMEvent(){
      backgroundAudioManager.onCanplay(()=>{
        // 获取总时长,可能为undefined,用类型判断undefined更准确
        if ( typeof backgroundAudioManager.duration !='undefined'){
          this._setTime()
        }else{
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onWaiting(() => {
      })
      let currentSec=-1
      backgroundAudioManager.onTimeUpdate(() => {
        let currentT = backgroundAudioManager.currentTime
        let totalT = backgroundAudioManager.duration
        let sec = currentT.toString().split('.')[0]
        if (sec != currentSec && !isMoving){
          // 节流，一秒钟执行一次
          // 拖动时不执行，避免造成回弹干扰
          let xdis =  (movableAreaWidth - movableViewWidth)* currentT/ totalT
          currentSec = sec
          this.setData({
            movableDis: xdis,
            ['showTime.current']: this.formatTime(currentT),
            // progress: backgroundAudioManager.buffered //已缓存
            progress: currentT / totalT*100   
          })
          // 触发歌词更新
          this.triggerEvent('timeUpdate', { currentT})
          }
      })
      backgroundAudioManager.onSeeking(() => {
      })
       
      backgroundAudioManager.onPlay(() => {
        isMoving = false
        this.triggerEvent('startMusic')

      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('pauseMusic')
      })
      backgroundAudioManager.onEnded(()=>{
        this.triggerEvent('musicEnd')
      })
    },
    _setTime(){
      let total = this.formatTime(backgroundAudioManager.duration)
      this.setData({
        ['showTime.total']:total
      })

    },
    // 格式化时间
    formatTime(sectime){
      let min = Math.floor(sectime / 60) 
      let sec = Math.floor(sectime%60)
      return `${this.parse0(min)}:${this.parse0(sec)}`
    },
    formatEachTime(sectime){
      let min = Math.floor(sectime / 60)
      let sec = Math.floor(sectime % 60)
      return {
        min,sec
      }
    },
    // 补零
    parse0(_time){
      return _time<10? '0'+_time:_time
    }
  }
})
