import {
  wxRequest
} from '../index'

export const getTopMv = (offset = 0, limit = 20) => {
  return wxRequest.get({
    url: '/top/mv',
    data: {
      offset,
      limit
    }
  })
}
export const getMvUrl = (id) => {
  return wxRequest.get({
    url:'/mv/url',
    data:{
      id
    }
  })
}

export const getMvInfo = (id) => {
  return wxRequest.get({
    url:'/mv/detail',
    data:{
      mvid:id
    }
  })
}
export const getMvRelated = (id) => {
  return wxRequest.get({
    url:'/related/allvideo',
    data:{id}
  })
}