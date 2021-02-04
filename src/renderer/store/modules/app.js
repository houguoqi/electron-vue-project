const state = {
  userInfo: null,
  token: ''
}

const mutations = {
  SET_USERINFO (state, userInfo) {
    state.userInfo = userInfo
  },
  SET_TOKEN (state, token) {
    state.token = token
  }
}

const actions = {
  SET_TOKEN_ASYNC ({ commit, token }) {
    // do something async
    commit('SET_TOKEN', token)
  },
  SET_USERINFO_ASYNC ({ commit, userInfo }) {
    // do something async
    commit('SET_USERINFO', userInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
