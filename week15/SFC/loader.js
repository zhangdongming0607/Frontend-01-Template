const parser = require("./parser");
const stringify = require("json-stringify-safe");
const util = require("util");

module.exports = function SCFLoader(source) {
  const tree = parser.parseHTML(source);
  let template = null;
  let script = null;
  for (let node of tree.children) {
    if (node.tagName === "template") {
      template = Array.from(node.children).find(child => child.type === 'element');
    }
    if (node.tagName === "script") {
      script = node.children[0].content;
    }
  }

  let visit = (node, depth) => {
    if (node.type === "text") {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    if (node.attributes) {
      for (let attribute of node.attributes) {
        attrs[attributes.name] = attribute.value;
      }
    }
    const children = node.children.map((node) => visit(node));
    return `MyCreate("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`;
  };

  const result = visit(template, 0);

  let r = `
     import MyCreate from 'MyCreate'
      class Carousel {
          render() {
              return ${result}
          }
          appendTo(parent) {
              this.render().appendTo(parent)
          }
      }
      export default Carousel  
    `;

  return r;
};
