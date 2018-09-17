import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)


const state={
    login:false
}

const mutations={
    loginSuss(state){
        state.login = false;
    },
    loginErr(state){
        state.login = true;
    }
}

export default new Vuex.Store({
	state,mutations
})