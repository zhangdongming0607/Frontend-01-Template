# expression
## preview
### priority
#### primaryExpression(p184)
* reserved words
* literal
#### MemberExpression(p205)
evaluation GetValue

### concept
#### left-hand-side expression (p201)
   * NewExpression
   * CallExpression
   * ....
#### reference
* 可以理解成 「指针」，memberExpression 的返回值一定是一个指针
影响：
* delete assign 表达式会操作 reference 的，能自己产生 reference 只有 memberExpression
```javascript
class Reference {
  constructor(object, property) {
     this.object = object;
     this.peroperty = property
  }
}
```
## lesson
expression
### member
* a.b
* a['b']
* super.b
* super['b']
* new.target 判断是否是 new 构造的实例
* new Foo()

### new
new Foo

### call
* foo()
* super()
* foo()['b']
* foo().b
* foo()`abc`

*********** right-hand-side expression ************
### update
* a++
* a--
* --a
* ++ a
e.g.
++a++ 不合法
### unary
* delete a.b
* void foo()
* typeof a
* +a
* -a
* ~a
* await a
* !a
### exponential
* `**`
### multiplicative
`* / %`
### additive
+=
### shift
<< >> >>>
### relationship
 < > <= >= instanceof in
### equality
== != ==== !==
### bitwise
& ^ |
### logic 
&& ||
### conditional
? :

### type conversion

#### Boxing unBoxing ref: https://time.geekbang.org/column/article/78884
Boxing      
每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象   
Number String Symbol Boolean (Object(xxx))
new Number(123)
在 xxx.call 也会装箱  
UnBoxing  
它是对象类型到基本类型的转换  
最常见的 unBoxing 是在string/number add
还有直接调用 Number String Boolean 方法   
拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。
1. valueOf https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
2. toString   

Todo: ToPrimitive 



   
   
   



