/* eslint-disable no-debugger */

const Oobe = require('../src/Main')
const LawData = require('./cognito_user/data.json')
const CognitoUser = require('./cognito_user')

oobe = new Oobe()
oobe.addContainer('CognitoUser', CognitoUser)

user = oobe.make('CognitoUser', 'user', LawData)

debugger
