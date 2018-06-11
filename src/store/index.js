import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations';
import format from 'date-fns/format'
import addWeeks from 'date-fns/add_weeks'

// const ADMIN_ID = '2K6IuxykFFMjiqzZEYp5DOC6uNJ2'   // admin@admin.com  for testing
const ADMIN_ID = 'kG2GuC4BmHfk2CezYeicCypEFOX2'


Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: false,
    user: null,
    products: [],
    loadedProduct: null,
    loadedUsers: [],
    fbError: '',
    hideNav: false,
    loc: "",
    showMonth: false,
    scancodeFound: false,
    loadedScancode: "",
    message: "",
    messageSuccess: "",
    addItem: false,
    defaultSellByDate: format(addWeeks(new Date(), 520),'YYYY-MM-DD'),
    adminID: ADMIN_ID
  },
  mutations,
  actions,
  getters
})