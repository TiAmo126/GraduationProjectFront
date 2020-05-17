import Vue from 'vue'
import Vuex from 'vuex'
import {availableContentHeight, availableContentWidth} from "../lib/utils";

Vue.use(Vuex);

const state = {
  // routerList: sessionStorage.getItem("routerList"),
  currentUser: sessionStorage.getItem("currentUser"),
  clientHeight: 0,
  clientWidth: 0,
};

const getters = {
  // routerList: state => state.routerList,
  currentUser: state => state.currentUser,
  clientHeight: state => state.clientHeight,
  clientWidth: state => state.clientWidth,
};

const mutations = {
  userStatus: (state, user) =>{
    if (user) {
      state.currentUser = user;
      sessionStorage.setItem("currentUser", user);
    } else if (user === null) {
      sessionStorage.setItem("currentUser", null);
      state.currentUser = null;
    }
  },
  clientHeight: (state) => {
    state.clientHeight = availableContentHeight(0)
  },
  clientWidth: (state) => {
    state.clientWidth = availableContentWidth(0)
  }
  // routerList: (state, router) => {
  //   if (router) {
  //     state.routerList = router;
  //     sessionStorage.setItem("routerList", router);
  //   } else if (router === null) {
  //     sessionStorage.setItem("routerList", null);
  //     state.routerList = null;
  //   }
  // }
};

const actions = {
  setUser: ({commit}, user) => {
    commit('userStatus', user);
  },
  // setRouter: ({commit}, router) => {
  //   commit('routerList', router);
  // }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
