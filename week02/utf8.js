// ref https://tools.ietf.org/html/rfc3629 这是标准
// 实际被扩展了 https://zh.wikipedia.org/wiki/UTF-8#cite_note-12
// validate with https://github.com/mathiasbynens/utf8.js

const binaryStrToHexStr = (binaryStr) => {
  return "\\x" + Number("0b" + binaryStr).toString(16);
};

const CharToUTF8ByByteLength = (byteLength, binaryStr) => {
  // 一位的不要用这个算
  // byteLength：多少个 8 位，binaryStr: 二进制字符串
  const toFilledLength = 7 - byteLength + (byteLength - 1) * 6;
  const filledBinaryStr = binaryStr.padStart(toFilledLength, "0");
  let str = "";
  for (let i = 0; i < byteLength; i++) {
    if (i === 0) {
      // 只有第一个 8 位是不同的
      const prefix = "".padStart(byteLength, "1") + "0";
      str += binaryStrToHexStr(
        prefix + filledBinaryStr.slice(0, 7 - byteLength)
      );
    } else {
      str += binaryStrToHexStr(
        "10" +
          filledBinaryStr.slice(
            7 - byteLength + (i - 1) * 6,
            7 - byteLength + i * 6
          )
      );
    }
  }
  return str;
};

function toUTF8(originStr) {
  let result = "";
  // Array.from 支持四+字节字符的遍历 —— 直接 for str 会被拆成两个字符 ref: https://zhuanlan.zhihu.com/p/31853537
  const charArray = Array.from(originStr);
  console.log(charArray[0])
  for (let i = 0; i < charArray.length; i++) {
    const char = charArray[i];
    const charPoint = char.codePointAt(0); // 同样 codePointAt 支持四+字节字符的拆分
    const binaryStr = charPoint.toString(2);
    let utf8CharStr = "";

    if (charPoint < 0x0080) {
      utf8CharStr = binaryStrToHexStr("0" + binaryStr.padStart(7, "0"));
    } else if (charPoint < 0x0800) {
      utf8CharStr = CharToUTF8ByByteLength(2, binaryStr);
    } else if (charPoint < 0x10000) {
      utf8CharStr = CharToUTF8ByByteLength(3, binaryStr);
    } else if (charPoint < 0x200000) {
      utf8CharStr = CharToUTF8ByByteLength(4, binaryStr);
    } else if (charPoint < 0x4000000) {
      utf8CharStr = CharToUTF8ByByteLength(5, binaryStr);
    } else {
      utf8CharStr = CharToUTF8ByByteLength(6, binaryStr);
    }
    result += utf8CharStr;
  }

  return result;
}

// a -> \x61
// α -> \xce\xb1
// 哈 -> \xe5\x93\x88
// 😏 -> \xf0\x9f\x98\x8f

console.log(toUTF8("😏😂"));
