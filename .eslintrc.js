module.exports = {
    extends: [
        'standard'
    ],
    rules: {
        indent: [1, 4],
        camelcase: [0, {
            properties: 'never',
            ignoreDestructuring: true
        }],
        'no-callback-literal': 0,
        'no-extra-boolean-cast': 0,
        'no-unused-vars': ['warn'],
        'no-new': 0,
        'no-undef': [0, { 'typeof': true }],
        'handle-callback-err': [0],
        'prefer-promise-reject-errors': ['error', { 'allowEmptyReject': true }],
        'space-before-function-paren': ['error', 'never'],
        "requireStringLiterals": 0,
        "prefer-const": 0
    }
}