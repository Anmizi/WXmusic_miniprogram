class WXRequest {
  constructor(baseURL){
    this.baseURL = baseURL
  }
  request(options){
    return new Promise((resolve,reject)=>{
      wx.request({
        ...options,
        url: this.baseURL + options.url,
        success(res){
          resolve(res.data)
        },
        fail:reject
      })
    })
  }
  get(options){
    return this.request({
      ...options,
      method:'GET'
    })
  }
  post(options){
    return this.request({
      ...options,
      method:'POST'
    })
  }
}

export const wxRequest =  new WXRequest('http://codercba.com:9002')