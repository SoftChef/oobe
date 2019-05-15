const expect = require('chai').expect
const Oobe = require('../src/Main')
const LawData = require('./cognito_user/data.json')
const CognitoUser = require('./cognito_user')

// user.$isChange()

describe('#Core', () => {
    before(function() {
        this.oobe = new Oobe()
    })

    it('check constructor', function() {
        expect(this.oobe instanceof Oobe).to.equal(true)
    })

    it('add container', function() {
        this.oobe.addContainer('CognitoUser', CognitoUser)
    })

    it('add container same name', function() {
        expect(() => this.oobe.addContainer('CognitoUser', CognitoUser)).to.throw(Error)
    })

    it('add null to container should error', function() {
        expect(() => this.oobe.addContainer('Null', null)).to.throw(Error)
    })

    it('add rule', function() {
        this.oobe.addRule('string', value => typeof value === 'string' ? true : 'error')
        this.oobe.addRule('number', value => typeof value === 'number' ? true : 'error')
    })

    it('get rules', function() {
        let rules = this.oobe.getRules(['@require', 'string'])
        expect(rules).to.be.a('array')
        expect(rules[0]('')).to.equal('require')
        expect(rules[0]('test')).to.equal(true)
        expect(rules[1]('')).to.equal(true)
        expect(rules[1]('test')).to.equal(true)
        expect(rules[1](1234)).to.equal('error')
    })

    it('validate rule', function() {
        expect(this.oobe.validate('string', 'test')).to.equal(true)
    })

    it('validate rule should error', function() {
        expect(this.oobe.validate('string', 1234)).to.equal('error')
    })

    it('validates rule', function() {
        expect(this.oobe.validates('test', ['string', '@require'])).to.equal(true)
        expect(this.oobe.validates(1234, ['string', '@require'])).to.equal('error')
        expect(this.oobe.validates(1234, ['number', '@require'])).to.equal(true)
        expect(this.oobe.validates('', ['string', '@require'])).to.equal('require')
    })

    it('make sprite unit', function() {
        let unit = this.oobe.make('CognitoUser', 'user', LawData)
        expect(unit.name).to.equal('admin')
        expect(Oobe.isSprite(unit.name)).to.equal(false)
        expect(Oobe.isSprite(unit.attributes)).to.equal(true)
    })
})

describe('#Sprite', () => {
    before(function() {
        this.oobe = new Oobe()
        this.oobe.addContainer('CognitoUser', CognitoUser)
        this.user = this.oobe.make('CognitoUser', 'user', LawData)
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
})
