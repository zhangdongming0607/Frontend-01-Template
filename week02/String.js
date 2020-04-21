// 11.8.4 String Literals
// <LF> <CR>[lookahead ≠ <LF>] <LS> <PS> <CR><LF>
const LineTerminatorSequence = /[\u000a(\u000d!=\u000a)\u0028\]/
const LineContinuation = /\\/
