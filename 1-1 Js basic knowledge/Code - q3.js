/**
 *
 * Hao Chen
 * 作业: 模块一
 *
 * 代码题: #3
 *
 * Sept. 2020.
 */

const fp = require("lodash/fp");

const { Maybe, Container } = require("./support");

const maybe = Maybe.of([5, 6, 1]);

//exercise #1
const ex1 = (value) => {
  const fn = fp.map(fp.add(1));
  return fn(value);
};

console.log(maybe.map((x) => ex1(x)));

//exercise #2
const xs = Container.of(["do", "ray", "me", "fa", "so", "la", "ti", "do"]);

const ex2 = (value) => {
  return fp.first(value);
};

console.log(xs.map((x) => ex2(x)));

//exercise #3
const safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x]);
});

const user = { id: 2, name: "Albert" };

const ex3 = (value) => {
  return fp.first(value);
};

console.log(safeProp("name", user).map((x) => ex3(x)));

//exercise #4
const ex4 = function (n) {
  return Maybe.of(n).map(x => fp.parseInt(10, x));
};
console.log(ex4(undefined)); //for test
