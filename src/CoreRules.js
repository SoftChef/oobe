module.exports = function(core) {
    core.addRule('@require', (value, params) => {
        let type = typeof value
        let message = 'require'
        if (value == null) {
            return message
        } else if (type === 'string' && value === '') {
            return message
        } else if (Array.isArray(value) && value.length === 0) {
            return message
        } else if (type === 'object' && Object.keys(value).length === 0) {
            return message
        }
        return true
    })
}
