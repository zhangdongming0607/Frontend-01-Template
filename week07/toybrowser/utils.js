const nullishOperate = (value, backUpValue) => {
    return (value !== null && value !== void 0) ? value : backUpValue
}

module.exports = {
    nullishOperate
}