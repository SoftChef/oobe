/* eslint-disable no-debugger */

const Oobe = require('../src/Main')
const Plugin = require('../plugins/rules')
const RawData = require('./fake/data.json')
const CognitoUser = require('./fake')

oobe = new Oobe()
oobe.join('CognitoUser', CognitoUser)
oobe.addon(Plugin)

user = oobe.make('CognitoUser', 'user', RawData)

debugger
