// pages/music-player/music-player.js
import {
  getMusicDetail,
  getMusicLyric
} from '../../services/modules/player'
const app = getApp()
const audioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    song: {},
    lyric: '',
    currentTime: 0,
    durationTime: 0,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSlidering: false
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
    this.fetchSongDetail()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
    audioContext.autoplay = true
    audioContext.onTimeUpdate(() => {
      if (!this.data.isSlidering) {
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({
          currentTime: audioContext.currentTime * 1000,
          sliderValue
        })
      }

    })
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    audioContext.onCanplay(() => {
      audioContext.play()
    })
  },
  //请求相关
  fetchSongDetail() {
    getMusicDetail(this.data.id)
      .then(res => {
        this.setData({
          song: res.songs[0],
          durationTime: res.songs[0].dt
        })
      })
    getMusicLyric(this.data.id)
      .then(res => {
        this.setData({
          lyric: res.lrc.lyric
        })
      })
  },
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
    this.setData({currentTime})
  }


})