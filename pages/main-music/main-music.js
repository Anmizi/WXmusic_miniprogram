import {
  getMusicBanner,
  getHotPlaylist
} from '../../services/modules/music';
import {
  querySelector
} from '../../utils/query-selector';
import {recommendStore} from '../../store/recommendStore'
import {rankingStore} from '../../store/rankingStore'
import {playlistStore} from '../../store/playlistStore'
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
    recommendPlaylist:[],
    rankingInfo:{},
    song:{},
    isPlaying:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchMusicBanner()
    this.fetchRecommendSongs()
    this.fetchHotPlaylist()
    this.fetchRecommendPlaylist()
    this.fetchRankingData()
    playlistStore.onStates(['song','isPlaying'],this.getStateData)
  },
  getStateData(data){
    const {song,isPlaying} = data
    if(song){
      this.setData({song})
    }
    if(isPlaying !== undefined){
      this.setData({isPlaying})
    }
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
  fetchRankingData(){
    rankingStore.onStates(['newRanking','originRanking','upRanking'],value=>{
      this.setData({rankingInfo:{...this.data.rankingInfo,...value}})
    })
    rankingStore.dispatch('fetchRankingDataAction')
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
    //推荐歌曲
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=recommend&key=recommendSongs`,
    })
  },
  //保持播放列表
  onSavePlaylist(e){
    const idx = e.currentTarget.dataset.index
    playlistStore.setState('playSongList',this.data.recommendSongs)
    playlistStore.setState('currentPlayIdx',idx)
  },
  onPlayOrPause(){
    playlistStore.dispatch('handlePlayOrPauseAction',!this.data.isPlaying)
  },
  onItemClick(e){
    e.preventPa
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },
  onUnload(){
    playlistStore.offState('song',this.getStateData)
  }

})