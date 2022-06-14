## 知识点延申复习
#### WeakMap 与 Map/Object 区别
> key ->
Map:一个 Map 的键可以是任意值，包括函数、对象或任意基本类型。
Object:一个 Object 的键必须是一个 String 或是 Symbol。
WeakMap:WeakMap 的 key 只能是 Object 类型。 原始数据类型 是不能作为 key 的（比如 Symbol）.

针对于Map与Object的[详细区别](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_%E5%92%8C_maps_%E7%9A%84%E6%AF%94%E8%BE%83)

关于键的类型如上，
> 键的顺序：参考[es2020](https://262.ecma-international.org/11.0/#sec-ordinaryownpropertykeys)
在Object当中:当调用Object.keys()时，创建一个空的list，属性(key)首先是字符串满足数组索引(**说明一点**：在数组当中的索引本质上也是一个字符串即，a[1] === a['1']),那么会按照一个升序追加到list当中，其次是一个字符串但是不满足数组索引，按照创建的顺序(先后)往list当中追加进去，最后属性key不是一个字符串而是一个Symbol按照创建的先后顺序追加到list当中，返回list

> Map当中：Map 中的键是有序的。因此，当迭代的时候，一个 Map 对象以插入的顺序返回键值。



迭代性：
> Map:Map 是 可迭代的 的，所以可以直接被迭代。
 Object:bject 没有实现 迭代协议，所以使用 JavaSctipt 的 for...of 表达式并不能直接迭代对象。(**for...in** 表达式允许你迭代一个对象的可枚举属性,或者Object.keys(),Object.entries())
***
#### 为什么会有**WeakMap**?
他与Map很类似，同样通过key-value的形式来存取值，在Map当中相当于两个一一对应的数组，取值的时候去遍历key的数组然后对于拿到value数组上的值，时间复杂度为O(n),其次在赋值上是同理的，会去遍历找到key然后在对应的value数组上赋值，时间复杂度同样为O(n).

另外一个缺点是可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理他们，即使没有其他任何引用存在了。
那么在WeakMap当中存放的便是弱引用，这意味着在没有其他引用存在时垃圾回收能正确进行，同时WeakMap 的 key 是**不可枚举**的
