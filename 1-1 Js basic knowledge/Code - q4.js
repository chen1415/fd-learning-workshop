/**
 *
 * Hao Chen
 * 作业: 模块一
 *
 * 代码题: #4
 *
 * Sept. 2020.
 */

/**
 * 手写MyPromise代码 - 思路
 *
 *
 * 1. promise 是一个类 并且这里要把这个类export出去

 * 2. Promise中有三种状态 
 *    - 成功 fulfilled
 *    - 失败 rejected
 *    - 等待 pending
 * 
 * 3. 有resolve 和 reject 方法 他们是用来修改状态的
 * 4. 这个类有一个构造函数 这个函数接受一个执行器 并且执行resolve 和reject方法
 * 5. resolve/reject 两个方法 调用时把状态修改为 fulfilled/rejected -> 此过程不可逆 (如果状态不是pending 则直接return 阻止继续运行)
 * 6. resolve/reject 方法被调用的时候要把
 * 
 * 7. then方法内部做的事情就判断状态 
 *     - 如果状态是成功 调用成功的回调函数 如果状态是失败 调用失败回调函数 
 *     - then方法是被定义在原型对象中的
 * 
 * 8. then成功回调有一个参数 表示成功之后的值 then失败回调有一个参数 表示失败后的原因
 * 
 * 9. 同一个promise对象下面的then方法是可以被调用多次的
 *
 * 10. then方法是会被多次调用的 这里分为两种情况
 *      - 同步情况不用再做处理
 *      - 异步情况下每一个成功/失败回调都应该被保存起来 然后被依次执行
 * 
 * 11. then方法是可以被链式调用的, 后面then方法的回调函数拿到值的是上一个then方法的回调函数的返回值 分两个步骤
 *      - then方法的链式调用 这里意味着then也要返回一个Promise对象
 *      - 把上一个then方法的返回值传递个下一个then方法的回调函数
 * 
 * 12. 要解决一个返回promise的问题 即不可以返回它本身的这个promise对象 (循环调用要报错)
 *
 * 13. 对错误的捕获处理 
 *      - 在构造函数里面加try catch 有错误在reject里面抛出
 *      - 在then中加try catch 有错误在下一个then的时候报
 * 
 * 14. 把then变成可选参数 不传递参数时就补一个value => value
 * 
 * 15. 添加catch方法 处理promise失败的情况
 */

const PENDING = "pending"; // 等待
const FULFILLED = "fulfilled"; // 成功
const REJECTED = "rejected"; // 失败

class MyPromise {
  constructor(exec) {
    try {
      exec(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  status = PENDING; //初始状态为pending

  value = undefined; // 成功之后的值
  reason = undefined; // 失败后的原因

  successCallback = []; //成功回调 用一个数组保存
  failCallback = []; //失败回调 用一个数组保存

  resolve = (value) => {
    if (this.status !== PENDING) return; // 如果状态不是等待 阻止程序向下执行
    this.status = FULFILLED; // 将状态更改为成功
    this.value = value; // 保存成功之后的值
    //判断成功回调数组长度 不为空则依次执行
    while (this.successCallback.length) this.successCallback.shift()();
  };
  reject = (reason) => {
    if (this.status !== PENDING) return; // 如果状态不是等待 阻止程序向下执行
    this.status = REJECTED; // 将状态更改为失败
    this.reason = reason; // 保存失败后的原因
    //判断失败回调数组长度 不为空则依次执行
    while (this.failCallback.length) this.failCallback.shift()();
  };

  then(successCallback, failCallback) {
    //没有传值就补一个
    successCallback = successCallback ? successCallback : (value) => value;
    failCallback = failCallback
      ? failCallback
      : (reason) => {
          throw reason;
        };
    //创建新的promise对象 最后返回
    const newPromise = new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        setTimeout(() => {
          //这里用异步 时的里面能够获取到newPromise
          try {
            const r = successCallback(this.value);
            /**
             * 这里要判断r的值是普通值还是promise对象
             * 如果是普通值则直接调用resolve
             *
             * 如果是promise对象则查看其返回结果
             * 结果成功调用resolve 失败调用reject
             */
            resolvePromise(newPromise, r, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          //这里用异步 时的里面能够获取到newPromise
          try {
            const r = failCallback(this.reason);
            /**
             * 这里要判断r的值是普通值还是promise对象
             * 如果是普通值则直接调用resolve
             *
             * 如果是promise对象则查看其返回结果
             * 结果成功调用resolve 失败调用reject
             */
            resolvePromise(newPromise, r, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        //把成功和失败回调保存起来
        //这里也要处理异步 和抛出错误
        this.successCallback.push(() => {
          setTimeout(() => {
            //这里用异步 时的里面能够获取到newPromise
            try {
              const r = successCallback(this.value);
              /**
               * 这里要判断r的值是普通值还是promise对象
               * 如果是普通值则直接调用resolve
               *
               * 如果是promise对象则查看其返回结果
               * 结果成功调用resolve 失败调用reject
               */
              resolvePromise(newPromise, r, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let r = failCallback(this.reason);
              /**
               * 这里要判断r的值是普通值还是promise对象
               * 如果是普通值则直接调用resolve
               *
               * 如果是promise对象则查看其返回结果
               * 结果成功调用resolve 失败调用reject
               */
              resolvePromise(newPromise, r, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return newPromise;
  }
  catch(failCallback) {
    //调用then 第一个成功回调给undefined
    return this.then(undefined, failCallback);
  }
}

function resolvePromise(newPromise, r, resolve, reject) {
  if (newPromise === r) {
    //返回了它自己 则抛出错误
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (r instanceof MyPromise) {
    //promise对象 -> 查看其返回结果
    r.then(
      (value) => resolve(value),
      (reason) => reject(reason)
    );
  } else {
    //普通值 -> 直接调用
    resolve(r);
  }
}

module.exports = MyPromise;
