// app.js
App({
  globalData:{
    statusHeight:20,
    playerContentHeight:0,
  },
  onLaunch(){
    wx.getSystemInfo({
      success:(res)=>{
        this.globalData.statusHeight = res.statusBarHeight
        this.globalData.playerContentHeight = res.screenHeight - res.statusBarHeight - 44
      }
    })
  }
})
