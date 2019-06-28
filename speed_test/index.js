let oobe = require('../src/Main')

let core = new oobe()

core.join('a', {
    sprites: {
        test: {
            body() {
                return {
                    count: 0
                }
            },
            methods: {
                add() {
                    this.count += 1
                }
            }
        }
    }
})

let sprite = core.make('a', 'test')

console.time('aaa')
for (let i = 0; i < 1000000; i++) {
    sprite.$fn.add()
}
console.timeEnd('aaa')
// console.log(sprite.count)
