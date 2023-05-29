// pages/detail-video/detail-video.js
import {getMvUrl,getMvInfo,getMvRelated} from '../../services/modules/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    mvUrl:'',
    mvInfo:{},
    relatedMvList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {id} = options
    this.setData({id})
    this.fetchMvUrl()
    this.fetchMvInfo()
    this.fetchRelatedMv()
  },
  //获取mv视频url
  fetchMvUrl(){
    getMvUrl(this.data.id)
      .then(res=>{
        this.setData({mvUrl:res.data.url})
      })
  },
  //获取视频信息
  fetchMvInfo(){
    getMvInfo(this.data.id)
      .then(res=>{
        this.setData({mvInfo:res.data})
      })
  },
  //获取相关视频
  fetchRelatedMv(){
    getMvRelated(this.data.id)
      .then(res=>{
        this.setData({relatedMvList:res.data})
      })
  }
 
})