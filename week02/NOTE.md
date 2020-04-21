# 每周总结可以写在这里
Source Code
char
unicode -> 兼容 ascii
ref: https://www.fileformat.info/info/unicode/
Unicode Blocks：按照值和类型（语言）分类
https://www.fileformat.info/info/unicode/block/basic_latin/list.htm
Character Categories: 另一种分类方式
https://www.fileformat.info/info/unicode/category/index.htm
seperate space https://www.fileformat.info/info/unicode/category/Zs/list.htm
Unicode Basic Multilingual Plane (BMP)  推荐变量命名使用 bmp 之内的内容
‘xxx’.charCodeAt(0).toString(16)   -> /u 转义

Atom
inputElementDiv
whiteSpace
<TAB>(u+0009)
<VT> 纵向制表符
<FF> 
<SP>
<NBSP> 是空格，但是词不会换行
<ZWNBSP>  BOM
LineTerminator
LINE FEED (LF) 换行
CARRIAGE RETURN (CR) 回车
comment
token
puctuator
xxxxxx
identifierName
keywords
identifier
unicodeIdentifierStart
punicodeIdentifierPart
enum
literal
number
charactorieee 754 Float64Arrayhttps://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
grammar
00
0b
0o
0x
safe number range
Number.EPSILON
Number.MAX_SAFE_INTEGER
homework
match all number
string
charactor
ascii
unicode
ucs (unicode bmp)
BG（国标）
GB2312
GBK(GB13000)
BG18030
(码点？)
charCode charCodeAt fromCode
homework
utf8 encoding
grammar
直接量
doubleString/singleString
escape \x, \u     \n,\t,\b .....
template
homework
string
Boolean
null
typeof null === 'object'
undefined
浏览器格式转换
