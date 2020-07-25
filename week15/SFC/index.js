import MyCreate from './MyCreate'
import Carousel from './index.view'

const DOMRender = (Component, dom) => {
  if (Component.appendTo) {
    Component.appendTo(dom);
  }
};

DOMRender(
  <Carousel />,
  document.getElementById("root")
);