const images = require("images");
const createViewPort = (width, height) => images(width, height)
const render = (viewport, element) => {
    const style = {...element.style, ...element.elementStyle, ...element.itemStyle}
    if(style) {
        const img = images(style.width, style.height)
        if(style['background-color']) {
            const color = style['background-color']
            if(!color) return
            console.log(color, style)
            const result = color.match(/rgb\((\d+),(\d+),(\d+)\)/).slice(1).map(Number)
            img.fill(...result, 1)
            viewport.draw(img, style.left || 0, style.top || 0)
        }
        
    }
    if(element.children) {
        Array.from(element.children).forEach(child => {
            render(viewport, child)
        });
    }
};

module.exports = {
  render,
  createViewPort,
};
