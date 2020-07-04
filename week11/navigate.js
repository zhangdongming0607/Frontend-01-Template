const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

const findPath = async (map, start, end) => {
    map = map.slice()
    let queue = [start]
    const insert = async ([x, y], pre) => {
        if(map[y * 100 + x] !== 0) return
        if(x < 0 || y < 0 || x > 99 || y > 99) return
        map[y * 100 + x] = pre
        containerEle.children[y].children[x].style.background = "lightgreen"
        // await sleep(5)
        queue.push([x, y])
    }
    while(queue.length) {
        let [x, y] = pre = queue.shift()
        if(x === end[0] && y === end[1]) {
            const path = [[x, y]]
            while(x !== start[0] || y !== start[1]) {
                [x, y] = map[y * 100 + x]
                containerEle.children[y].children[x].style.background = "red"
                path.unshift([x, y])
            }
            return path
        }
        await insert([x - 1, y], pre)
        await insert([x, y - 1], pre)
        await insert([x + 1, y], pre)
        await insert([x, y + 1], pre)
    }
    return false
}