CSS

# 选择器

## 简单选择器

* *
* div svg|a
* .cls
* #id
* [attr=value] ~ |
* :hover 伪类选择器
* :before 伪元素选择器

## 复杂选择器

* 简单选择器+

## 复合选择器

* 复杂选择器 <sp> 复杂选择器
* 复杂选择器 > 复杂选择器
* 复杂选择器 ~ 复杂选择器
* 复杂选择器+复杂选择器
* 复杂选择器 || 复杂选择器

## 选择器列表

逗号分隔

## 选择器优先级

https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

复杂选择器优先级：各个选择器优先级相加

1. important
2. #id
3. .cls [type=foo]



## 树结构

* :empty 可以无回溯实现

* :nth-child()  可以无回溯实现
* :nth-last-child() 不可以无回溯实现
* 
  * :first-child 可以无回溯实现
  * :last-child 不可以无回溯实现
  *  :only-child 不可以无回溯实现

## 伪类

### 逻辑型

:not

:where :has

## 伪元素

::before ::after

::firstline  为啥没有 float 为啥都是 text 相关的

 ::firstletter









Action loadQuestion



Schema: schemas.Question



middleware













