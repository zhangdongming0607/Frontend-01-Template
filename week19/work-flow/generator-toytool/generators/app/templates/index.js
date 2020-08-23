import MyCreate from 'MyCreate'

const DOMRender = (Component, dom) => {
  if (Component.appendTo) {
    Component.appendTo(dom);
  }
};

DOMRender(
  <div />,
  document.getElementById("root")
);