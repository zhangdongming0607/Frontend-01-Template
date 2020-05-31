order

默认值处理：

width height 

flexDirection

aliginItems justifyContent

flexWrap

alignContent  ? defaultValue is normal

params

mainSize mainStart mainEnd mainSign mainBase

crossSize crossStart crossEnd crossSign crossSign

isAutoMainSize 不定 mainSize 被内容自动撑开

循环获取 item 的样式信息

getStyle

算 elementStyle[mainSize]  （autoMainSize）

分行

* 带 flex 的
* 带 nowrap 的
* 其他
  * item mainSize 大于 line mainSize
  * 剩余 mainSpace 不够用了，就放到下一行
* 计算 line crossSpace

算宽

* 如果宽度不够，就压缩内部元素
* 如果有剩余
  * 有 flex 的元素
    * flex 来平分
  * 没有 flex 的元素
    * 看 justify-content

算高

* 算 elementStyle[crossSize]
* flexWrap=wrap-reverse
* Align-content 的行为
* align- items 的行为





itemStyle

mainSize mainStart mainEnd

crossSize crossStart crossEnd



问题：

1.  style.flexWrap === 'nowrap' || isAutoMainSize 那里应该是 && 吧
2. 文档上说 alignItems 和 justifyContent 的默认值是 normal，为什么代码里用 stretch
3. 算 mainBase 的时候用了 style.width 和 sytle.height，但是给 isAutoMainSize 的组件补 mainSize 默认值是在那之后？
4. 没太明白为啥 layout 调用是在 tagStart 的地方，如果在这的话，应该 element 子元素还没有 push 进去？
5. 给 item 分到各个 flexLine 时，即使 itemStyle.flex 是有值的，其 crossSize 也应该和目前 crossSpace 的值做比较（也可能撑开 crossSpace） 。
6. 给 item 分到各个 flexLine 结束时，是不是要考虑最后一行没有 push 的情况（wrap 且 mainSpace）没有被填满
7. 应该是 itemStyle[mainStart] = currentMain
8. 没加 crossSign

 

