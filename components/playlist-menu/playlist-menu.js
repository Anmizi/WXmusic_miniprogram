// components/playlist-menu/playlist-menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemList:{
      type:Array,
      value:[]
    },
    title:{
      type:String,
      value:'默认标题'
    },
    hasMore:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMoreClick(){
      wx.navigateTo({
        url: '/pages/playlist-detail/playlist-detail',
      })
    }
  }
})
