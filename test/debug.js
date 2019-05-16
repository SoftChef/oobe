/* eslint-disable no-debugger */

const Oobe = require('../src/Main')
const LawData = require('./fake/data.json')
const CognitoUser = require('./fake')

oobe = new Oobe()
oobe.addContainer('CognitoUser', CognitoUser)

user = oobe.make('CognitoUser', 'user', LawData)

debugger
