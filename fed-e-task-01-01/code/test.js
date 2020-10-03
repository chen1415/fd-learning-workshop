const MyPromise = require("./Code - q4");

const promise = new MyPromise((resolve, reject) => {
  // throw new Error("exec wrong");
  // resolve("success");
  reject(100);
  // setTimeout(() => {
  //   resolve("success");
  // }, 2000);
});

function other() {
  return new MyPromise((resolve, reject) => {
    resolve("other");
  });
}

// const p1 = promise.then((value) => {
//   console.log(value);
//   return p1;
// });

promise
  .then((value) => console.log(value))
  .catch((value) => console.log(value));
// .then()
// .then(
//   (value) => console.log(value),
//   (reason) => console.log(reason)
// );
