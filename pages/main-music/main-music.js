import {
  getMusicBanner,
  getHotPlaylist
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
    recommendSongs:[],
    hotPlaylist:[],
    recommendPlaylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchMusicBanner()
    this.fetchRecommendSongs()
    this.fetchHotPlaylist()
    this.fetchRecommendPlaylist()
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
  async fetchHotPlaylist(){
    const res = await getHotPlaylist()
    this.setData({hotPlaylist:res.playlists})
  },
  async fetchRecommendPlaylist(){
    const res = await getHotPlaylist('华语')
    this.setData({recommendPlaylist:res.playlists})
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