class Vue {
  constructor(obj_instance) {
    // 传入实例
    this.$data = obj_instance.data()
    // 监听
    Observer(this.$data)
  }
}

function Observer(data_instance) {
  if (!data_instance || typeof data_instance !== 'object') return
  const dependency = new Dependency()
  Object.keys(data_instance).forEach(key => {
    // 缓存当前值
    let value = data_instance[key]
    Observer(value)
    Object.defineProperty(data_instance, key, {
      // 可枚举
      enumerable: true,
      // 可修改
      configurable: true,
      set(newValue) {
        // console.log('设置了新属性')
        // 当设置也是一个对象时
        Observer(newValue)
        value = newValue
        dependency.notify()
      },
      get() {
        Dependency.temp && dependency.addSub(Dependency.temp)
        return value
      }
    })
  })
}

function Compile(element, vm) {
  vm.$el = document.querySelector(element)
  // 放入临时内存
  const fragment = document.createDocumentFragment()
  // console.log(vm.$el.childNodes)
  let child
  while ((child = vm.$el.firstChild)) {
    fragment.append(child)
  }
  //  替换文本内容
  function fragment_compile(node) {
    // 匹配到 {{}}
    const pattern = /\{\{\s*(\S+)\s*\}\}/
    // 纯文本节点收集依赖
    if (node.nodeType === 3) {
      const curValue = node.nodeValue
      const result_reges = pattern.exec(node.nodeValue)
      if (result_reges) {
        //链式获取
        const arr = result_reges[1].split('.')
        const value = arr.reduce((total, value) => total[value], vm.$data)
        node.nodeValue = curValue.replace(pattern, value)
        // 覆盖掉 内容更新
        new Watcher(vm, result_reges[1], newValue => {
          // 注意点 这里需要保存nodeValue内容 因为在上面插值表达式以及被替换过了
          node.nodeValue = curValue.replace(pattern, newValue)
        })
      }
      return
    }
    // v-model 收集依赖 input
    if (node.nodeType === 1 && node.nodeName === 'INPUT') {
      const attr = Array.from(node.attributes)
      // 拿到绑定的key值
      const { nodeValue } = attr[1]
      // vm 到视图的更新
      node.value = nodeValue.split('.').reduce((total, value) => total[value], vm.$data)
      new Watcher(vm, nodeValue, newValue => {
        node.value = newValue
      })

      // 从视图更新 data
      node.addEventListener('input', () => {
        // console.log(node.value)
        // 将值赋值给vm.$data
        let arr1 = nodeValue.split('.')
        // 前n-1个
        let arr2 = arr1.slice(0, arr1.length - 1)
        const curData = arr2.reduce((total, value) => total[value], vm.$data)
        curData[arr1[arr1.length - 1]] = node.value
      })
    }
    node.childNodes.forEach(item => fragment_compile(item))
  }
  fragment_compile(fragment)
  // 将文档碎片覆盖回去
  vm.$el.append(fragment)
}

// 依赖-收集和通知订阅者
class Dependency {
  constructor() {
    this.subscribers = []
  }
  addSub(sub) {
    this.subscribers.push(sub)
  }
  notify() {
    this.subscribers.forEach(item => item.update())
  }
}

// 订阅者
class Watcher {
  /**
   *
   * @param {vue实例} vm
   * @param {vue实例对应的属性} key
   * @param {如何更新文本内容} callback
   */
  constructor(vm, key, callback) {
    this.vm = vm
    this.key = key
    this.callback = callback
    // 巧妙处理 在Dependency当中需要拿到watcher
    // 将每一次的watch挂到Dependency的一个临时变量上
    Dependency.temp = this
    // 触发data的getter函数,即在fragment_compile的时候查找插值节点触发一次getter函数去收集watcher 订阅
    key.split('.').reduce((total, value) => total[value], vm.$data)
    // 触发完之后将temp置为null，防止重复添加进dependency实例当中
    Dependency.temp = null
  }
  update() {
    const value = this.key.split('.').reduce((total, current) => total[current], this.vm.$data)
    this.callback(value)
  }
}
