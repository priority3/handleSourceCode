const mySetInterval = (fn, wait) => {
  let timer = null
  // 关闭阀
  let isClear = false
  const interVal = () => {
    if (isClear) {
      isClear = false
      clearTimeout(timer)
      return
    }
    fn()
    // 重新开启
    timer = setTimeout(interVal, wait)
  }
  timer = setTimeout(interVal, wait)
  // 返回一个关闭阀
  return () => {
    isClear = true
  }
}

const a = mySetInterval(() => {
  console.log(123)
}, 1000)
