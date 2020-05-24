// 输入 html 文本，输出 DOM 树

const html = `<html maaa=a >
<head>
    <style>
body div img1 {
  width: 200px;
}    
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div .img2 {
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img class="img1" id="myid"/>
        <img class="img2" />
    </div>
</body>
</html>`;

const EOF = Symbol("EOF");
const {addCssRules, cssComputing} = require('./cssComputing')

let currentToken = null; // type(text|openTag|endTag|selfClosingTag) tagName? value?
let currentAttribute = null; // name value
let currentTextNode = null

const root = { type: "document", children: [] };
let stack = [{ type: "document", children: [] }];
const rules = []

function emit(token) {
  let top = stack[stack.length - 1] || root;
  // 在一个 token 结束时操作
  currentToken = null;
  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      tagName: token.tagName,
      attributes: Object.keys(token.attributes).map((k) => ({
        name: k,
        value: token.attributes[k],
      })),
    };
    top.children.push(element);
    cssComputing(element, rules, stack)
    element.parent = top;
    if (!token.selfClosing) {
      stack.push(element);
    }
    currentTextNode = null
  }
  if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("tag start end doesn't match!");
    } else {
      if(token.tagName === 'style') {
        addCssRules(currentTextNode.content, rules)
      }
    }
    stack.pop();
  }
  if (token.type === "text") {
    if(currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

// 等数据
function data(c) {
  if (c === "<") {
    return tagOpenState;
  }
  emit(currentToken = {
    type: "text",
    content: c,
  })

  return data;
}
function tagOpenState(c) {
  if (c === "/") {
    return endTagOpenState;
  }
  
  if(/^[a-zA-Z]$/.test(c)) {
    currentToken = {
      type: "startTag",
      tagName: c,
      attributes: {},
    };
  
    return tagNameState;
  }

}
function endTagOpenState(c) {
  currentToken = {
    type: "endTag",
    tagName: c,
  };
  return tagNameState;
}
function tagNameState(c) {
  if (c === " ") {
    return beforeAttributeNameState;
  }
  if (c === "/") {
    return selfClosingStartTagState;
  }
  if (c === ">") {
    emit(currentToken);
    return data;
  }

  currentToken.tagName += c;
  return tagNameState;
}
function beforeAttributeNameState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return beforeAttributeNameState;
  }
  if (/[\/|\>]/.test(c)) {
    return afterAttributeNameState(c);
  }
  currentAttribute = {
    name: c,
    value: "",
  };
  return attributeNameState;
}
function attributeNameState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return attributeNameState;
  }
  if (c === "=") {
    return beforeAttributeValueState;
  }
  currentAttribute.name += c;
  return attributeNameState;
}

function afterAttributeNameState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return afterAttributeNameState;
  }
  if (c === "/") {
    return selfClosingStartTagState;
  }
  if (c === "=") {
    return beforeAttributeValueState;
  }
  if (c === ">") {
    emit(currentToken);
    return data;
  }
  currentToken.attributes[currentAttribute.name] = currentAttribute.value;
  return afterAttributeNameState;
}

function beforeAttributeValueState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return beforeAttributeValueState;
  }
  if (c === '"') {
    // 双引号
    return attributeValueWithDoubleQuotedState;
  }
  if (c === "'") {
    // 单引号
    return attributeValueSingleQuotedState;
  }

  return attributeValueUnquotedState;
}
function attributeValueWithDoubleQuotedState(c) {
  if (c === '"') {
    currentToken.attributes[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValueState;
  }
  currentAttribute.value += c;
  return attributeValueWithDoubleQuotedState;
}
function attributeValueSingleQuotedState(c) {
  if (c === "'") {
    currentToken.attributes[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValueState;
  }
  currentAttribute.value += c;
  return attributeValueSingleQuotedState;
}
function attributeValueUnquotedState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    currentToken.attributes[currentAttribute.name] = currentAttribute.value;
    return afterAttributeNameState;
  }
  if (c === ">") {
    emit(currentToken);
    return data;
  }
}
function afterQuotedAttributeValueState(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return beforeAttributeNameState;
  }
  if (c === "/") {
    return selfClosingStartTagState;
  }
  if (c === ">") {
    emit(currentToken);
    return data;
  }
}
function selfClosingStartTagState(c) {
  if (c === ">") {
    currentToken.selfClosing = true;
    emit(currentToken);
    return data;
  }
}
// function markupDeclarationOpenState() {}

function parseHTML(str) {
  let state = data;
  for (let c of str) {
    state = state(c);
  }

  // return str
}

parseHTML(html)

debugger

module.exports = {
  domTree: stack[0]
}

// module.exports = {
//   parseHTML
// }
