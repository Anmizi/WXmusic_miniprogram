// pages/playlist-detail/playlist-detail.js
import {
  getAllPlayList,
  getHotPlaylist
} from '../../services/modules/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allPlaylist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchAllPlaylist()
  },
  //请求数据
  async fetchAllPlaylist() {
    const res = await getAllPlayList()
    const allPromises = res.tags.map((item) => {
      return getHotPlaylist(item.name)
    })
    Promise.all(allPromises).then(res=>{
      this.setData({allPlaylist:res})
    })
  }


})