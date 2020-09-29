/**
 *
 * Hao Chen 
 * 作业: 模块一
 * 
 * 代码题: #1
 * 
 * Sept. 2020.
 */


const promise = new Promise(function (resolve, reject) {
  const a = "hello";
  resolve(a);
});

promise
  .then((value) => {
    const b = " lagou";
    return value + b;
  })
  .then((value) => {
    const c = " I ❤ U";
    return value + c;
  })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.log(error);
  });
