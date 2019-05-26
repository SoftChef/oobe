const expect = require('chai').expect
const Oobe = require('../src/Main')
const Plugin = require('../plugins/rules')
const RawData = require('./fake/data.json')
const CognitoUser = require('./fake')
const TestRawOrigin = JSON.stringify({
    Username: 'admin',
    UserAttributes: [
        { Name: 'sub', Value: 'aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa' },
        { Name: 'name', Value: 'admin' },
        { Name: 'email', Value: 'admin@gmail.com' },
        { Name: 'phone_number', Value: '+886000000000' },
        { Name: 'custom:level', Value: 'admin' },
        { Name: 'custom:country_code', Value: '+886' }
    ]
})

const TestRawBody = JSON.stringify({
    name: 'admin',
    watchTest: '',
    computedTest: '',
    attributes: {
        'sub': 'aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa',
        'name': 'admin',
        'email': 'admin@gmail.com',
        'phone_number': '000000000',
        'custom:level': 'admin',
        'custom:country_code': '+886'
    }
})

describe('#Core', () => {
    before(function() {
        this.oobe = new Oobe()
    })

    it('addon and addRules and add locale', function() {
        this.oobe.addon(Plugin)
    })

    it('check constructor', function() {
        expect(this.oobe instanceof Oobe).to.equal(true)
    })

    it('add container', function() {
        let result = this.oobe.join('CognitoUser', CognitoUser, {
            test: true
        })
        expect(result).to.equal('install')
    })

    it('add container same name', function() {
        expect(() => this.oobe.join('CognitoUser', CognitoUser)).to.throw(Error)
    })

    it('add null to container should error', function() {
        expect(() => this.oobe.join('Null', null)).to.throw(Error)
    })

    it('add rules', function() {
        this.oobe.addRules({
            string: value => typeof value === 'string' ? true : 'error',
            number: value => typeof value === 'number' ? true : 'error'
        })
    })

    it('get rules', function() {
        let rules = this.oobe.getRules(['[s]require', 'string'])
        expect(rules).to.be.a('array')
        expect(rules[0]('')).to.be.a('string')
        expect(rules[0]('test')).to.equal(true)
        expect(rules[1]('')).to.equal(true)
        expect(rules[1]('test')).to.equal(true)
        expect(rules[1](1234)).to.equal('error')
    })

    it('validate rule', function() {
        expect(this.oobe.validate('test', ['string'])).to.equal(true)
    })

    it('validate rule should error', function() {
        expect(this.oobe.validate(1234, ['string'])).to.equal('error')
    })

    it('validates rule', function() {
        expect(this.oobe.validate('test', ['string', '[s]require'])).to.equal(true)
        expect(this.oobe.validate(1234, ['string', '[s]require'])).to.be.a('string')
        expect(this.oobe.validate(1234, ['number', '[s]require'])).to.equal(true)
        expect(this.oobe.validate('', ['string', '[s]require'])).to.be.a('string')
    })

    it('make sprite unit', function() {
        let unit = this.oobe.make('CognitoUser', 'user', RawData)
        expect(unit.name).to.equal('admin')
        expect(Oobe.isSprite(unit.name)).to.equal(false)
        expect(Oobe.isSprite(unit.attributes)).to.equal(true)
    })
})

describe('#Sprite', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addon(Plugin)
        this.oobe.join('CognitoUser', CognitoUser)
        this.user = this.oobe.make('CognitoUser', 'user', RawData)
    })

    it('change value', function() {
        this.user.name = 'user'
        expect(this.user.name).to.equal('user')
    })

    it('change refs should error', function() {
        expect(() => { this.user.attributes = 'test' }).to.throw(Error)
    })

    it('change refs value', function() {
        this.user.attributes.sub = 1234
        expect(this.user.attributes.sub).to.equal(1234)
    })

    it('isChange', function() {
        expect(this.user.$isChange()).to.equal(true)
    })

    it('reset', function() {
        this.user.$reset()
        expect(this.user.$isChange()).to.equal(false)
    })

    it('container methods', function() {
        expect(this.user.$fn.helloWorld()).to.equal('hello world')
    })

    it('methods', function() {
        expect(this.user.$fn.getName()).to.equal('admin')
    })

    it('copy', function() {
        let sprite = this.user.$copy()
        expect(Oobe.isSprite(sprite)).to.equal(true)
    })

    it('distortions', function() {
        let user = this.user.$copy().$distortion('create')
        expect(user.$state).to.equal('create')
        expect(user.$isFixed('name')).to.equal(true)
        expect(user.$isHidden('name')).to.equal(true)
    })

    it('container distortions', function() {
        let user = this.user.$copy().$distortion('adminRead')
        expect(() => { user.$distortion('test') }).to.throw(Error)
    })

    it('export', function() {
        let user = this.user.$copy().$distortion('create')
        expect(user.$export()).to.equal('test')
    })

    it('export assign mode', function() {
        let user = this.user.$copy().$distortion('create')
        expect(user.$export('delete')).to.equal('delete')
    })

    it('container rules and validate', function() {
        this.user.name = 'ffff'
        expect(this.user.$validate().name).to.equal(true)
        this.user.name = 'ff--ff'
        expect(this.user.$validate().name).to.be.a('string')
        this.user.name = ''
        expect(this.user.$validate().name).to.be.a('string')
    })

    it('to origin', function() {
        this.user.$reset()
        let origin = JSON.stringify(this.user.$toOrigin())
        expect(TestRawOrigin === origin).to.equal(true)
    })

    it('helper', function() {
        var a = {
            b: {
                c: 5
            }
        }
        var c = this.user.$helper.deepClone(a)
        c.b.c = 7
        expect(c.b.c).to.equal(7)
        expect(a.b.c).to.equal(5)
    })

    it('configs', function() {
        expect(this.user.$configs.helloWorld).to.equal('hello world')
    })

    it('keys', function() {
        let keys = this.user.$keys()
        expect(keys.includes('name')).to.equal(true)
        expect(keys.includes('watchTest')).to.equal(true)
        expect(keys.includes('test')).to.equal(true)
        expect(keys.includes('attributes')).to.equal(true)
    })

    it('body', function() {
        this.user.$reset()
        expect(TestRawBody === JSON.stringify(this.user.$body())).to.equal(true)
    })

    it('out revive', function() {
        let user = this.user.$copy()
        let soul = user.$out()
        soul.name = '123'
        expect(() => { user.name = 'test' }).to.throw(Error)
        soul.$revive()
        expect(() => { soul.name = 'test' }).to.throw(Error)
        expect(user.name).to.equal('123')
    })

    it('dead', function() {
        let user = this.user.$copy()
        let soul = user.$out()
        soul.$dead()
        expect(() => { soul.name = 'test' }).to.throw(Error)
        user.name = '123'
        expect(user.name).to.equal('123')
    })

    it('meg', function() {
        expect(this.user.$meg('$aaaa')).to.equal('big')
        expect(this.user.$meg('[s]require', { value: 123 })).to.equal('Value 123 must be required.')
        this.oobe.setLocale('zh-tw')
        expect(this.user.$meg('$aaaa')).to.equal('巨')
    })

    it('computed', function() {
        this.user.test = 5
        expect(this.user.computedTest).to.equal(10)
    })

    it('watch', function() {
        let ov = this.user.name
        let nv = 'aaa'
        this.user.name = nv
        expect(this.user.watchTest).to.equal(ov + nv)
    })
})

describe('#Helper', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.join('CognitoUser', CognitoUser)
        this.user = this.oobe.make('CognitoUser', 'user', RawData)
    })

    it('mapping', function() {
        let data = {
            name: 'admin'
        }
        let result = this.user.$helper.mapping(data, true, {
            name: 'Username'
        })
        expect(result.Username).to.equal('admin')
    })

    it('getType', function() {
        expect(this.user.$helper.getType('')).to.equal('string')
        expect(this.user.$helper.getType(true)).to.equal('boolean')
        expect(this.user.$helper.getType([])).to.equal('array')
        expect(this.user.$helper.getType(null)).to.equal('empty')
        expect(this.user.$helper.getType(undefined)).to.equal('empty')
        expect(this.user.$helper.getType({})).to.equal('object')
    })

    it('isEmpty', function() {
        expect(this.user.$helper.isEmpty('')).to.equal(true)
        expect(this.user.$helper.isEmpty('1')).to.equal(false)
        expect(this.user.$helper.isEmpty([])).to.equal(true)
        expect(this.user.$helper.isEmpty([1])).to.equal(false)
        expect(this.user.$helper.isEmpty({})).to.equal(true)
        expect(this.user.$helper.isEmpty({ a: 5 })).to.equal(false)
        expect(this.user.$helper.isEmpty(null)).to.equal(true)
        expect(this.user.$helper.isEmpty(undefined)).to.equal(true)
        expect(this.user.$helper.isEmpty(0)).to.equal(false)
    })
})
