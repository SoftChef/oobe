const expect = require('chai').expect
const Oobe = require('../src/Main')
const Package = require('./fake/rules')
const RawData = require('./fake/data.json')
const Loader = require('../plugins/loader')
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
    attributes: {
        sub: 'aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa-aaaaaaa',
        name: 'admin',
        email: 'admin@gmail.com',
        phone_number: '000000000',
        'custom:level': 'admin',
        'custom:country_code': '+886'
    }
})

const InterfaceTest = {
    sprites: {
        s: {
            body() {},
            views: {
                test() {}
            },
            methods: {
                test() {}
            },
            dists: {
                update() {}
            }
        }
    },
    interface: {
        views: ['test'],
        dists: ['update'],
        methods: ['test']
    }
}

const InterfaceTestError = {
    sprites: {
        s: {
            body() {},
            views: {
                test() {}
            },
            methods: {},
            dists: {}
        }
    },
    interface: {
        views: ['test', 'running'],
        dists: ['update'],
        methods: ['test']
    }
}

describe('#Core', () => {
    before(function() {
        this.oobe = new Oobe()
    })

    it('addon and addRules and add locale', function() {
        this.oobe.addon(Package)
    })

    it('if use states', function() {
        expect(() => {
            this.oobe.join('Test', {
                sprites: {
                    test: {
                        body() {},
                        states: {}
                    }
                }
            })
        }).to.throw(Error)
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
        expect(rules[1]('')).to.equal(true)
    })

    it('make sprite unit', function() {
        let unit = this.oobe.make('CognitoUser', 'user').$born(RawData)
        expect(unit.name).to.equal('admin')
        expect(Oobe.helper.isSprite(unit.name)).to.equal(false)
        expect(Oobe.helper.isSprite(unit.attributes)).to.equal(true)
    })

    it('instanceof', function() {
        let unit = this.oobe.make('CognitoUser', 'user').$born(RawData)
        expect(this.oobe.instanceof('CognitoUser', 'user', unit)).to.equal(true)
        expect(this.oobe.instanceof('CognitoUser', 'attributes', unit.attributes)).to.equal(true)
        expect(this.oobe.instanceof('CognitoUser', 'attributes', unit)).to.equal(false)
    })

    it('plugin', function() {
        this.oobe.plugin(Loader)
    })

    it('plugin registered', function() {
        expect(() => { this.oobe.plugin(Loader) }).to.throw(Error)
    })
})

describe('#Sprite', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addon(Package)
        this.oobe.join('CognitoUser', CognitoUser)
        this.user = this.oobe.make('CognitoUser', 'user')
    })

    it('isUs', function() {
        let rawnull = this.oobe.make('CognitoUser', 'rawnull')
        expect(this.user._sprite.base.isUs(this.user)).to.equal(true)
        expect(this.user._sprite.base.isUs(rawnull)).to.equal(false)
    })

    it('batch make', function() {
        let items = this.oobe.batch('CognitoUser', 'user', [RawData, RawData])
        expect(items[0].$ready).to.equal(true)
        expect(items[1].$ready).to.equal(true)
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

    it('parent', function() {
        expect(this.user.attributes.$parent.$ready).to.equal(true)
    })

    it('isChange of key', function() {
        this.user.attributes.$reset()
        expect(this.user.attributes.$isChange()).to.equal(false)
        this.user.attributes.email = '1234'
        expect(this.user.attributes.$isChange('phone_number')).to.equal(false)
        expect(this.user.attributes.$isChange('email')).to.equal(true)
        this.user.attributes.$reset()
    })

    it('reset of key', function() {
        this.user.attributes.phone_number = '000000008'
        this.user.attributes.email = '1234'
        expect(this.user.attributes.email).to.equal('1234')
        this.user.attributes.$reset('email')
        expect(this.user.attributes.email).to.equal('admin@gmail.com')
        expect(this.user.attributes.phone_number).to.equal('000000008')
        this.user.attributes.$reset()
        expect(this.user.attributes.phone_number).to.equal('000000000')
    })

    it('container methods', function() {
        expect(this.user.$fn.helloWorld()).to.equal('hello world')
    })

    it('methods', function() {
        expect(this.user.$fn.getName()).to.equal('admin')
    })

    it('bind', function() {
        let getName = this.user.$fn.getName
        let getNameBind = this.user.$bind('getName')
        expect(() => { getName() }).to.throw(Error)
        expect(getNameBind()).to.equal('admin')
    })

    it('copy', function() {
        let sprite = this.user.$copy()
        expect(Oobe.helper.isSprite(sprite)).to.equal(true)
    })

    it('self', function() {
        expect(this.user.$self.name).to.equal('admin')
        expect(this.user.$self.test).to.equal('test')
        this.user.$self.name = '我4垃圾'
        this.user.$reset()
        expect(this.user.$self.name).to.equal('admin')
    })

    it('distortions', function() {
        let user = this.user.$copy().$distortion('create')
        expect(user.$distName).to.equal('create')
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

    it('export join data', function() {
        let user = this.user.$copy()
        expect(user.$export('delete', '1234')).to.equal('delete1234')
    })

    it('export assign mode', function() {
        let user = this.user.$copy().$distortion('create')
        expect(user.$export('delete')).to.equal('delete')
    })

    it('container rule', function() {
        let rules = this.user.$rules('name')
        expect(Array.isArray(rules)).to.equal(true)
    })

    it('container validate', function() {
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
        expect(keys.includes('attributes')).to.equal(true)
    })

    it('body', function() {
        this.user.$reset()
        expect(TestRawBody === JSON.stringify(this.user.$body())).to.equal(true)
    })

    it('error', function() {
        let check = false
        let user = this.user.$copy()
        user.$onOnce('$error', (context, error) => {
            check = true
        })
        expect(user.$error).to.equal(null)
        user.$setError('1234')
        expect(user.$error).to.equal('1234')
        expect(check).to.equal(true)
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

    it('raw', function() {
        let data = this.user.$raw()
        expect(data.Username).to.equal('admin')
        let newData = this.user.$raw({
            Username: '1234'
        })
        expect(newData.Username).to.equal('1234')
    })

    it('meg', function() {
        this.oobe.setLocale()
        expect(this.user.$meg('aaaa')).to.equal('big')
        expect(this.user.$meg('#sc.require', { value: 123 })).to.equal('Value 123 must be required.')
        this.oobe.setLocale('zh-tw')
        expect(this.user.$meg('aaaa')).to.equal('巨')
    })

    it('views', function() {
        expect(this.user.$views.testViews).to.equal(this.user.name + 'test')
        expect(this.user.$v.testViews).to.equal(this.user.name + 'test')
    })

    it('default views', function() {
        expect(this.user.$views['123']).to.equal('123')
        expect(this.user.$v['123']).to.equal('123')
    })

    it('checkbody', function() {
        expect(() => {
            this.oobe.make('CognitoUser', 'checkbody')
        }).to.throw(Error)
    })

    it('interface', function() {
        let oobe = new Oobe()
        oobe.join('if', InterfaceTest)
        expect(() => {
            oobe.join('ife', InterfaceTestError)
        }).to.throw(Error)
    })

    it('raw data is null', function() {
        let rawnull = this.oobe.make('CognitoUser', 'rawnull').$born()
        rawnull.$raw()
    })

    it('event once', function() {
        let count = 0
        let rawnull = this.oobe.make('CognitoUser', 'rawnull')
        rawnull.$on('$export', () => {
            count += 1
        })
        rawnull.$onOnce('$export', (context, result) => {
            expect(result.dist).to.equal('read')
            count += 1
        })
        rawnull.$born()
        rawnull.$export()
        rawnull.$export()
        expect(count).to.equal(3)
    })

    it('event', function() {
        let count = 0
        let rawnull = this.oobe.make('CognitoUser', 'rawnull')
        this.oobe.on('container.sprite.unit.$ready', (context) => {
            count += 1
        })
        rawnull.$on('$ready', (context) => {
            count += 1
        })
        let raw = rawnull.$on('$ready', (context) => {
            count += 1
        })
        raw.off()
        let raw2 = rawnull.$on('$ready', (context) => {
            count += 1
        })
        rawnull.$off('$ready', raw2.id)
        let raw3 = rawnull.$on('$ready', (context) => {
            count += 1
        })
        rawnull.$off('$ready', raw3)
        rawnull.$born()
        expect(count).to.equal(2)
    })

    it('put', function() {
        let user = this.oobe.make('CognitoUser', 'user').$born(RawData).$put({
            name: '1234',
            attributes: {
                sub: '5487'
            }
        })
        expect(user.name).to.equal('1234')
        expect(user.attributes.sub).to.equal('5487')
        expect(user.attributes['custom:level']).to.equal('admin')
    })

    it('toObject', function() {
        let user = this.oobe.make('CognitoUser', 'user').$born(RawData)
        let object = user.$toObject()
        user.name = '5487'
        expect(user.name).to.equal('5487')
        expect(object.name).to.equal('admin')
        expect(object.$views.testViews).to.equal('admintest')
    })

    it('container distortions', function() {
        let user = this.user.$copy()
        expect(() => { user.name = function() {} }).to.throw(Error)
        user.$out()
        expect(() => { user.name = '456' }).to.throw(Error)
    })

    it('Rule not found', function() {
        let user = this.user.$copy()
        expect(() => { user.$rules(['aaaa']) }).to.throw(Error)
    })

    it('Already born', function() {
        let user = this.user.$copy()
        expect(() => { user.$born() }).to.throw(Error)
    })

    it('Revive in root', function() {
        let user = this.user.$copy()
        expect(() => { user.$revive() }).to.throw(Error)
    })

    it('Dead in root', function() {
        let user = this.user.$copy()
        expect(() => { user.$dead() }).to.throw(Error)
    })

    it('Method not found', function() {
        let user = this.user.$copy()
        expect(() => { user.$bind('777777') }).to.throw(Error)
    })

    it('Copy not ready', function() {
        let user = this.oobe.make('CognitoUser', 'user')
        expect(() => { user.$copy() }).to.throw(Error)
    })
})

describe('#Collection', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addon(Package)
        this.oobe.join('CognitoUser', CognitoUser)
    })

    it('create', function() {
        this.collection = this.oobe.collection('CognitoUser', 'user')
        expect(Oobe.helper.isCollection(this.collection)).to.equal(true)
    })

    it('parent', function() {
        this.collection = this.oobe.collection('CognitoUser', 'user')
        expect(this.collection.parent).to.equal(null)
    })

    it('dirty', function() {
        let collection = this.oobe.collection('CognitoUser', 'user')
        expect(collection.dirty).to.equal(false)
        collection.write(RawData)
        expect(collection.dirty).to.equal(true)
    })

    it('setdirty', function() {
        let collection = this.oobe.collection('CognitoUser', 'user')
        expect(collection.dirty).to.equal(false)
        collection.write(RawData)
        expect(collection.dirty).to.equal(true)
        collection.setDirty(false)
        expect(collection.dirty).to.equal(false)
    })

    it('write', function() {
        expect(this.collection.size).to.equal(0)
        this.collection.write(RawData)
        this.collection.write(RawData)
        expect(this.collection.size).to.equal(1)
        let newData = Oobe.helper.jpjs(RawData)
        newData.Username = '5487'
        this.collection.write(newData)
        expect(this.collection.size).to.equal(2)
        expect(this.collection.has('5487')).to.equal(true)
    })

    it('batch write', function() {
        let collection = this.oobe.collection('CognitoUser', 'user')
        let newData = Oobe.helper.jpjs(RawData)
        newData.Username = '5487'
        collection.batchWrite([RawData, RawData, newData])
        expect(collection.size).to.equal(2)
    })

    it('batch write only key', function(done) {
        let collection = this.oobe.collection('CognitoUser', 'user')
        collection.on('$writeSuccess', (context, { sprite, onlyKey }) => {
            expect(typeof sprite.name).to.equal('string')
            expect(onlyKey).to.equal(true)
            if (collection.size === 3) {
                expect(collection.size).to.equal(3)
                done()
            }
        })
        collection.batchWriteOnlyKeys('Username', ['123', '456', '789'])
    })

    it('fetch', function() {
        expect(Oobe.helper.isSprite(this.collection.fetch('admin'))).to.equal(true)
        expect(Oobe.helper.isSprite(this.collection.fetch('5487'))).to.equal(true)
        expect(Oobe.helper.isSprite(this.collection.fetch('3064'))).to.equal(false)
    })

    it('items', function() {
        expect(this.collection.items).to.be.a('array')
    })

    it('remove', function() {
        this.collection.remove('5487')
        expect(this.collection.size).to.equal(1)
    })

    it('event once', function() {
        let count = 0
        this.collection.onOnce('$fetch', () => {
            count += 1
        })
        this.collection.fetch('admin')
        this.collection.fetch('admin')
        expect(count).to.equal(1)
    })

    it('event', function() {
        let count = 0
        this.collection.on('$fetch', () => {
            count += 1
        })
        this.collection.on('$fetch', ({ listener }) => {
            count += 1
            listener.off()
        })
        this.collection.fetch('admin')
        this.collection.fetch('admin')
        expect(count).to.equal(3)
    })

    it('write', function() {
        let count = 0
        this.collection.on('$writeReject', (context, reslut) => {
            expect(reslut.message).to.equal('test')
            count += 1
        })
        this.collection.on('$writeSuccess', () => {
            count += 1
        })
        this.collection.write({
            ...RawData,
            Username: '123456789'
        })
        this.collection.write(RawData)
        expect(count).to.equal(2)
    })

    it('write sprite', function() {
        let user = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '548754875487' })
        let rawnull = this.oobe.make('CognitoUser', 'rawnull').$born()
        let size = this.collection.size
        this.collection.write(user)
        expect(() => this.collection.write(rawnull)).to.throw(Error)
        expect(this.collection.size - size).to.equal(1)
    })

    it('clear', function() {
        this.collection.clear()
        expect(this.collection.size).to.equal(0)
    })

    it('views', function() {
        this.collection.clear()
        let user = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '5487' })
        let user2 = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '1234' })
        this.collection.write(user)
        this.collection.write(user2)
        expect(this.collection.views.names).to.equal(user.name + user2.name)
    })

    it('validate', function() {
        this.collection.clear()
        let user = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '5487' })
        let user2 = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '1234' })
        this.collection.write(user)
        this.collection.write(user2)
        expect(this.collection.validate().success).to.equal(true)
        let user3 = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '給庫' })
        this.collection.write(user3)
        expect(this.collection.validate().success).to.equal(false)
        this.collection.clear()
    })

    it('isChange', function() {
        let user = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '5487' })
        let user2 = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '1234' })
        this.collection.write(user)
        this.collection.write(user2)
        expect(this.collection.isChange()).to.equal(false)
        user2.name = '12345'
        expect(this.collection.isChange()).to.equal(true)
        this.collection.clear()
    })

    it('distAll', function() {
        let user = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '5487' })
        let user2 = this.oobe.make('CognitoUser', 'user').$born({ ...RawData, Username: '1234' })
        this.collection.write(user)
        this.collection.write(user2)
        this.collection.distAll('create')
        expect(user.$distName).to.equal('create')
        expect(user.$show('name')).to.equal(false)
        expect(user.$isFixed('name')).to.equal(true)
        expect(user.$isHidden('name')).to.equal(true)
        expect(user2.$distName).to.equal('create')
        expect(user2.$show('name')).to.equal(false)
        expect(user2.$isFixed('name')).to.equal(true)
        expect(user2.$isHidden('name')).to.equal(true)
    })

    it('async batch write', function(done) {
        this.collection.clear()
        this.collection.batchWriteAsync([
            { ...RawData, Username: '5487' },
            { ...RawData, Username: '1234' }
        ], 20)
        expect(this.collection.size).to.equal(0)
        this.collection.on('$writeAsyncDone', () => {
            expect(this.collection.size).to.equal(2)
            done()
        })
    })
    it('container utils', function() {
        expect(this.collection.utils.helloWorld()).to.equal('hello world')
    })
    it('container helper', function() {
        expect(this.collection.helper.getType('123')).to.equal('string')
    })
    it('container methods', function() {
        expect(this.collection.methods.helloWorld()).to.equal('hello world')
    })
    it('container configs', function() {
        expect(this.collection.configs.helloWorld).to.equal('hello world')
    })
})

describe('#Collection With Sprite', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addon(Package)
        this.oobe.join('CognitoUser', CognitoUser)
    })

    it('init', function() {
        this.userpool = this.oobe.make('CognitoUser', 'userpool').$born({
            id: '1234',
            users: [{ ...RawData, Username: '5487' }, { ...RawData, Username: '4567' }]
        })
    })

    it('dist', function() {
        expect(this.userpool.users.items[0].$distName).to.equal('read')
        this.userpool.$dist('create')
        expect(this.userpool.users.items[0].$distName).to.equal('create')
        expect(this.userpool.users.items[1].$distName).to.equal('create')
    })

    it('isChange', function() {
        expect(this.userpool.$isChange()).to.equal(false)
        this.userpool.users.items[0].name = '7788'
        expect(this.userpool.$isChange()).to.equal(true)
    })

    it('validate', function() {
        let valid = this.userpool.$validate()
        expect(valid.success).to.equal(true)
        this.userpool.users.items[0].name = '測試'
        valid = this.userpool.$validate()
        expect(valid.success).to.equal(false)
    })

    it('body', function() {
        let body = this.userpool.$body()
        expect(Array.isArray(body.users)).to.equal(true)
    })

    it('put', function() {
        this.userpool.$put({
            users: [{
                name: '5566'
            }]
        })
        expect(this.userpool.users.items[0].name).to.equal('5566')
        expect(this.userpool.users.items[1]).to.equal(undefined)
    })

    it('container parent', function() {})
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
        expect(this.user.$helper.getType(new Promise(() => {}))).to.equal('promise')
        expect(this.user.$helper.getType(/www/)).to.equal('regexp')
        expect(this.user.$helper.getType(Buffer.from([]))).to.equal('buffer')
        expect(this.user.$helper.getType(Number('AAAA'))).to.equal('NaN')
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

    it('verify', function() {
        let options = {
            a: 5,
            b: '7'
        }
        let reslut = this.user.$helper.verify(options, {
            a: [true, ['number']],
            b: [true, ['string']]
        })
        expect(reslut.a).to.equal(5)
        expect(reslut.b).to.equal('7')
        expect(() => {
            this.user.$helper.verify(options, {
                a: [true, ['number']],
                b: [true, ['string']],
                c: [true, ['string']]
            })
        }).to.throw(Error)
        expect(() => {
            this.user.$helper.verify(options, {
                a: [123, ['number']]
            })
        }).to.throw(Error)
        expect(() => {
            this.user.$helper.verify(options, {
                a: [true, 123]
            })
        }).to.throw(Error)
        expect(() => {
            this.user.$helper.verify(options, {
                a: [true, ['string']]
            })
        }).to.throw(Error)
    })

    it('deepObjectAssign', function() {
        let target = {
            a: 5,
            b: 10,
            c: {
                a: 7,
                b: 8
            }
        }
        let output = Oobe.helper.deepObjectAssign(target, {
            a: 8,
            c: {
                a: 10
            }
        })
        expect(output.a).to.equal(8)
        expect(output.b).to.equal(10)
        expect(output.c.a).to.equal(10)
        expect(output.c.b).to.equal(8)
    })

    it('generateId', function() {
        expect(this.user.$helper.generateId()).to.be.a('string')
    })

    it('peel', function() {
        var test = {
            a: {
                c: 5
            }
        }
        expect(this.user.$helper.peel(test, 'a.c')).to.equal(5)
        expect(this.user.$helper.peel(test, 'a.b.e.e')).to.equal(undefined)
        expect(this.user.$helper.peel(test, 'a.b.e.e', '*')).to.equal('*')
    })
})

describe('#Plugin-Loader', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addon(Package)
        this.oobe.join('CognitoUser', CognitoUser)
    })

    it('add', function() {
        this.oobe.plugin(Loader)
    })

    it('set', function() {
        this.oobe.loader.set('CognitoUser', 'user', {
            name(sprite, done) {
                setTimeout(() => {
                    sprite.name = '456'
                    done()
                }, 100)
            },
            nameError(sprite, done, error) {
                setTimeout(() => {
                    error('OuO')
                }, 100)
            }
        })
    })
    
    it('loader', function(done) {
        let user = this.oobe.make('CognitoUser', 'user')
        user.$loader
            .name
            .start()
            .then(() => {
                expect(user.name).to.equal('456')
                expect(user.$loader.name.done).to.equal(true)
                expect(user.$loader.name.error).to.equal(null)
                expect(user.$loader.name.loading).to.equal(false)
                done()
            })
            .catch(done)
        expect(user.$loader.name.done).to.equal(false)
        expect(user.$loader.name.loading).to.equal(true)
    })

    it('loader error', function(done) {
        let user = this.oobe.make('CognitoUser', 'user')
        user.$loader
            .nameError
            .start()
            .then(() => {
                done('Error')
            })
            .catch((error) => {
                expect(error).to.equal('OuO')
                expect(user.$loader.nameError.done).to.equal(true)
                expect(user.$loader.nameError.error).to.equal('OuO')
                expect(user.$loader.nameError.loading).to.equal(false)
                done()
            })
        expect(user.$loader.nameError.done).to.equal(false)
        expect(user.$loader.nameError.loading).to.equal(true)
    })

    it('no register loader', function() {
        this.oobe.join('Test', {
            sprites: {
                test: {
                    body() {}
                }
            }
        })
        let test = this.oobe.make('Test', 'test')
        expect(Object.keys(test.$loader).length).to.equal(0)
        let rawnull = this.oobe.make('CognitoUser', 'rawnull')
        expect(Object.keys(rawnull.$loader).length).to.equal(0)
    })
})

describe('#Other', () => {
    it('system error', function() {
        let Base = require('../src/Base')
        let base = new Base('Test')
        expect(() => {
            base.$systemError('Test', 'Test')
        }).to.throw(Error)
        expect(() => {
            base.$systemError('Test', 'Test', 'Test')
        }).to.throw(Error)
    })
})
