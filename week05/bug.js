const promise = new Promise((resolve) => {
  resolve(1)
  resolve(2)
  resolve(3)
})

promise.then(res => console.log(res))
