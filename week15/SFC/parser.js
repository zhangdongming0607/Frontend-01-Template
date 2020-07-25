const EOF = Symbol("EOF");

let currentToken = null; // type(text|openTag|endTag|selfClosingTag) tagName? value?
let currentAttribute = null; // name value
let currentTextNode = null;

const root = { type: "document", children: [] };
let stack = [{ type: "document", children: [] }];
const rules = [];

let parsedToken = "";

const html = `
<template>
<p>{{ greeting }} World!</p>
</template>

<script>
module.exports = {
data: function() {
  return {
    greeting: "Hello"
  };
}
};
</script>
<style scoped>
p {
font-size: 2em;
text-align: center;
}
</style>
`;

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
    element.parent = top;
    if (!token.selfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  }
  if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("tag start end doesn't match!");
    }
    stack.pop();
  }
  if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

// 等数据
function data(c) {
  if (c === "<") {
    return tagOpenState;
  }
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );

  return data;
}
function tagOpenState(c) {
  if (c === "/") {
    return endTagOpenState;
  }

  if (/^[a-zA-Z]$/.test(c)) {
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
  if (/[\/\>]/.test(c)) {
    return afterAttributeNameState(c);
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
// in script
function scriptData(c) {
  if (c === "<") {
    return scriptDataLessThanSign;
  }
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}
// in script reveived <
function scriptDataLessThanSign(c) {
  if (c === "/") {
    return scriptDataEndTagOpen;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "<",
    })
  );
  return scriptData;
}

// inscript received </
function scriptDataEndTagOpen(c) {
  if (c === "s") {
    currentToken = {
        type: 'endTag',
        tagName: c
    }  
    return scriptDataEndTagNameS;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </s
function scriptDataEndTagNameS(c) {
  if (c === "c") {
    currentToken.tagName+=c
    return scriptDataEndTagNameC;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</s",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </sc
function scriptDataEndTagNameC(c) {
  if (c === "r") {
    currentToken.tagName+=c
    return scriptDataEndTagNameR;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</sc",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </scr
function scriptDataEndTagNameR(c) {
  if (c === "i") {
    currentToken.tagName+=c
    return scriptDataEndTagNameI;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</scr",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </scri
function scriptDataEndTagNameI(c) {
  if (c === "p") {
    currentToken.tagName+=c
    return scriptDataEndTagNameP;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</scri",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </scrip
function scriptDataEndTagNameP(c) {
  if (c === "t") {
    currentToken.tagName+=c
    return scriptDataEndTag;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</scrip",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// inscript received </script
function scriptDataEndTag(c) {
  if (/[\n\t\n\r ]/.test(c)) {
    return scriptDataEndTag;
  }
  if (c === ">") {
    emit(currentToken);
    return data;
  }
  emit(
    (currentToken = {
      type: "text",
      content: "</script",
    })
  );
  emit(
    (currentToken = {
      type: "text",
      content: c,
    })
  );
  return scriptData;
}

// function markupDeclarationOpenState() {}

function parseHTML(str) {
  let state = data;
  for (let c of str) {
      parsedToken+=c
    state = state(c, parsedToken);
    if(stack[stack.length - 1].tagName === 'script' && state === data) {
        state = scriptData
    }
  }

  return stack[0];
}

try {
  module.exports = {
    parseHTML,
  };
} catch {
  window.parseHTML = parseHTML;
  window.html = html;
}
