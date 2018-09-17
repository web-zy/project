import Vue from 'vue'
import Vonic from 'vonic'
import routes from './router.js'
// import routes from './router-backups.js'
import "./asset/base.css"
import utrl from "./controller/utrl.js"
import Assemblys from "./controller/Assemblys.js"
import index from "./index.js"
import axios from "axios"
import AMap from "./controller/amap.js"
Vue.prototype.$http = axios;
// Vue.use(Vuex)

import api from "./asset/api.js"
import "../static/font/style.css"

Vonic.app.setConfig("beforeEach", (to, from, next) => {
  // console.log(to,from)
  // console.log(to)
  // if (to.matched[1].path == '/user') {
  // 	api.token = "";
  //   next()
  //   return
  // }else{
  //   next()
  // }
//   if(sessionStorage.hrefImportant){
//     next()
//     return
//   }
//   let timestamp = new Date().getTime();
//   let url = window.location.origin + '?' + timestamp
//   let hash = window.location.hash
//   // console.log(timestamp,url)
//   sessionStorage.hrefImportant = true;
//   window.location.href = url + hash;
  next()
})
Vonic.app.setConfig('pageTransition', 'ios')
// Vonic.app.setConfig('pushMethod', 'push')

Vue.use(Vonic.app, {
  routes: routes,
  utrl:utrl,
  index,
  Assemblys:Assemblys,
  AMap:AMap
})
