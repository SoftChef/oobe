/* eslint-disable no-debugger */

const Oobe = require('../src/Main')
const Plugin = require('./fake/rules')
const RawData = require('./fake/data.json')
const CognitoUser = require('./fake')

core = new Oobe()
core.join('CognitoUser', CognitoUser)
core.addon(Plugin)

// user = core.make('CognitoUser', 'user').$born(RawData)
// userpool = core.make('CognitoUser', 'userpool').$born({
//     id: '5487',
//     users: [RawData, { ...RawData, Username: '1234' }]
// })

// userpool.$put({
//     users: [{
//         name: '1234'
//     }]
// })

// let collection = core.collection('CognitoUser', 'user')

console.time('87')

for (let i = 0; i < 10000; i++) {
    // console.log('AA')
    core.make('CognitoUser', 'user')
    // collection.write({
    //     ...RawData,
    //     Username: Oobe.helper.generateId()
    // })
}

console.timeEnd('87')
