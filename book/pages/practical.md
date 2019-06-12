# 實戰經驗

我們已經成功建立一連串的`oobe`物件了，下一步會用`vue`做一個搭配來介紹整個應用模型。

## 把Vue引入oobe

```js
import Vue from 'vue'
import VueOobe from 'vue-oobe'
let oobe = new Oobe()
Vue.prototype.$oobe = oobe
```

## Join

把上一章節的`company`使用`join`註冊`container`。

```js
oobe.join('company', company, company, {
    vat_number: '12345678'
})
```

## Make

建立`CreateStaff.vue`和`StaffForm.vue`，用來建立第一個員工。

### StaffForm.vue

```html
<template>
    <form>
        <input type="text" >
    </form>
</template>
<script>
export default {
    props: ['sprite']
}
</script>
```

### CreateStaff.vue

```html
<template>
    <staff-form :sprite="sprite"></staff-form>
    <button @click.stop="submit()">送出</button>
</template>
<script>
export default {
    data() {
        return {
            sprite: this.$oobe.make('company', 'staff').$born().$distortion('create')
        }
    },
    methods: {
        submit() {
            // 送出建立資料
            fetch.post('...', this.sprite.$export())
        }
    }
}
</script>
```