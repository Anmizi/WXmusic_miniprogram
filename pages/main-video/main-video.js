// pages/main-video/main-video.js
import {
  getTopMv
} from '../../services/modules/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    hasMore: true
  },
  /**
   * 页面加载时回调
   */
  onLoad() {
    this.fetchTopMv()
  },
  /**
   * 获取推荐视频列表数据
   */
  async fetchTopMv() {
    const res = await getTopMv(this.data.videoList.length)
    const videoList = [...this.data.videoList, ...res.data]
    this.setData({
      videoList,
      hasMore: res.hasMore
    })
  },
  /**
   * 滚动加载操作
   */
  onReachBottom() {
    console.log('dddddddd');
    if (this.data.hasMore) {
      this.fetchTopMv()
    }
  },
  /**
   * 下拉加载操作
   */
  onPullDownRefresh() {
    this.setData({
      videoList: [],
      hasMore: true
    })
    this.fetchTopMv().then(() => {

      wx.stopPullDownRefresh()
    })
  }

})