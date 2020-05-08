// 1
// new Promise(resolve => resolve()).then(() => console.log('a'))
//
// setTimeout(function () {
//   console.log('b')
// })
// console.log('c')
// a b

// 2
// new Promise(resolve => resolve()).then(() => console.log("1"))
//
// setTimeout(function () {
//   console.log("2")
//   new Promise(resolve => resolve()).then(() => console.log("3"))
// }, 0)
// console.log("4")
// 4 1 2 3

// 3
// new Promise(resolve => {
//   console.log('0')
//   resolve()
// }).then(() => console.log("1"))
//
// setTimeout(function () {
//   console.log("2")
//   new Promise(resolve => resolve()).then(() => console.log("3"))
// }, 0)
// console.log("4")
// console.log("5")

// 0 4 5 1 2 3

// 4
// async function afoo() {
//   console.log("-2");
//
//   await new Promise((resolve) => resolve());
//   console.log("-1"); // 这里可以转化成 promise.then 来看
// }
//
// new Promise((resolve) => (console.log("0"), resolve())).then(
//   () => console.log("1"),
//   new Promise((resolve) => resolve()).then(() => console.log("1.5"))
// );
//
// setTimeout(function () {
//   console.log("2");
//   new Promise((resolve) => resolve()).then(() => console.log("3"));
// }, 0);
// console.log("4");
// console.log("5");
// afoo();

// 0 4 5 -2 1 -1 1.5 2 3

// 5
// async function afoo() {
//   console.log("-2");
//
//   await new Promise((resolve) => resolve());
//   console.log("-1"); // 这里可以转化成 promise.then 来看
// }
//
// new Promise((resolve) => (console.log("0"), resolve())).then(() => {
//   console.log("1"),
//     new Promise((resolve) => resolve()).then(() => console.log("1.5"));
// });
//
// setTimeout(function () {
//   console.log("2");
//   new Promise((resolve) => resolve()).then(() => console.log("3"));
// }, 0);
// console.log("4");
// console.log("5");
// afoo();

// 0 4 5 -2 1 -1 1.5 2 3

// 6
// new Promise((res) => res()).then(
//   () => setTimeout(() => console.log("1")),
//   console.log("0")
// );
// console.log("2");

// 0 2 1

// 7
async function async1() {
  console.log('async 1 start')
  await async2();  // async await 的行为？
  console.log('async 1 end') // await 之后是个微任务
}

async function async2() {
  throw Error()
  console.log('async2')
}

async1()
new Promise(function (resolve) {
  console.log("promise1")
  resolve()
}).then(() => {
  console.log("promise2")
})

/*
   async 1 start
   async2
   promise1
   async 1 end
   promise2
 */

// 8
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 1'))
  console.log('listener 1')
})

button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 2'))
  console.log('listener 2')
})

// listener 1
// microtask 1
// listener 2
// microtask 2

// 9

let button = document.querySelector('#button');

button.addEventListener('click', function CB1() {
  console.log('Listener 1');

  setTimeout(() => console.log('Timeout 1'))

  Promise.resolve().then(() => console.log('Promise 1'))
});

button.addEventListener('click', function CB1() {
  console.log('Listener 2');

  setTimeout(() => console.log('Timeout 2'))

  Promise.resolve().then(() => console.log('Promise 2'))
});

// Listener 1, Promise 1, Listener 2, Promise 2, Timeout 1, Timeout 2
