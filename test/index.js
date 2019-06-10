const expect = require('chai').expect
const Oobe = require('../src/Main')
const Plugin = require('../package/rules')
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
    watchTrans: 0,
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

    it('get rules', function() {
        let rules = this.oobe.getRules(['#sc.require', '#sc.string'])
        expect(rules).to.be.a('array')
        expect(rules[0]('')).to.be.a('string')
        expect(rules[0]('test')).to.equal(true)
        expect(rules[1]('')).to.equal(true)
        expect(rules[1]('test')).to.equal(true)
        expect(rules[1](1234)).to.equal('error')
    })

    it('make sprite unit', function() {
        let unit = this.oobe.make('CognitoUser', 'user').$born(RawData)
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
        this.user = this.oobe.make('CognitoUser', 'user')
    })

    it('born', function() {
        expect(this.user.$ready).to.equal(false)
        this.user.$born(RawData)
        expect(this.user.$ready).to.equal(true)
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
        expect(user.$show('name')).to.equal(false)
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
        expect(this.user.$validate().success).to.equal(true)
        this.user.name = 'ff--ff'
        expect(this.user.$validate().success).to.equal(false)
        this.user.name = ''
        expect(this.user.$validate().success).to.equal(false)
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
        var c = this.user.$helper.jpjs(a)
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
        expect(keys.includes('attributes')).to.equal(true)
    })

    it('body', function() {
        this.user.$reset()
        expect(TestRawBody === JSON.stringify(this.user.$body())).to.equal(true)
    })

    it('out revive', function() {
        let user = this.user.$copy()
        let soul = user.$out()
        expect(user.$live).to.equal(false)
        expect(soul.$live).to.equal(true)
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

    it('transform', function() {
        this.user.watchTrans = '1'
        expect(this.user.watchTrans).to.equal(1)
    })

    it('meg', function() {
        expect(this.user.$meg('aaaa')).to.equal('big')
        expect(this.user.$meg('#sc.require', { value: 123 })).to.equal('Value 123 must be required.')
        this.oobe.setLocale('zh-tw')
        expect(this.user.$meg('aaaa')).to.equal('巨')
    })

    it('watch', function() {
        let ov = this.user.name
        let nv = 'aaa'
        this.user.name = nv
        expect(this.user.watchTest).to.equal(ov + nv)
    })

    it('views', function() {
        expect(this.user.$views.testViews).to.equal(this.user.name + 'test')
    })

    it('checkbody', function() {
        expect(() => {
            this.oobe.make('CognitoUser', 'checkbody')
        }).to.throw(Error)
    })
})

describe('#Helper', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.join('CognitoUser', CognitoUser)
        this.user = this.oobe.make('CognitoUser', 'user', RawData)
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
