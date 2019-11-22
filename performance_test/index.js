const Oobe = require('../src/Main')
const Loader = require('../plugins/loader')
const oobe = new Oobe()

oobe.plugin(Loader)

oobe.join('company', {
    sprites: {
        staff: {
            body: () => ({
                name: null
            }),
            refs: {
                unit: 'unit'
            }
        },
        unit: {
            body: () => ({
                name: ''
            })
        }
    }
})

/* 冷啟動 */

oobe.make('company', 'staff').$born({ name: '小明' })
oobe.collection('company', 'staff')

/********/

console.time('建立精靈')

oobe.make('company', 'staff').$born({ name: '小明' })

console.timeEnd('建立精靈')

/********/

console.time('建立集合')

oobe.collection('company', 'staff')

console.timeEnd('建立集合')

/********/

console.time('大量建立精靈')

for (let i = 0; i < 1000; i++) {
    oobe.make('company', 'staff').$born({ name: '小明' })
}

console.timeEnd('大量建立精靈')

/********/

console.time('大量寫入集合')

let collection = oobe.collection('company', 'staff')

for (let i = 0; i < 1000; i++) {
    collection.write({ name: '小明' })
}

console.timeEnd('大量寫入集合')

/********/

var itmes = []
for (let i = 0; i < 1000; i++) {
    itmes.push({ name: '小明' })
}

console.time('批次寫入集合')

collection = oobe.collection('company', 'staff')

collection.batchWrite(itmes)

console.timeEnd('批次寫入集合')
