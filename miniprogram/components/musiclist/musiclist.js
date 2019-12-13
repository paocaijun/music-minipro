// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(ev){
      let ds = ev.currentTarget.dataset
      this.setData({
        // dataset获取自定义属性
        playingId: ds.id
      })
      wx.navigateTo({
        url: `../../pages/player/player?playingId=${this.data.playingId}&index=${ds.index}`,
      })
    }
  }
})
