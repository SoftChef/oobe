module.exports = {
    defaultDistortion: ['read', 'create', 'delete', 'update'],
    protectPrefix: ['self'],
    systemContainer: {
        sprites: {
            system: {
                body: () => ({})
            }
        }
    }
}
