const { camelizeKeys } = require("humps");
const {
  getAbstractProperties,
  defaultFlexValues,
} = require("./getAbstractProperties");
const { nullishOperate } = require("./utils");

const getStyle = (element) => {
  if (!element.style) {
    element.style = {};
  }
  for (let key in element.computedStyle) {
    const { value } = element.computedStyle[key];
    if (/\d+(px)?$/.test(value)) {
      element.style[camelizeKeys(key)] = parseInt(value);
    } else {
      element.style[camelizeKeys(key)] = value;
    }
  }
};

const layout = (element) => {
  getStyle(element);
  if (
    element.computedStyle &&
    element.computedStyle.display &&
    element.computedStyle.display.value !== "flex"
  )
    return;
  let style = element.style;
  if (!element || element.type !== "element") return;
  if (!element.computedStyle) return;
  if (element.style.display !== 'flex') return
  // 用来做 render 的实际值
  let elementStyle = { ...element.style };
  // style.order 处理
  const items = [...element.children]
    .filter((e) => e.type === "element")
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  // 给默认值
  style = Object.keys(style).reduce((prev, k) => {
    // width 和 height auto 值处理
    if (["width", "height"].includes(k) && ["auto", ""].includes(style[k])) {
      return { ...prev, [k]: null };
    }
    // flex 相关属性默认值
    if (Object.keys(defaultFlexValues).includes(k) && !style[k]) {
      return { ...prev, [k]: defaultFlexValues[k] };
    }
    return { ...prev, [k]: style[k] };
  }, defaultFlexValues);

  const abstractProperties = getAbstractProperties(style);

  elementStyle = { ...elementStyle, ...abstractProperties };
  const {
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
  } = abstractProperties;
  // 处理 mainSize 默认值问题
  let isAutoMainSize = false;
  // 只要没有写 mainSize，无论 flex-wrap 值是什么，不定 mainSize 都会被内容自动撑开
  if (!style[mainSize]) {
    // style[abstractProperties.mainSize] = items.reduce()
    isAutoMainSize = true;
    elementStyle[mainSize] = items.reduce(
      (prevVal, curItem) =>
        prevVal + nullishOperate(curItem.style[mainSize], 0),
      0
    );
    isAutoMainSize = true;
  }
  const flexLine = [];
  const flexLines = [flexLine];
  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;
  items.forEach((item) => {
    getStyle(item);
    // 子元素的实际样式
    const itemStyle = { ...item.style };
    item.itemStyle = itemStyle;
    if (itemStyle.flex) {
      // 带 flex 属性的元素随便伸缩
      flexLine.push(item);
      // question1
    } else if (isAutoMainSize || elementStyle.flexWrap === "nowrap") {
      // 一定不会换行
      mainSpace -= item.itemStyle[mainSize];
      flexLine.push(item);
    } else {
      // 无论如何，item 的 mainSize 不会超过 element 的
      itemStyle[mainSize] = Math.min(
        itemStyle[mainSize],
        elementStyle[mainSize]
      );
      // 正常换行的 flex 流，且容器内容均规定了 mainSize 值
      if (mainSpace < itemStyle[mainSize]) {
        // 当前剩余 mainSpace 不足以放当前 item，结算当前 flexLine 信息并换行
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = computedStyle[mainSize];
        crossSpace = 0;
      } else {
        // 当前行足够放
        flexLine.push(item);
      }
      mainSpace -= itemStyle[mainSize];
    }
    // question5
    crossSpace = Math.max(
      crossSpace,
      nullishOperate(item.itemStyle[crossSize], 0)
    );
  });
  // 处理可能存在的没有排完的最后一行
  flexLine.mainSpace = mainSpace;
  // 这个只是内容决定的 crossSpace，并没有考虑剩余空间
  flexLine.crossSpace = crossSpace;
  // question6
  if (!flexLines.includes(flexLine)) {
    flexLines.push(flexLine);
  }
  // 开始处理伸缩，空白问题
  if (mainSpace < 0) {
    //压缩，只有单行可能出现这种情况
    const scale =
      elementStyle[mainSpace] / (elementStyle[mainSpace] - mainSpace);
    let currentMain = mainBase;
    items.forEach((item) => {
      const { itemStyle } = item;
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = currentMain + itemStyle[mainSize] * mainSign;
      currentMain = itemStyle[mainEnd];
    });
  } else {
    // 有剩余空间
    flexLines.forEach((flexLine) => {
      const flexItemCount = flexLine.reduce(
        (prevCount, item) => (item.itemStyle.flex ? prevCount + 1 : prevCount),
        0
      );
      let currentMain = mainBase;
      if (flexItemCount > 0) {
        // 有 item 带了 flex，直接一行填满
        const items = flexLine;
        items.forEach((item) => {
          const { itemStyle } = item;
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexItemCount) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = currentMain + itemStyle[mainSize] * mainSign;
          currentMain = itemStyle[mainEnd];
        });
      } else {
        // justify-content 开始生效
        // 只实现常见的五个
        const { justifyContent } = elementStyle;
        let currentMain; // 下面初始化放 item 的位置
        let step; // item 的「间隙」距离
        if (justifyContent === "flex-start") {
          currentMain = mainBase;
          step = 0;
        }
        if (justifyContent === "flex-end") {
          currentMain = mainBase + mainSign * mainSpace;
          step = 0;
        }
        if (justifyContent === "center") {
          currentMain = mainSpace / 2 + mainBase;
          step = 0;
        }
        if (justifyContent === "space-between") {
          currentMain = mainBase;
          step = (mainSpace / (flexLine.length - 1)) * mainSign;
        }

        if (justifyContent === "space-around") {
          step = (mainSpace / flexLine.length) * mainSign;
          currentMain = mainBase + step / 2;
        }

        flexLine.forEach((item) => {
          const { itemStyle } = item;
          // question7
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = currentMain + itemStyle[mainSize] * mainSize;
          currentMain = itemStyle[mainEnd] + step;
        });
      }
    });
  }

  // 类似与 mainSpace，算 crossSpace 和 elementStyle[crossSize]
  if (!elementStyle[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = flexLines.reduce(
      (prev, flexLine) => flexLine.crossSpace + prev,
      0
    );
  } else {
    crossSpace = elementStyle[crossSize];
    crossSpace = flexLines.reduce(
      (prev, flexLines) => prev - flexLine.crossSpace,
      crossSpace
    );
  }
  // align-content
  const { alignContent, flexWrap } = elementStyle;
  let crossStep;
  let currentCross;
  if (flexWrap === "wrap-reverse") {
    currentCross = elementStyle[crossSize];
  } else {
    currentCross = 0;
  }

  if (alignContent === "flex-start") {
    currentCross += 0;
    crossStep = 0;
  }
  if (alignContent === "flex-end") {
    currentCross += crossSign * crossSpace;
    crossStep = 0;
  }
  if (alignContent === "center") {
    currentCross += (crossSpace / 2) * crossSign;
    crossStep = 0;
  }
  if (alignContent === "space-between") {
    currentCross += 0;
    // question8
    crossStep += (crossSpace / (flexLines.length - 1)) * crossSign;
  }
  if (alignContent === "space-around") {
    crossStep = (crossSpace / flexLines.length) * crossSign;
    currentCross += crossStep / 2;
  }
  if (alignContent === "stretch") {
    currentCross += 0;
    step = 0;
  }

  // 类似与 justifyContent，计算 alignItem 的影响
  flexLines.forEach((flexLine) => {
    // stretch 需要各个 flexLine 平分 crossSpace
    const lineCrossSpace =
      elementStyle.alignContent === "stretch"
        ? crossSpace / flexLines.length + flexLine.crossSpace
        : flexLine.crossSpace;
    flexLine.forEach((item) => {
      const { itemStyle } = item;
      const align = itemStyle.alignSelf || elementStyle.alignItems || "stretch";
      if (!itemStyle[crossSize]) {
        if (align === "stretch") {
          itemStyle[crossSize] = lineCrossSpace;
        } else {
          itemStyle[crossSize] = 0;
        }
      }
      if (align === "flex-start") {
        itemStyle[crossStart] = currentCross;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "flex-end") {
        itemStyle[crossEnd] = currentCross + crossSign * crossSpace;
        itemStyle[crossStart] =
          itemStyle[crossEnd] + crossSign * itemStyle[crossSize];
      }
      if (align === "center") {
        itemStyle[crossStart] =
          currentCross +
          ((lineCrossSpace - itemStyle[crossSize]) / 2) * crossSign;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + itemStyle[crossSize] * crossSign;
      }
      if (align === "stretch") {
        itemStyle[crossStart] = currentCross;
        itemStyle[crossSize] = nullishOperate(
          itemStyle[crossSize],
          lineCrossSpace
        );
        itemStyle[crossEnd] =
          itemStyle[crossStart] + itemStyle[crossSize] * crossSign;
      }

      currentCross += crossSign + crossSign * lineCrossSpace;
    });
  });
};

module.exports = {
  layout,
};
