// state promise state 3 : pending/rej
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class myPromise {
  // promise 传入的执行回调

  constructor(handle) {
    if (!this._isFunction(handle)) {
      throw Error('please pass in the correct function~~~')
    }
    this.initValue()
    // 初始化resolve绑定到实例上,防止随着函数执行环境的改变而改变
    handle(this.resolve.bind(this), this.reject.bind(this))
  }
  _isFunction(handle) {
    return typeof handle === 'function'
  }

  initValue() {
    // value 为保存的结果值
    this.value = undefined
    this.state = PENDING
    // resolve 或者 reject 时要把所有通过 .then 和 .catch 产生的新的 promise 的 state 也修改一下
    // 到时候直接执行这些 callbacks 就行了
    this.callback = []
  }
  resolve(data) {
    // 可以直接if判断，这里必须为箭头函数否则this为undefined
    this.state === PENDING &&
      (() => {
        // value 保存结果值
        this.value = data
        this.state = FULFILLED
        // 在注册表中去执行回调
        // 同一promise对象可以添加多个then监听，状态改变时按照注册顺序依次执行
        this.callback.forEach(fn => fn(this.value))
        // queueMicrotask(() => {
        //   this.onResolvedCallbacks.forEach(fn => fn(this.value))
        // })
      })()
  }
  reject(data) {
    this.state === PENDING &&
      (() => {
        this.value = data
        this.state = REJECTED
        // 同上
        this.onRejectedCallbacks.forEach(fn => fn(this.value))
      })()
  }
  // then返回也可以是一个promise
  then(onFulfilled, onRejected) {
    return new myPromise((nextResolve, nextReject) => {
      let callback = () => {
        // .then .catch 均为微任务 添加到微任务队列
        queueMicrotask(() => {
          let newResult
          if (this.state === FULFILLED) {
            // 对于.then((res) => {}) 和 .then()
            newResult = this._isFunction(onFulfilled)
              ? nextResolve(onFulfilled(this.value))
              : nextResolve(this.value)
          } else if (typeof onRejected === 'function') {
            // 对应于 .catch(err => xxx)   ------- 对应于 .catch() 或者直接没有 .catch 时
            newResult = onRejected(this.value)
          } else {
            nextReject(this.value)
            return
          }
          // 结果同样是一个promise
          if (newResult instanceof myPromise) {
            // TODO: ⑧理解
            // 这种时候是这个返回的 promise 的 state 决定 newPromise 的 state
            newResult.then()
          } else {
            nextResolve(newResult)
          }
        })
      }

      //
      if (this.state === PENDING) {
        this.callback.push(callback)
      } else {
        callback()
      }
    })
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}
