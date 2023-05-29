import {
  getMusicBanner,
  getPlayListDetail
} from '../../services/modules/music';
import {
  querySelector
} from '../../utils/query-selector';
import {recommendStore} from '../../store/recommendSong'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    bannerList: [],
    bannerHeight: 130,
    recommendSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchMusicBanner()
    this.fetchRecommendSongs()
  },
  //请求获取数据方法
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({
      bannerList: res.banners
    })
  },
  fetchRecommendSongs(){
    recommendStore.onState('recommendSongs',value=>{
      this.setData({recommendSongs:value.slice(0,6)})
    })
    recommendStore.dispatch('fetchRecommendSongsAction')
  },
  //事件处理函数
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  onBannerImageLoad() {
    querySelector('.image')
      .then(res => {
        if (this.data.bannerHeight !== res[0].height) {
          this.setData({
            bannerHeight: res[0].height
          })
        }
      })
  },
  onMoreClick(){
    wx.navigateTo({
      url: '/pages/detail-song/detail-song',
    })
  }

})