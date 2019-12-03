// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type: Object
    }
  },
  observers:{
    ['playlist.playCount'](val){
      this.setData({
        _count: this.formaterNum(val,2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count:""

  },
  onLoad:function(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formaterNum(num, point){
      let numStr=num.toString().split('.')[0]
      let len = numStr.length
      let handle = num
      if (len >= 6 && len<=8){
        handle = parseInt(numStr/10000)+"."+numStr.substr(len-6,point)+"万"
      }else if(len>8){
        handle = parseInt(numStr/100000000)+'.'+numStr.substr(len-8,point)+'亿'
      }
      return handle
    },
    goMusiclist(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    }
  }
})
