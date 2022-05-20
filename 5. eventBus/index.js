class EventEmitter {
  constructor() {
    this.typeCallback = []
  }
  _isFunction(handler) {
    return typeof handler === 'function'
  }
  on(type, handler) {
    if (!this._isFunction(handler)) {
      throw new TypeError('handler must be a function')
    }
    if (!this.typeCallback[type]) {
      // 初始一个数组放入
      this.typeCallback[type] = [handler]
    } else {
      this.typeCallback[type].push(handler)
    }
  }
  emit(type, args) {
    if (!this.typeCallback[type]) {
      throw new Error(`${type} not found`)
    }
    this.typeCallback[type].forEach(fn => fn.call(this, args))
  }
  once(type, handler) {
    if (!this._isFunction(handler)) {
      throw new TypeError('handler must be a function')
    }
    // 接受参数
    function fn(args) {
      handler(args)
      this.off(type, fn)
    }
    // 这里不直接写函数就是里面拿不到这个函数的名字
    this.on(type, fn)
  }
  off(type, handler) {
    if (!this.typeCallback[type]) {
      return
    }
    this.typeCallback[type] = this.typeCallback[type].filter(fn => {
      return fn !== handler
    })
  }
}

const emitter = new EventEmitter()
// emitter.on('login', params => {
//   console.log(params)
// })
// emitter.emit('login', [1, 2, 3, 4])

// emitter.emit('login', {
//   name: 'priority',
//   age: 21
// })
// -------------------
// function fn(params) {
//   console.log(params)
// }
// emitter.on('login', fn)
// emitter.emit('login', [1, 2, 3, 4])
// emitter.off('login', fn)
// emitter.emit('login', {
//   name: 'priority',
//   age: 21
// })
