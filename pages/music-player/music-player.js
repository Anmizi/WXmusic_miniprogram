// pages/music-player/music-player.js
import {
  getMusicDetail,
  getMusicLyric
} from '../../services/modules/player'
import {
  lyricParse
} from '../../utils/lyric-parse'
import {playlistStore} from '../../store/playlistStore'
const app = getApp()
const audioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    song: {},
    lyric: [],
    lyricString: '',
    currentTime: 0,
    durationTime: 0,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSlidering: false,
    isPlaying: true,
    scrollTop: 0,
    currentLyricIndex: -1,
    playSongList:[],
    currentPlayIdx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.playerContentHeight
    })
    const {
      id
    } = options
    this.setData({
      id
    })
    this.handlePlaySong(id)
    playlistStore.onStates(['playSongList','currentPlayIdx'],({playSongList,currentPlayIdx})=>{
      if(playSongList){
        this.setData({playSongList})
      }
      if(currentPlayIdx !== undefined){
        this.setData({currentPlayIdx})
      }
    })
    console.log('dddddddd');
  },
  //请求相关
  fetchSongDetail(id) {
    getMusicDetail(id)
      .then(res => {
        this.setData({
          song: res.songs[0],
          durationTime: res.songs[0].dt
        })
      })
    getMusicLyric(id)
      .then(res => {

        const lyricInfo = lyricParse(res.lrc.lyric)
        this.setData({
          lyric: lyricInfo
        })
      })
  },
  //事件处理
  onSwiperChange(e) {
    this.setData({
      currentPage: e.detail.current
    })
  },
  onSliderChange(e) {
    this.data.isSlidering = false
    const currentTime = e.detail.value / 100 * this.data.durationTime
    audioContext.seek(currentTime / 1000)
    this.setData({
      currentTime
    })
  },
  onSliderChanging(e) {
    this.data.isSlidering = true
    const currentTime = e.detail.value / 100 * this.data.durationTime
    this.setData({
      currentTime
    })
  },
  onNavClick(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },
  onPlayOrPause() {
    if (this.data.isPlaying) {
      this.setData({
        isPlaying: false
      })
      audioContext.pause()
    } else {
      this.setData({
        isPlaying: true
      })
      audioContext.play()
    }
  },
  //其他方法
  async updateLyric(currentTime) {
    if (!this.data.lyric.length) return;
    let index = this.data.lyric.findIndex(item => {
      return item.time > currentTime
    })
    index = (index === -1) ? this.data.lyric.length - 1 : index - 1
    if(index !== this.data.currentLyricIndex){
      this.setData({
        lyricString: this.data.lyric[index].text,
        currentLyricIndex: index
      })
      const query = this.createSelectorQuery()
      query.select('.lyric-list .item.active').boundingClientRect()
      query.select('.lyric-list').scrollOffset()
      query.exec(res=>{
        const [rect,scrollRect] = res
        let top = (rect && rect.top) || 0
        let scrollTop = (scrollRect && scrollRect.scrollTop) || 0
        const offsetTop = scrollTop + top
        this.setData({scrollTop:offsetTop - this.data.contentHeight / 2})
      })
      
    }
    
    
    
    

  },
  onItemPrev(){
    this.onItemToggle(false)
  },
  onItemNext(){
    this.onItemToggle(true)
  },
  onItemToggle(isNext){
    const length = this.data.playSongList.length
    let index = isNext ? this.data.currentPlayIdx + 1 : this.data.currentPlayIdx - 1
    if(index >= length){
      index = 0
    }else if(index < 0){
      index = length - 1
    }
    const song = this.data.playSongList[index]
    this.setData({currentPlayIdx:index,song})
    playlistStore.setState('currentPlayIdx',index)
    this.handlePlaySong(song.id)
  },
  handlePlaySong(id){
    
    this.fetchSongDetail(id)
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    audioContext.onTimeUpdate(() => {
      if (!this.data.isSlidering) {
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({
          currentTime: audioContext.currentTime * 1000,
          sliderValue
        })
      }
      this.updateLyric(audioContext.currentTime * 1000)

    })
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    audioContext.onCanplay(() => {
      audioContext.autoplay && this.data.isPlaying && audioContext.play()
    })
  }


})