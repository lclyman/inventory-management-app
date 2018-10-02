import * as firebase from "firebase"
import router from '../router/index'

export const signIn = ({ commit, dispatch }, user) => {
  commit('setLoading', true)
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(user => {
      commit('clearError')
      dispatch('getUserInfo', user.uid)
    }).catch(error => {
      commit('setLoading', false)
      commit('setError', error.message)
    })
};

export const getUserInfo = ({ commit, dispatch }, userId) => {
  firebase.database().ref('users').child(userId).once('value')
    .then(data => {
      const objUser = data.val()
      commit('setUser', objUser)
      if (objUser.authLevel === '1') {
        dispatch('loadUsers')
      }
      dispatch('loadProducts')
    })
};

export const loadUsers = ({ commit }) => {
  firebase.database().ref('users').once('value')
    .then((data) => {
      const users = []
      const obj = data.val()
      for (let key in obj) {
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

export const loadProducts = ({ commit, state }) => {
  firebase.database().ref('products').once('value')
    .then((data) => {
      const objProducts = data.val()
      const items = []
      let reorderDate = ''
      let lastEditDate = ''
      let sbd = ''
      let tempSellByDate = ""
      let creatorId = ''
      let editedBy = ''
      let onReorderList = ''

      if (state.user.authLevel === "1") {
        // 10 years in the future, created for sorting purposes
        tempSellByDate = state.defaultSellByDate
      } else {
        tempSellByDate = ""
      }

      // standardize each item with elements of the legacy db

      Object.keys(objProducts).forEach(key => {
        objProducts[key].reorderDate === undefined ? reorderDate = '' : reorderDate = objProducts[key].reorderDate
        objProducts[key].onReorderList === undefined ? onReorderList = false : onReorderList = objProducts[key].onReorderList
        objProducts[key].lastEditDate === undefined ? lastEditDate = '' : lastEditDate = objProducts[key].lastEditDate

        // fill all blank sellBy dates for date sorting...these will still show as blank on products pages
        objProducts[key].SellbyDate === "" ? sbd = tempSellByDate : sbd = objProducts[key].SellbyDate

        objProducts[key].creatorId === undefined ? creatorId = '' : creatorId = objProducts[key].creatorId
        objProducts[key].editedBy === undefined ? editedBy = '' : editedBy = objProducts[key].editedBy

        items.push({
          id: key,
          brandName: objProducts[key].Brand,
          receiptAlias: objProducts[key].ReceiptAlias,
          scancode: objProducts[key].Scancode,
          SellbyDate: sbd,
          creatorId: creatorId,
          editedBy: editedBy,
          lastEditDate: lastEditDate,
          reorderDate: reorderDate,
          onReorderList: onReorderList
        })
      })

      commit('loadProducts', items)
      commit('setLoading', false)
      if (state.loc !== '/addNewItem') {
        router.push(state.loc)
      }

    })
    .catch((error) => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
};

export const signUp = ({ commit, dispatch }, newUser) => {
  commit('setLoading', true)
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(
      user => {
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
    ).catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
};

export const addNewUser = ({ commit, dispatch }, currUser) => {
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

export const editUser = ({ commit }, user) => {
  firebase.database().ref('users').child(user.userId).update(user)
    .catch(error => {
      commit('setError', error.message)
      console.log(error);
    })
  router.replace('/users')
};

export const addNewItem = ({ commit, dispatch }, newItem) => {
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

export const editItem = ({ commit, dispatch }, item) => {
  firebase.database().ref('products').child(item.id).update(item)
    .catch(error => {
      commit('setError', error.message)
      console.log(error);
    })
  dispatch('loadProducts')
};

export const reorderItem = ({ commit, dispatch }, reorderedItem) => {
  firebase.database().ref('products').child(reorderedItem.id).update(reorderedItem)
    .catch(error => {
      commit('setError', error.message)
      console.log(error);
    })
  dispatch('loadProducts')
};

export const setLoadedScancode = ({ commit, state }, objItem) => {
  if (objItem.scancodeFound) {
    commit('setMessage', 'Item found. Enter new Sell By date.')
    let product = state.products.find(el => el.scancode === objItem.sc)
    commit('setScancodeStatus', true)
    commit('loadProduct', product)
  } else {
    commit('setMessage', 'Product not found. Add item.')
    commit('setAddItem', true)
    commit('setLoadedScancode', objItem.sc)
  }
}

export const addOrder = ({ commit, state, dispatch }, objItem) => {
  if (objItem.scancodeFound) {
    let product = state.products.find(el => el.scancode === objItem.sc)
    let objItemRestock = { itemId: product.id, action: 'add' }
    dispatch('setRestockStatus', objItemRestock)
    router.push('/reorders')
    commit('setMessageSuccess', 'Item added to list.')
  } else {
    commit('setMessage', 'Product not found!')
    setTimeout(() => {
      commit('clearMessage')
    }, 3500);
  }
}

export const setRestockStatus = ({ commit, dispatch }, objItemRestock) => {
  commit('setLoading', true)
  let entryRef = firebase.database().ref('products').child(objItemRestock.itemId)
  let restockStatus = true
  objItemRestock.action === 'remove' ? restockStatus = false : ''
  return entryRef.update({ onReorderList: restockStatus })
    .then(() => {
      console.log("Document successfully updated!");
      dispatch('loadProducts')
    })
    .catch(error => {
      console.error("Error updating document: ", error);
    });
}

export const clearRestockList = ({ commit, dispatch, getters }) => {
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
