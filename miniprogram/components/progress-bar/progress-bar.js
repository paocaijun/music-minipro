// components/progress-bar/progress-bar.js
// 不需要展示在页面的数据即可定义在此
let movableAreaWidth = 0
let movableViewWidth = 0
// 再次获取背景音频
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  properties: {

  },
  data: {
    showTime:{
      current:"00.00",
      total:"00.00"
    },
    movableDis:0,
    progress:20

  },
  lifetimes:{
    ready(){
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  methods: {
    bindchange(par){
      console.log('1111', par.detail.x,this.data.movableDis)
      if (par.detail.source){
        let currenT = par.detail.x * backgroundAudioManager.duration / (movableAreaWidth - movableViewWidth)
        console.log('_______', currenT, this.formatTime(currenT))
        backgroundAudioManager.seek(currenT)
      }
    
    },
    htouchmove(par){
      console.log('par',par)
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
        // 获取总时长可能为undefined,用类型判断undefined更准确
        if ( typeof backgroundAudioManager.duration !='undefined'){
          this._setTime()
        }else{
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onTimeUpdate(() => {
        let currentT = backgroundAudioManager.currentTime
        console.log('update', currentT)
        let totalT = backgroundAudioManager.duration

        // let current = this.formatEachTime(currentT)
        // let total = this.formatEachTime(totalT)

        if (currentT !== totalT){
          let xdis = (currentT * (movableAreaWidth - movableViewWidth)) / totalT
          this.setData({
            movableDis: xdis,
            ['showTime.current']: this.formatTime(currentT),
            progress: backgroundAudioManager.buffered
          })
          // console.log(xdis, this.data.movableDis)
          }
        
      })
      backgroundAudioManager.onSeeking(() => {
        console.log('onSeeking跳转')
      })
       
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
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
