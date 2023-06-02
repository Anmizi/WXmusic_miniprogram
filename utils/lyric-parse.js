export const lyricParse = (lyricStr) => {
  const lyricArr = lyricStr.split('\n')
  const res = []
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  lyricArr.forEach(item=>{
    const result = timeReg.exec(item)
    if(!result) return;
    const time = result[1] * 60 * 1000 + result[2] * 1000 + result[3] * 1
    const text = item.replace(timeReg,'')
    if(!text) return;
    res.push({
      time,
      text
    })
  })
  return res
}