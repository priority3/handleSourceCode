module.exports = function deepCopy(target,cache = new WeakMap()){
  // 原始类型
  if(isPrimitiveType(target)) return target
  // 存在缓存
  if(cache.has(target)) return cache.get(target)
  cache.set(target,true)
  // 对象
  if(isObject(target)){
    // 对象属性可能为Symbol,可能为字符串 
    const keys = [...Object.keys(target),...Object.getOwnPropertySymbols(target)]
    const res = {}
    keys.forEach((item) => {
      res[item] = deepCopy(target[item],cache)
    })
    return res
  }
  // 数组
  if(isArray(target)){
    const res = []
    target.forEach((item,index) => {
      res[index] = deepCopy(item,cache)
    })
    return res
  }
  // map
  if(isMap(target)){
    const res = new Map()
    target.forEach((value,key) => {
      res.set(key,deepCopy(value,cache))
    })
    return res
  }
  // 函数
  if(isFunction(target)){
    
  }


  function isPrimitiveType (data) {
    const typeMap = ['Number', 'Boolean', 'String', 'Symbol', 'BigInt', 'Null', 'Undefined']
    return typeMap.includes(getDataType(data))
  }

  function getDataType (data)  {
    return Object.prototype.toString.apply(data).slice(8,-1)
  }
  function isMap  (data)  {
    return getDataType(data) === 'Map'
  }
  function isObject (data) {
    return getDataType(data) === 'Object'
  }
  function isArray (data) {
    return getDataType(data) === 'Array'
  }
  function isFunction (data) {
    return getDataType(data) === 'Function'
  }
}

const a = Symbol()
const obj = {
  a:12
}
obj[a] = 1313
console.log(Object.keys(obj));
console.log(Object.getOwnPropertySymbols(obj));
console.log(Symbol() === Symbol());
