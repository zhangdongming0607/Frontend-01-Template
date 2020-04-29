
// radix 指的是输入的 str 是多少进制的
function stringToDecimalNumber(str, radix) {
  const chars = str.split('')
  let i = 0;
  let number = 0
  let currentPart = 'decimal' // decimal friction power
  let friction = 1
  let powerValue = 1
  // 对于二进制 e-10 -> 2^-10 ，powerRadix = -2
  let powerRadix = radix
  while(chars[i] !== void 0) {
    const char = chars[i]
    i++
    if(char === '.') {
      currentPart = 'friction'
      continue
    }
    if(['e', 'E'].includes(char)) {
      currentPart = 'power'
      continue
    }
    let curNumber = char.charCodeAt(0) - '0'.charCodeAt(0)

    if(currentPart === 'decimal') {
      number *= radix
      number+= curNumber
    }

    if(currentPart === 'friction') {
      friction = friction/radix
      number+=curNumber*friction
    }

    if(currentPart === 'power') {
      if( char === '-') {
        powerRadix = 1/radix
        continue
      }
      if( char === '+') {
        continue
      }
      powerValue = powerValue*powerRadix
    }
  }
  number = number * powerValue
  return number
}

console.log(stringToDecimalNumber('1010e100', 2))
