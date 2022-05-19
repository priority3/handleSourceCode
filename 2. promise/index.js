const myPromise = require('./promise')

const resolved = value => {
  return new myPromise(resolve => {
    resolve(value)
  })
}

const rejected = value => {
  return new myPromise((_, reject) => {
    reject(value)
  })
}

const deferred = () => {
  let resolve, reject
  const promise = new myPromise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return {
    promise,
    resolve,
    reject
  }
}

module.exports = {
  resolved,
  rejected,
  deferred
}
