// 十进制数转换为某进制字符串
function DecimalNumberToString(number, x) {
  let integer = Math.floor(number)
  let friction = number - integer
  let str = ''
  while(integer > 0) {
    str = integer % x + str
    integer = Math.floor(integer / x)
  }

  if(friction > 0) {
    str+='.'
    while(friction > 0) {
      str += Math.floor(friction * x)
      friction *= x
      friction = friction - Math.floor(friction)
    }
  }

  return str
}

console.log(DecimalNumberToString(10.1, 10))
