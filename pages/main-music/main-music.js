import {
  getMusicBanner
} from '../../services/modules/music';
import {
  querySelector
} from '../../utils/query-selector';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    bannerList: [],
    bannerHeight: 130
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchMusicBanner()
  },
  //请求获取数据方法
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({
      bannerList: res.banners
    })
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
  }

})