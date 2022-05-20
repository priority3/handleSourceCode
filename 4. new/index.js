// this 做的事情 将构造函数fn整一个实例出来并且让obj.__proto__ = fn.prototype;
// 即 create 做的事情
const myNew = (fn, ...args) => {
  // 深拷贝一下
  // const obj = Object.create(fn.prototype)
  // or
  const obj = {}
  obj.__proto__ = fn.prototype
  // this 指向新对象,即将传进来的参数绑定到这个实例上去
  fn.apply(obj, [...args])
  console.log(obj)
  // if (res && (typeof res === 'object' || typeof res === 'function')) {
  //   return res
  // }
  return obj
}

function Fun(name, age) {
  this.name = name
  this.age = age
}

Fun.prototype.say = function () {
  console.log(this.name, this.age)
}

let test = myNew(Fun, 'priority', 21)
test.say()
