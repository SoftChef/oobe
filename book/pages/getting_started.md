# 開始

雖然`oobe`號稱開箱即用，但要真正開始還真的不太容易，以下以一個員工系統做例子。

## 設定第一隻精靈(Sprite)

精靈是`oobe`的最小單位，也是`model`的原型。

> body的參數無法接受開頭以`$`與`_`命名的變數，也不接受function。

```js
let staff = {
    // body定義sprite的結構與預設值
    body() {
        return {
            name: '',
            age: 0,
            country_code: '+886',
            phone_number: '',
            gender: 'men'
        }
    }
}
```

---

## 將精靈裝入容器(Container)

Container是一個裝載Sprite與設定通用參數的物件。

```js
let company = {
    sprites: { staff }
}
```

---

## Core註冊Container

要真正的使用Sprite，必須將上述所設定的物件註冊至core。

```js
let oobe = new Oobe()
oobe.join('company', company)
```

---

## 建立第一隻精靈

```js
let staff = oobe.make('company', 'staff').$born({
    name: 'james',
    age: 30,
    phone_number: '928000000'
    gender: 'men',
    city: 'tokyo'
})

console.log(staff.name) // james
console.log(staff.country_code) // +886
console.log(staff.city) // undefined
```

從上述例子可以得知，未被body定義的值傳入是無效的，而未賦予的值會採取預設。

以上就是建立整個基礎oobe設施的過程，但仍略顯陽春，在開始進階功能前，先認識[rule和locale](./rule_and_locale.md)。