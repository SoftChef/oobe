module.exports = {
    defaultDistortion: ['read', 'create', 'delete', 'update'],
    protectPrefix: ['self'],
    eventHandlerIsAsync: false,
    systemContainer: {
        sprites: {
            system: {
                body: () => { return {} }
            }
        }
    }
}
