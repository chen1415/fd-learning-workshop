/**
 *
 * Hao Chen
 * 作业: 模块一
 *
 * 代码题: #1
 *
 * Sept. 2020.
 */

const promise = new Promise(function (resolve) {
  setTimeout(() => {
    resolve("hello");
  }, 10);
});

promise
  .then((value) => {
    return new Promise(function (resolve) {
      setTimeout(() => {
        resolve(value + " lagou");
      }, 10);
    });
  })
  .then((value) => {
    return new Promise(function (resolve) {
      setTimeout(() => {
        resolve(value + " I ❤ U");
      }, 10);
    });
  })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.log(error);
  });
