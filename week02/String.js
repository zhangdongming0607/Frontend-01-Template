// 11.8.4 String Literals
// <LF> <CR>[lookahead ≠ <LF>] <LS> <PS> <CR><LF>
const LineTerminator = /[\n\r\u2028\u2029]/
// const LineContinuation = /["\\\n\r\u2028\u2029]/
// SourceCharacter but not one of " or \ or LineTerminator
const DoubleStringCharacterMain = /(?:[^"\\\n\r\u2028\u2029])/
/* *
 * CharacterEscapeSequence
 * 0[lookahead ∉ DecimalDigit]
 * HexEscapeSequence
 * UnicodeEscapeSequence
 * */
const SingleEscapeCharacter = /'"\\bfnrtv/
const CharacterEscapeSequence = /['"\\bfnrtv\n\r\u2028\u2029]/

const DoubleStringCharacter = /(?:[^"\\\n\r\u2028\u2029]\\w\W)/


/(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9afA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*/

// 我认输了。。。

