// pages/detail-song/detail-song.js
import {
  recommendStore
} from '../../store/recommendStore'
import {rankingStore} from '../../store/rankingStore'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    key: '',
    songs: [],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      type,
      key
    } = options
    this.data.type = type
    this.data.key = key
    if(type === 'ranking'){
      this.handleFetchRankingData(key)
    }else if(type === 'recommend'){
      this.handleFetchRecommendData(key)
    }
  },
  //事件处理方法
  handleFetchRankingData(key){
    rankingStore.onState(key,value=>{
      this.setData({songs:value.tracks,name:value.name})
      wx.setNavigationBarTitle({
        title: value.name,
      })
    })
  },
  handleFetchRecommendData(key){
    recommendStore.onState(key,value=>{
      this.setData({songs:value,name:'推荐歌曲'})
      wx.setNavigationBarTitle({
        title: '推荐歌曲',
      })
    })
  },
  onUnload() {},



})