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