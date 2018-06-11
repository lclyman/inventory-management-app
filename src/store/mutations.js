export const loadProducts = (state, items) => {
  state.products = items
};

export const setUser = (state, currUser) => {
  state.user = currUser
};

export const loadUsers = (state, users) => {
  state.loadedUsers = users
};

export const clearAll = state => {
  state.loading = false
  state.message = ""
  state.messageSuccess = ""
  state.fbError = ""
  state.scancodeFound = false
  state.hideNav = false
  state.showMonth = false
  state.user = null
  state.addItem = false
  state.loadedUsers = []
  state.products = []
  state.loadedProduct = null
  state.loc = ""
};

export const setError = (state, err) => {
  state.fbError = err
};

export const setAddItem = (state, status) => {
  state.addItem = status
};

export const setLoadedScancode= (state, scancode) => {
  state.loadedScancode = scancode
};

export const clearLoadedScancode= (state, scancode) => {
  state.loadedScancode = ""
};

export const setReorderList = (state, arrReorderList) => {
  state.reorderList = arrReorderList
};

export const clearError = state => {
  state.fbError = ''
};

export const setLoading = (state, status) => {
  state.loading = status
};

export const makePrintable = state => {
  state.hideNav = true
};

export const showNavbar = state => {
  state.hideNav = false
};

export const loadProduct = (state, item) => {
  state.loadedProduct = item
};

export const updateLoadedProduct = (state, val) => {
  state.loadedProduct.SellbyDate = val
};

export const clearLoadedProduct = state => {
  state.loadedProduct = null
};

export const setScancodeStatus = (state, status) => {
  state.scancodeFound = status
};

export const setMessage = (state, msg) => {
  state.message = msg
};

export const clearMessage = (state, msg) => {
  state.message = ""
};

export const setMessageSuccess = (state, msgSuccess) => {
  state.messageSuccess = msgSuccess
  setTimeout(() => {
    state.messageSuccess = ""
  }, 4000);
};

export const setLoc = (state, dest) => {
  state.loc = dest
};

export const changeView = state => {
  state.showMonth = !state.showMonth
};