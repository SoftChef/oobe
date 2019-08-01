const messages = {
    'en-us': {
        'home': 'Home',
        'commodity': 'Commodities',
        'add': 'Add',
        'edit': 'Edit',
        'view': 'View',
        'create': 'Create',
        'delete': 'Delete',
        'update': 'Update',
        'control': 'Control',
        'created_at': 'Create At',
        'view_commodity': 'Commodity Overview',
        'create_commodity': 'Create Commodity',
        'update_commodity': 'Update Commodity'
    },
    'zh-tw': {
        'home': '首頁',
        'commodity': '商品',
        'add': '加入',
        'edit': '編輯',
        'view': '內容',
        'create': '建立',
        'delete': '刪除',
        'update': '更新',
        'control': '控制',
        'created_at': '建立時間',
        'view_commodity': '商品內容',
        'create_commodity': '建立商品',
        'update_commodity': '更新商品'
    }
}

export default new VueI18n({
    locale: 'zh-tw',
    messages
})
