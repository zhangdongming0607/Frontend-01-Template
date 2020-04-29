// 11.8.3 Numeric Literals
const NonZeroDigit = /^[1-9]$/  // 0 -> false
const DecimalDigit = /\d/
const DecimalIntegerLiteral = /^0$|^(([1-9])(\d*))$/  // 01 -> false 1 -> true
const ExponentPart = /[E|e]([+|-]?\d+)/ // e23 -> true
// DecimalIntegerLiteral . DecimalDigitsopt ExponentPartopt
const DecimalLiteralPart1 = /^(0|([1-9]\d*))\.\d+?([E|e][+|-]?\d+)?$/ // 0.12 -> true  0.12e -> false 0.12e12 -> true
// . DecimalDigits ExponentPartopt
const DecimalLiteralPart2 = /^\.\d+([E|e]([+|-]?\d+))?$/ // . -> false  .12 -> true .12e -> false .12e12 -> true
// DecimalIntegerLiteral ExponentPartopt
const DecimalLiteralPart3 = /^(0|([1-9]\d*))([E|e]([+|-]?\d+))?$/ // 12 -> true 12e -> false 12e12 -> true
const DecimalLiteral = /^(((0|([1-9]\d*))\.\d+?)|(\.\d+)|(0|([1-9]\d*)))([E|e][+|-]?\d+)?$/
const BinaryIntegerLiteral = /^0([B|b])([0|1])+$/ //0 -> false 0b -> false 0b2 -> true
const OctalIntegerLiteral = /^0([o|O])([0-7])+$/ // 0 -> false 0o -> false 0o6 -> false
const HexIntegerLiteral = /^0([x|X])([0-9a-fA-F])+$/ // 0 -> false 0x -> false 0xAf -> true
// final
const NumericLiteral = /(^(((0|([1-9]\d*))\.\d+?)|(\.\d+)|(0|([1-9]\d*)))([E|e][+|-]?\d+)?$)|(^0([B|b])([0|1])+$)|(^0([o|O])([0-7])+$)/

module.exports = {
  NumericLiteral,
  DecimalLiteral
}
