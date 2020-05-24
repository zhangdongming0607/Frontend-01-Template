const css = require("css");

const addCssRules = (text, rules) => {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
};

// 一个的 selector 和一个 ele 是否匹配 
const singleMatch = (singleSelector, singleElement) => {
  // id 选择器
  if(singleSelector[0] === '#') {
   return singleElement.attributes.some(({name, value}) => (name === 'id' && value === singleSelector.slice(1)))
  }
  // cls 选择器
  if(singleSelector[0] === '.') {
    return singleElement.attributes.some(({name, value}) => (name === 'class' && value === singleSelector.slice(1)))
  }
  // tag 选择器
  return singleElement.tagName === singleSelector
}

// selctor 和 stack 是否匹配
const match = (selector, stackElementListReverse) => {
  //todo: 这里只实现了子孙选择器，未来会加上子选择器
  const selctorEles = selector.split(' ').reverse()
  let selctorIndex = 0
  for(let i = 0;i<stackElementListReverse.length;i++) {
    if(i === 0) {
      if(!singleMatch(selctorEles[0], stackElementListReverse[0])) {
        return false
      }
      selctorIndex++
      continue
    }

    if(singleMatch(selctorEles[i], stackElementListReverse[selctorIndex])) {
      selctorIndex++
      if(selctorIndex>selctorEles.length-1) {
        return true
      }
    }
  }
  return false
};

const specificity = (selector) => {
  const selctorEles = selector.split(' ')
  const positionMap = {
    '#': 0,
    '.': 1,
  }
  //todo: 处理子孙之外的优先级
  return selctorEles.reduce((prev, cur) => {
    const key = positionMap[cur[0]] ?? 2
    const newArr = prev.slice()
    newArr[key]++
    return newArr
  }, [0, 0, 0, 0])
}  

const compareSp = (sp1, sp2) => {
  for(let s = 0;s < sp1.length;s++) {
    if(sp1[s]!== sp2[s]){
      return sp1[s] - sp2[s]
    }
  }
  return 0
}

const cssComputing = (element, rules, stack) => {
  const stackElementListReverse = [...stack, element].reverse();
  //1. 确定 rule 是否 match 2. 确定多个 rule 的优先级
  if(!element.computedStyle) {
    element.computedStyle = {}
  }
  const matched = rules.map((rule) => {
    //todo: 实现多个选择器
    const selector = rule.selectors[0]
    const matched = match(selector, stackElementListReverse)
    if(matched) {
      const sp = specificity(selector)
      const {} = rule
      for(let r = 0;r<rule.declarations.length;r++) {
        const declaration = rule.declarations[r]
        const {computedStyle} = element
        // 判断优先级，获得最终的 rules
        if(!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if(!computedStyle[declaration.property].specificity || compareSp(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
    }
  })
};

module.exports = {
  addCssRules,
  cssComputing,
};
