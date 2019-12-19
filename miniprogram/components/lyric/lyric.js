// components/lyric/lyric.js
let lineHeight =0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricHidden:{
      type:Boolean,
      value:true
    },
    lyric:String
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success: function(res) {
          lineHeight = res.screenWidth/750 *64
        },
      })
    }
  },

  observers: {
    lyric(newVal) {
      // 纯音乐的处理
      if (newVal=='暂无歌词'){
        this.setData({
          lyricList:[{
            time:0,
            lrc: newVal
          }]
        })
      }else{
        this._parseLyric(newVal)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyricList:[],
    highLine:'',
    nowLyricIndex:-1, // 当前歌词的索引值
    scrollTop:0 //滚动条滚动的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(lyric){
      // 通过换行符切割获取每一行的歌词的数组
      let allLine = lyric.split('\n')
      // console.log(allLine)
      let _lyricList=[]
      allLine.forEach(line=>{
        let time = line.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time!=null){
          time = time[0]
          let lrc = line.split(time)[1]
          let timeReg = time.match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 分钟、毫秒转化为秒
          let time2sec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3])/1000; 
          _lyricList.push({
            time: time2sec,
            lrc
          })
          
        }
      })
      this.setData({
        lyricList: _lyricList
      })
    },
    // 歌曲播放触发歌词更新
    update(currentT){
      let _lyricList = this.data.lyricList
      if (_lyricList.length==0) return 
      for (let i = 0; i < _lyricList.length;i++){
        //拖动到无歌词阶段的处理
        if (currentT > _lyricList[_lyricList.length-1].time){
          if (this.data.nowLyricIndex!=-1){
            this.setData({
              nowLyricIndex:  - 1, // 设置当前歌词index为-1
              scrollTop: lineHeight * _lyricList.length  
            })
          }
        }
        // 根据currentT点位到歌词位置
        if (currentT <=_lyricList[i].time){
          this.setData({
            nowLyricIndex:i-1,
            scrollTop: lineHeight * (i-1) // 
          })
          break; // 如果不跳出循环会不断的匹配之后的歌词，造成歌词跳动
        }
      }
    }

  }
})
