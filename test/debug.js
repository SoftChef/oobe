/* eslint-disable no-debugger */

const Oobe = require('../src/Main')
const Plugin = require('./fake/rules')
const RawData = require('./fake/data.json')
const CognitoUser = require('./fake')

core = new Oobe()
core.join('CognitoUser', CognitoUser)
core.addon(Plugin)

user = core.make('CognitoUser', 'user', RawData)

debugger
