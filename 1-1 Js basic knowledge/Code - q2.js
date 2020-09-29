/**
 *
 * Hao Chen
 * 作业: 模块一
 *
 * 代码题: #2
 *
 * Sept. 2020.
 */

const fp = require("lodash/fp");

//数据
//horsepower 马力， dollar_value 价格, in_stock 库存

const cars = [
  { name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true },
  {
    name: "Spyker C12 zagato",
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  { name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false },
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: "Pagani Huayra",
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false,
  },
];

/*
  #2 - 1
*/
const f1 = fp.flowRight(fp.prop("in_stock"), fp.last);
console.log(f1(cars));

/*
  #2 - 2
*/
const f2 = fp.flowRight(fp.prop("name"), fp.first);
console.log(f2(cars));

/*
  #2 - 3
*/
const _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length;
};

const averageDollarValue = fp.flowRight(
  _average,
  fp.map(fp.prop("dollar_value"))
);

console.log(averageDollarValue(cars));

/*
  #2 - 3
*/

const _udnerscore = fp.replace(/\W+/g, "_");

const sanitizeNames = fp.flowRight(fp.map(fp.flowRight(_udnerscore, fp.toLower)));

console.log(sanitizeNames(["Hello World"]));
