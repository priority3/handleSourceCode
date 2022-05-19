;(function (root, factory) {
  if (typeof module === 'object') {
    // 即为node环境
    module.exports = factory()
  } else {
    // browser 挂在到window上
    window['Promise'] = factory()
  }
})(this, function () {
  const PENDING = 'pending'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'
  class myPromise {
    // promise 接受一个函数参数
    constructor(handle) {
      this.initValue()
      try {
        // try 处理了当handle不为函数的情况,
        // 同时bind绑定到实例上,防止在调用的时候随着函数执行环境this丢失
        handle(this._resolve.bind(this), this._reject.bind(this))
      } catch (err) {
        this._reject(err)
      }
    }
    _isFunction(fn) {
      return typeof fn === 'function'
    }
    // 初始化相关
    initValue() {
      // 初始化状态
      this.state = PENDING
      // 初始化值 .resolve .reject时的值
      this.value = undefined
      // 存放.then .catch时候的函数,
      this.callback = []
    }
    // resolve 接受一个值 在then中可以拿到，而这个值我们就可以保存在this.value中
    _resolve(data) {
      this.state === PENDING &&
        (() => {
          this.value = data
          this.state = FULFILLED
          // queueMicrotask(() => {
          //   this.callback(this.value)
          // })
          this.callback.forEach(fn => fn())
        })()
    }
    _reject(data) {
      this.state === PENDING &&
        (() => {
          this.value = data
          this.state = REJECTED
          // queueMicrotask(() => {
          //   this.callback(this.value)
          // })
          this.callback.forEach(fn => fn())
        })()
    }
    // .then当中接受两个回调，我们就暂时把resolve存放在this.callback上
    then(onFulfilled, onRejected) {
      let resolve, reject
      const newPromise = new myPromise((nextResolve, nextReject) => {
        resolve = nextResolve
        reject = nextReject
      })
      const callback = () => {
        queueMicrotask(() => {
          try {
            let newResult
            if (this.state === FULFILLED) {
              // 此时走的是_resolve
              newResult = this._isFunction(onFulfilled) ? onFulfilled(this.value) : this.value
            } else if (this._isFunction(onRejected)) {
              // 在这之后走的都是_reject 对应于 .catch(err => xxx)
              newResult = onRejected(this.value)
            } else {
              // 当reject出来之后没有参数接受时 对应于 .catch() 或者直接没有 .catch 时
              reject(this.value)
              return
            }
            if (newPromise === newResult) {
              throw TypeError('is same~~~')
            }
            if (newResult instanceof myPromise) {
              newResult.then(resolve, reject)
            } else {
              resolve(newResult)
            }
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.state === PENDING) {
        // 说明还没到resolve或者reject 那么直接push到callback当中
        this.callback.push(callback)
      } else {
        // 执行当前then的callback
        callback()
      }

      return newPromise
    }
    catch(onRejected) {
      return this.then(undefined, onRejected)
    }
  }
  return myPromise
})
