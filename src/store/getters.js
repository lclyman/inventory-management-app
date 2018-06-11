import isWithinRange from 'date-fns/is_within_range'
import {addDays, addMonths} from 'date-fns';

export const products = state => {
  let arrProducts = state.products.filter(el => {
    return el.reorderDate === ""
  })
  return arrProducts
};

export const getSellBySoon = state => {
  let tenDaysFromNow = addDays(new Date(), 10)
  let oneWeekAgo = addDays(new Date(), -7)
  let arrSellBySoon = state.products.filter(el => {
    return isWithinRange(el.sellByDate, oneWeekAgo, tenDaysFromNow)
  })
  return arrSellBySoon
};

export const getSellBySoonMonth = state => {
  let OneMonthFromNow = addMonths(new Date(), 1)
  let oneWeekAgo = addDays(new Date(), -7)
  let arrSellBySoonMonth = state.products.filter(el => {
    return isWithinRange(el.sellByDate, oneWeekAgo, OneMonthFromNow)
  })
  return arrSellBySoonMonth
};

export const reorderedItems = state => {
  let arrReorders = state.products.filter(el => {
    return el.onReorderList === true
  })
  return arrReorders
};

export const loadedProduct = state => {
  return state.loadedProduct
}

export const addItem = state => {
  return state.addItem
}