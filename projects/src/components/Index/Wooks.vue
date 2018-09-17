<template>
  <div class="work_box">
    <div class="bar bar-header bar-light">
      <ChoiceCompany :special="true" @give-company="setCompony"></ChoiceCompany>
    </div>
    <div class="conent">
      <scroll class="page-content">
        <div class="work-icon" v-for="(v,index) in worksArr" :key="index" v-if="v.id ? v.show ? true : false : true">
          <div class="title"><em></em>{{v.title}}</div>
          <ul>
            <li v-for="(va,index) in v.subIcon" @click="va.child ? openBox(va.child) : go(va.to)" v-if="va.id ? va.show ? true : false : true">
              <div class="img_box" :class=va.icon :style="{backgroundColor : va.bgc}">
                                <span class="text" v-html="va.icon ? '' : '敬请<br/>期待'"
                                      :style="va.icon ? '' : 'line-height:.8rem'"></span>
              </div>
              {{va.name}}
            </li>
          </ul>
        </div>
      </scroll>
    </div>
    <transition name="fade">
      <div v-show="isShow" class="dimmer" @click.stop="hide">
        <div class="popup-cpy" @click.stop>
          <div class="work-icon child">
            <ul>
              <li class="child" v-for="(v,i) in childArr" :key="i" @click="godetails(v)"
                  v-if="v.show">
                <div class="img_box" :class=v.icon :style="{backgroundColor : v.bgc}"></div>
                {{v.name}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import worksArr from "./../../asset/worksConfigure.js"
  import api from '../../asset/api.js';
  import "./Workbench/utrl/NewOrder.less"
  import Vue from 'vue'

  export default {
    data() {
      return {
        // msg: '工作',
        company_id: null,
        iscrollOption: {
          mouseWheel: true,
          preventDefault: true,
          bounce: true,
          momentum: true,
          startX: false
        },
        worksArr: worksArr,
        childArr: [],
        isShow: false,
      }
    },
    watch: {
      company_id(cur) {
        this.filterSubIcon(cur);
      }
    },
    methods: {
      godetails(e) {
        this.$router.push({name: e.to});
      },
      // 在工作台切换公司后，要自动设置该 公司为当前用户 的默认公司
      async setCompony(o) {
        this.company_id = o.company_id;
        let url = `users/current/defaultcompany?token=${api.token}&companyId=${o.company_id}`;
        let res = await api.patch(url);

        if (res.status >= 200 && res.status <= 300) {
          let cpn = null;
          for (let i = 0; i < api.mycompanies.length; i++) {
            if (api.mycompanies[i].default === 1) {
              api.mycompanies[i].default = 0;
            }
            if (api.mycompanies[i].company_id === o.company_id) {
              cpn = api.mycompanies[i];
              api.mycompanies.splice(i, 1);
            }
          }
          let obj = JSON.parse(sessionStorage.getItem('company_msg'));
          cpn.default = obj.default = 1;
          api.mycompanies.unshift(cpn);
          sessionStorage.setItem('company_msg', JSON.stringify(obj));
        } else {
          $toast.show(res.data.errmsg, 3000);
        }
      },
      // 根据人员权限接口返回人员权限，控制前台功能菜单是否显示，功能权限上不设置ID的代表全部显示
      async filterSubIcon(id) {
        let url = `usermenus/${api.userInfo.id}?token=${api.token}&company_id=${id}`;
        let res = await api.get(url);

        if (res.status === 204 || res.status === 504) {
          console.log("没有权限信息");
          this.filterFunc(this.worksArr);
        } else if (res.status >= 200 && res.status < 300) {

          let arr = [];

          for (let val of res.data) {
            if (val.company_id === id) {
              arr.push(val);
            }
          }
          this.filterFunc(this.worksArr);
          for (let v of arr) {
            for (let z of this.worksArr) {
              if (v.id == z.id) {
                Vue.set(z, 'show', true);
              }
              for (let s of z.subIcon) {
                if (v.id == s.id) {
                  Vue.set(s, 'show', true);
                }
                if (s.child) {
                  for (let c of s.child) {
                    if (v.id == c.id) {
                      Vue.set(c, 'show', true);
                    }
                  }
                }
              }
            }
          }
        } else {
          console.log(res.data.errmsg);                         //服务器返回的错误信息
        }
      },
      openBox(o) {
        this.childArr = o;
        this.$nextTick(() => {
          this.isShow = true;
          history.pushState(null, null, document.URL);
          window.addEventListener("popstate", this.hide, false);
        });
      },
      filterFunc(arr) {
        for (let val of arr) {
          Vue.set(val, 'show', false);
          for (let s of val.subIcon) {
            Vue.set(s, 'show', false);
            if (s.child) {
              for (let c of s.child) {
                Vue.set(c, 'show', false);
              }
            }
          }
        }
      },
      hide(e) {
        this.isShow = false;
        if (e.toString() === '[object MouseEvent]') history.go(-1);
        window.removeEventListener("popstate", this.hide, false);
      },
      go(to) {
        $router.push(to);
      }
    },
  }
</script>
<!--Add "scoped" attribute to limit CSS to this component only-->
<style lang="less" scoped>
  .work_box {
    width: 100%;
    height: 100vh;
    padding: 2.5rem 0 2.5rem 0;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    .button.button-icon {
      font-size: 1rem;
    }
    .headTop {
      width: 100%;
      position: fixed;
      // top: 2.5rem;
      top: 0rem;
      .workTop {
        width: 100%;
        height: 2.5rem;
        display: flex;
        -webkit-justify-content: space-between;
        span {
          display: block;
          height: 2.5rem;
          width: calc(100% / 3);
          text-align: center;
          font-size: 20px;
          line-height: 2.4rem;
        }
        span:nth-child(1) {
          font-size: 28px;
          text-align: left;
          padding-left: 0.7rem;
        }
      }
      .slide {
        width: 100%;
        height: 7.5rem;
        background-color: papayawhip;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .conent {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      background: #eee;
      .page-content {
        top: 0;
      }
    }
  }

  .work-icon {
    width: 100%;
    background: #fff;
    padding: 0.75rem 0;
    box-shadow: 0.03rem 0.04rem 0.08rem 0rem #dddddd;
    margin-bottom: 0.18rem;
    &.child {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
    .title {
      width: 100%;
      color: #333;
      font-weight: 600;
      line-height: 1rem;
      font-size: 0.8rem;
      position: relative;
      padding-left: 1.13rem;
      em {
        display: block;
        position: absolute;
        left: 0.57rem;
        top: 0.25rem;
        width: 0.25rem;
        height: 0.5rem;
        background-color: #f2be06;
      }
    }
    > ul {
      width: 100%;
      display: flex;
      flex-flow: wrap;
      padding-top: 0.65rem;
      li {
        width: 25%;
        height: 4rem;
        text-align: center;
        font-size: 0.7rem;
        line-height: 1.5rem;
        &.child {
          margin-bottom: .5rem;
          width: calc(100% / 3);
        }
        .img_box {
          width: 2.28rem;
          height: 2.28rem;
          margin: 0 auto;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 1.6rem;
          .text {
            font-size: .45rem;
            color: #777777;
          }
          &::before {
            color: #fff;
          }
        }

      }
    }
  }

  a {
    color: #000000;
  }

  .dimmer {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
    .popup-cpy {
      width: 94vw;
      max-height: 80vh;
      /*padding:1.15rem;*/
      padding: 1.2rem .6rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: white;
      border-radius: 0.25rem;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
    .popup-cpy {
      transition: all 0.3s ease;
    }
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    .popup-cpy {
      opacity: 0;
      transform: scale(0.8);
    }
  }
</style>
