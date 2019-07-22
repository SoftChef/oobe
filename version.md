# oobe version

## ver 0.0.3

正式定義架構

## ver 0.0.4

1. 移除watch屬性：這東西對後端來說太危險了
4. 移除bridge：考慮使用event來取代
2. reset & isChange 可以針對key來做微調
3. helper verify：一個簡單的驗證功能

## ver 0.0.5

1. 加入interface

## ver 0.0.6

1. 加入$bind
2. 優化程式碼

## ver 0.0.7

1. 修復$rule
2. 加入instanceof

## ver 0.0.8

1. 加入$raw
2. 加入helper deepObjectAssign

## ver 0.0.9

1. 驗證預設允許為空值
2. rule新的表示法
3. 修復verify的預設值無法回傳0, false, ''等錯誤

## ver 0.1.0

1. validateForSprite指定某個sprite的驗證規則

## ver 0.1.1

1. self function