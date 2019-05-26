import Vue from 'vue'
import Oobe from '../../../dist/index'
import User from './user'

const oobe = new Oobe()

oobe.join('User', User)

oobe.setLocale(localStorage.getItem('locale'))

Vue.prototype.$oobe = oobe

export default oobe
