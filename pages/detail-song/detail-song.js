// pages/detail-song/detail-song.js
import {
  recommendStore
} from '../../store/recommendStore'
import {
  rankingStore
} from '../../store/rankingStore'
import {
  getPlayListDetail
} from '../../services/modules/music'
import {playlistStore} from '../../store/playlistStore'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    key: '',
    songs: [],
    name: '',
    id: '',
    playlist:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    const {
      type,
      key,
      id
    } = options
    // this.data.type = type
    this.setData({type})
    this.data.key = key
    if (type === 'ranking') {
      this.handleFetchRankingData(key)
    } else if (type === 'recommend') {
      this.handleFetchRecommendData(key)
    } else if (type === 'menu') {
      this.data.id = id
      this.handleFetchMenuData()
    }
  },
  //网络请求数据
  async fetchMenuData() {
    const res = await getPlayListDetail(this.data.id)
    this.setData({songs:res.playlist.tracks,playlist:res.playlist})
  },
  //事件处理方法
  handleFetchRankingData(key) {
    rankingStore.onState(key, value => {
      this.setData({
        songs: value.tracks,
        name: value.name
      })
      wx.setNavigationBarTitle({
        title: value.name,
      })
    })
  },
  handleFetchRecommendData(key) {
    recommendStore.onState(key, value => {
      this.setData({
        songs: value,
        name: '推荐歌曲'
      })
      wx.setNavigationBarTitle({
        title: '推荐歌曲',
      })
    })
  },
  handleFetchMenuData() {
    this.fetchMenuData()
  },
  onSavePlaylist(e){
    const idx = e.currentTarget.dataset.index
    playlistStore.setState('playSongList',this.data.songs)
    playlistStore.setState('currentPlayIdx',idx)

  },
  onUnload() {},



})