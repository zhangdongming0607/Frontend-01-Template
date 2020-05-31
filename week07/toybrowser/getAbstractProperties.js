// flex 相关属性默认值

const ELEMENT_WIDTH = Symbol("element_width");
const ELEMENT_HEIGHT = Symbol("element_height");

// question2
const defaultFlexValues = {
  alignItems: "stretch",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexWrap: "no-wrap",
};

const getAbstractProperties = (style) => {
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  const { flexDirection, flexWrap } = style;
  if (flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
    crossSign = +1;
    crossBase = 0;
  }

  if (flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
    crossSign = +1;
    crossBase = 0;
  }

  if (flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "bottom";
    mainSign = -1;
    // question3
    mainBase = ELEMENT_WIDTH;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
    crossSign = +1;
    crossBase = 0;
  }

  if (flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
    crossSign = +1;
    crossBase = 0;
  }

  if (flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = ELEMENT_HEIGHT;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
    crossSign = +1;
    crossBase = 0;
  }
  if (flexWrap === "wrap-reverse") {
    let temp = crossStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
  }
  return {
    mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase,
  };
};

module.exports = {
  getAbstractProperties,
  ELEMENT_WIDTH,
  defaultFlexValues
};
