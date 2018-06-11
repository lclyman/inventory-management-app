import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import router from './router/index'
import {store} from './store/index'
import format from 'date-fns/format'
import VuejsDialog from "vuejs-dialog"
import * as firebase from 'firebase'
import CmpAlert from './components/shared/Alert.vue'

Vue.component('app-alert', CmpAlert)

Vue.use(Vuetify, {
  theme: {
    primary: '#037367',
    secondary: '#00281f',
    accent: '#4a7eb3',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.use(VuejsDialog, {
  html: true,
  okText: 'Proceed',
  cancelText: 'Cancel',
  animation: 'zoom',
})

Vue.directive('focus', {
  inserted: function (el) {
    el.__vue__.focus()
  }
})

Vue.config.productionTip = false

Vue.filter('formatDateFull', function (value) {
  if (value) {
    return format(value, 'dddd MMMM Do YYYY')
  }
})

Vue.filter('formatDate', function (value) {
  if (value) {
    return format(value, 'MMMM Do YYYY')
  }
})


Vue.filter('formatDateShort', function (value) {
  if (value) {
    return format(value, 'MM-DD-YYYY')
  }
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created() {
    const config = {
      apiKey: "AIzaSyD4YmqmxMmWZEyO-eqfFjoXFG2A3Sv5K04",
      authDomain: "inventory-management-dem-76658.firebaseapp.com",
      databaseURL: "https://inventory-management-dem-76658.firebaseio.com",
      projectId: "inventory-management-dem-76658",
      storageBucket: "inventory-management-dem-76658.appspot.com",
      messagingSenderId: "888396175761"
    };

    firebase.initializeApp(config)

    if (this.$store.state.user === null) {
      this.$router.push('/signin')
    }
  }

})