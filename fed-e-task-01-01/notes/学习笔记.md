---
title: JavaScript深入理解
comments: true
tags:
  - javascript
categories:
  - javascript
abbrlink: 89aff4dd
date: 2020-10-04 17:17:23
---

## 函数式编程

### 柯里化(Currying)

柯里化是函数式编程的基础 主要的想法在于利用函数式编程的概念

利用闭包的特性把原本是接受多个参数的函数封装成只接受一个参数的函数(单函数参数)

后面再配合组合的方式使用compose函数 

```js
function curry(fn){  //这里用递归实现 考虑递归条件与递归出口
  return function makeFn(...args) {
    if (args.length < fn.length) { //递归条件 - 当传入的参数的个数小于fn本身执行需要的参数的个数
      //高阶函数这里要return function
      return function (...localArgs) { 
        return makeFn(...[...args, ...localArgs]); //把上一层递归的args和本身收到的参数拼起来往下递归
      };
    }
  	return fn(...arguments); //递归出口 - 当传入的参数的个数等于执行函数所需要的参数的个数时 执行函数
  };
}
```

<!-- more -->

### 组合函数(Compose-lodash)

把一组函数组合成数据管道 按照从右到左的次序依次执行

所有被组合的函数都必须是单函数参数(多数是柯里化以后的函数)

```js
function compose (...args) {
  return function (value) {
    return args.reverse().reduce(function (acc, fn) {
      return fn(acc)
    }, value)
  }
}

const reverse = (arr) => arr.reverse()
const first  = (arr) => arr[0]
const toUpperCase = (str) => str.toUpperCase()

const f = compose(toUpperCase, first, reverse)
console.log(f(['ant', 'bat', 'cab'])) // C B A
```



### Point-Free

在函数组合的基础上继续提升 从data-first 变成method-first 

用这样的方法来构造函数组合 构造时并不涉及数据 而执行时再把需要用到的数据传进去

按照一定的步骤把小的函数给组合起来 实现特定的目的

  

这里可以用loadsh里面的fp模块实现

```js
const firstLetterToUpper = fp.flowRight(
  fp.join('. '),
  fp.map(fp.flowRight(fp.toUpper, fp.first())),
  fp.split(''),
)

console.log(firstLetterToUpper('world wild web')) //W. W. W
```



### 函子(Functor)

#### 基本概念

首先要明确一下这个概念的由来 

在传统的函数式编程中 所有的函数均应该为纯函数 也就是说这些函数本身都是没有副作用的函数

> 副作用：函数执行时不引起其他变量的变化，函数没有中间中间状态

然而在实际应用中 除了功能单一的一些工具类的函数 大部分的函数都是为了业务构造的

他们是不可能做到完全避免副作用的 所以函子的概念就诞生了

  

函子把要被改变的变量和要改变这个变量的方法封装到听一个class中 

在使用的时候从外部传入一个函数来执行想做的操作 同时这个操作也会返回一个新的函子 

这样可以做到链式操作 **函子之中包裹的这个值是永远不会被直接取出来操作的**



```js
//简单的函子的演示
class Container {
  //使用静态函数封装构造函数，这样外面调用的时候就不需要使用new
  static of (value) {
    return new Container(value)
  }

  constructor (value) {
    this._value = value
  }

  map (fn) {
    return Container.of(fn(this._value))
  }
}

//test
const r = Container.of(5) //用5来初始化这个函子
						.map((x) => x + 1) //值加一
						.map((x) => x * x) //36
```



#### Maybe函子

函子可以按照其功能或用法的特点归类成不同的函子   

比如基本的函子里面是没有判断传入的value值是不是为空或者null的 

所以可以在容器中加入判断 在value为空时不做任何处理 这样直接返回新函子



```js
// MayBe 函子
class MayBe {
  static of (value) {
    return new MayBe(value)
  }

  constructor (value) {
    this._value = value
  }

  map (fn) {
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }

  isNothing () {
    return this._value === null || this._value === undefined
  }
}

const r = MayBe.of('Hello World')
					.map(x => x.toUpperCase())
console.log(r) //HELLO WORLD


const r = MayBe.of(null)
				  .map(x => x.toUpperCase())
console.log(r) //null
```



#### 其他函子与常用库

Either函子， IO函子， Task函子等等其他函子 

具体写可以使用[FolkTale](https://folktale.origamitower.com/)



## 函数式编程的面试题

```js
const arrat = ['23', '8', '10']
//用fp进行解答 会得到错误结果
console.log(array.map(parseInt)) //[23, NaN, 2]
```

这里的错误是因为map函数本身的定义是这样的

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array 
}[, thisArg])
```

详细解释

> callback

生成新数组元素的函数，使用三个参数：

- `currentValue`

  `callback` 数组中正在处理的当前元素

- `index`可选

  `callback` 数组中正在处理的当前元素的索引

- `array`可选

  `map` 方法调用的数组。

    

而parseInt的定义是这样的

> parseInt(string, radix);

- `string`

  要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用  `ToString `抽象操作)。字符串开头的空白符将会被忽略

- `radix` 可选

  从 `2` 到 `36`，表示字符串的基数。例如指定 16 表示被解析值是十六进制数。请注意，10不是默认值

    

也就是说当我们在调用parseInt的时候我们是没有指定radix的 

而当radix取值为0， undefined或者null时parseInt不会以10进制来解析

所以实际上当执行上一步操作时 真正得到的结果是这样的

```js
parseInt('23', 0) // parseInt没有第三个参数，所以map传递进来第三个参数array可以被忽略
parseInt('8', 1)
parseInt('10', 2)

//结果[23, NaN, 2]
```

  

这个题可以用lodash中的map方法来做

**注意** 这里如果只用lodash中的普通的map方法也是会出问题的

```js
const _ = require('lodash')

// The `lodash/map` iteratee receives three arguments:
// (value, index|key, collection)
_.map(['6', '8', '10'], parseInt);
// ➜ [6, NaN, 2]

const fp = require('lodash/fp')

// The `lodash/fp/map` iteratee is capped at one argument:
// (value)
fp.map(parseInt)(['6', '8', '10']);
// ➜ [6, 8, 10]
```



