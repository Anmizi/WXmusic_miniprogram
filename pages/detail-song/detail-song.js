// pages/detail-song/detail-song.js
import {recommendStore} from '../../store/recommendSong'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    recommendStore.onState('recommendSongs',value=>{
      this.setData({songs:value})
    })
  },

  
})