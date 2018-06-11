import Vue from 'vue';
import * as firebase from "firebase"
import router from '../router/index'
import addWeeks from 'date-fns/add_weeks'
import format from 'date-fns/format'
import { STATUS_CODES } from 'http';

export const signIn = ({commit, dispatch}, user) => {
  commit('setLoading', true)
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(user => {
      commit('clearError')
      dispatch('getUserInfo', user.uid )
    }).catch( error => {
        commit('setLoading', false)
        commit('setError', error.message)
    })
};

export const getUserInfo = ({commit, dispatch}, userId) => {
  firebase.database().ref('users').child(userId).once('value')
  .then(data => {
    const objUser = data.val()
    commit('setUser', objUser)
    if(objUser.authLevel === '1'){
      dispatch('loadUsers')
    }
    dispatch('loadProducts')
  })
};

export const loadUsers = ({commit}, users) => {
  firebase.database().ref('users').once('value')
  .then((data) => {
    const users= []
    const obj = data.val()
    for(let key in obj){
      users.push({
        userId: obj[key].userId,
        name: obj[key].name,
        email: obj[key].email,
        authLevel: obj[key].authLevel
      })
    }
    commit('loadUsers', users)
  })
  .catch((error) => {
    commit('setError', error.message)
    commit('setLoading', false)
  })
};

export const loadProducts = ({commit, state}, items) => {
  firebase.database().ref('products').once('value')
  .then((data) => {
    const objProducts = data.val()
    const items= []
    let reorderDate = ''
    let lastEditDate = ''
    let sbd = ''
    let tempSellByDate = ""
    let creatorId = ''
    let editedBy = ''
    let onReorderList = ''

    // fill all blank sellBy dates for date sorting...these will still show as blank on products pages
    if (state.user.authLevel === "1") {
      tempSellByDate = state.defaultSellByDate // 10 years in the future
    } else {
      tempSellByDate = ""
    }

    for(let key in objProducts){

      objProducts[key].reorderDate === undefined ? reorderDate = '' : reorderDate = objProducts[key].reorderDate
      objProducts[key].onReorderList === undefined ? onReorderList = false : onReorderList = objProducts[key].onReorderList
      objProducts[key].lastEditDate === undefined ? lastEditDate = '' : lastEditDate = objProducts[key].lastEditDate
      objProducts[key].SellbyDate === "" ? sbd = tempSellByDate : sbd = objProducts[key].SellbyDate
      objProducts[key].creatorId === undefined ? creatorId = '' : creatorId = objProducts[key].creatorId
      objProducts[key].editedBy === undefined ? editedBy = '' : editedBy = objProducts[key].editedBy

      items.push({
        id: key,
        brandName: objProducts[key].Brand,
        receiptAlias: objProducts[key].ReceiptAlias,
        scancode: objProducts[key].Scancode,
        sellByDate: sbd,
        creatorId: creatorId,
        editedBy: editedBy,
        lastEditDate: lastEditDate,
        reorderDate: reorderDate,
        onReorderList: onReorderList
      })
    }

    commit('loadProducts', items)
    commit('setLoading', false)
    if(state.loc !== '/addNewItem') {
      router.push(state.loc)
    }

  })
  .catch((error) => {
    commit('setError', error.message)
    commit('setLoading', false)
  })
};

export const signUp = ({commit, dispatch}, newUser) => {
  commit('setLoading', true)
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then(
    user =>{
      commit('setLoading', false)
      commit('clearError')
      const currUser = {
        userId: user.uid,
        name: newUser.name,
        email: user.email,
        authLevel: '3'
      }
      dispatch('addNewUser', currUser)
      }
    ).catch( error => {
      commit('setError', error.message)
      commit('setLoading',false)
    })
};

export const addNewUser = ({commit, dispatch}, currUser) => {
  firebase.database().ref('users').child(currUser.userId).update(currUser)
    .then((data) => {
      commit('clearAll')
      dispatch('getUserInfo', currUser.userId)
    })
    .catch((error) => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
};

export const editUser = ({commit, dispatch}, user) => {
  firebase.database().ref('users').child(user.userId).update(user)
  .catch(error => {
    commit('setError', error.message)
    console.log(error);
  })
  dispatch('loadUsers')
  router.replace('/users')
};

export const addNewItem = ({commit, dispatch}, newItem) => {
  firebase.database().ref('products').push(newItem)
    .then((data) => {
      dispatch('loadProducts')
      commit('setScancodeStatus', false)
      commit('clearMessage')
      commit('setMessageSuccess', 'Item sucessfully added!')
    })
    .catch((error) => {
      commit('setError', error.message)
    })
};

export const editItem = ({commit, dispatch}, item) => {
  firebase.database().ref('products').child(item.id).update(item)
  .catch(error => {
    commit('setError', error.message)
    console.log(error);
  })
  dispatch('loadProducts')
};

export const reorderItem = ({commit, dispatch}, reorderedItem) => {
  firebase.database().ref('products').child(reorderedItem.id).update(reorderedItem)
  .catch(error => {
    commit('setError', error.message)
    console.log(error);
  })
  dispatch('loadProducts')
  router.replace('/products')
};

export const getProductFromScancode = ({commit, getters, dispatch}, sc) => {
  commit('setMessage', 'Searching...')
  let scancodeFound = getters.products.find(el => el.scancode === sc)
  if (scancodeFound) {
      commit('setMessage', 'Enter Sell By date')
      let product = getters.products.find(el => el.scancode === sc)
      commit('setScancodeStatus', true)
      commit('loadProduct', product)
  } else {
    commit('setMessage', 'Product not found. Put aside and do not stock!')
    commit('setScancodeStatus', false)
  }
}

export const setLoadedScancode = ({commit, getters, dispatch}, sc) => {
  let scancodeFound = getters.products.find(el => el.scancode === sc)
  if (scancodeFound) {
    commit('setMessage', 'Item found. Enter new Sell By date.')
    let product = getters.products.find(el => el.scancode === sc)
    commit('setScancodeStatus', true)
    commit('loadProduct', product)
  } else {
      commit('setMessage', 'Product not found. Add item.')
      commit('setAddItem', true)
      commit('setLoadedScancode', sc)
  }
}

export const addOrder = ({commit, getters, dispatch}, sc) => {
  let scancodeFound = getters.products.find(el => el.scancode === sc)
  if (scancodeFound) {
    let product = getters.products.find(el => el.scancode === sc)
    product.onReorderList=true
    firebase.database().ref('products').child(product.id).update(product)
    dispatch('loadProducts')
    router.push('/reorders')
    commit('setMessageSuccess', 'Item added to list.')
  } else {
     commit('setMessage', 'Product not found!')
     setTimeout(() => {
       commit('clearMessage')
     }, 3500);
  }
}

export const removeFromRestockList = ({commit, dispatch}, itemId ) =>{
  commit('setLoading', true)
  let entryRef = firebase.database().ref('products').child(itemId)
  return entryRef.update({
      onReorderList: false
  })
  .then(() => {
      console.log("Document successfully updated!");
      dispatch('loadProducts')
  })
  .catch(error => {
      console.error("Error updating document: ", error);
  });
}

export const clearRestockList = ({commit, dispatch, getters}) => {
  commit('setLoading', true)
  getters.reorderedItems.forEach(el => {
    let itemId = el.id
    let entryRef = firebase.database().ref('products').child(itemId)
    return entryRef.update({
        onReorderList: false
    })
  })
  dispatch('loadProducts')
}