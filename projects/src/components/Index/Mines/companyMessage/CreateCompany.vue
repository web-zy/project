<template>
  <div class="outOf">
    <von-header>
      <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
      <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
      <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
    </von-header>
    <div class="center">
      <div class="list">
        <ul>
          <li class="list-item">
            <span class="left required"><span>*</span>公司简称</span>
            <input v-model="abbreviation" placeholder="请输入公司简称" class="item-se " type="text" name="">
          </li>
          <li class="list-item">
            <span class="left">公司全称</span>
            <input v-model="fullName" placeholder="请输入公司全称" class="item-se " type="text" name="">
          </li>
          <li class="list-item">
            <span class="left">行业</span>
            <input v-model="industry" placeholder="请输入行业" class="item-se " type="text" name="">
          </li>
        </ul>
      </div>
    </div>
    <div class="btnsub">
      <ButtonBottom :loading="loading" @call-back="even ? establish() : modify()">保存</ButtonBottom>
    </div>
  </div>
</template>

<script>
  import api from '../../../../asset/api.js';
  import utrl from '../../../../controller/utrl.js';

  export default {
    data() {
      return {
        msg: '',
        abbreviation: "",                    //简称
        fullName: "",                        //全称
        industry: "",                         //行业
        even: false,
        loading: false
      }
    },
    activated() {
      this.msg = this.$route.params.type;
      if (this.msg === '创建公司') this.even = true;
      if (this.msg === '修改公司信息') {
        let companyObject = JSON.parse(sessionStorage.getItem('company_msg'));
        this.abbreviation = companyObject.company_name;
        this.fullName = companyObject.company_fullname;
        this.industry = companyObject.company_industry;
      }
    },
    methods: {
      back: function () {
        $router.go(-1);
      },
      async establish() {
        if (this.abbreviation === "") {
          $toast.show("公司简称不能为空", 3000);
          return;
        }
        this.loading = true;
        let bizid = utrl.setbizid();
        let url = `companys?bizid=${bizid}&token=${api.token}`;
        let res = await api.post(url, {
          "name": this.abbreviation,
          "fullname": this.fullName,
          "industry": this.industry
        });
        if (res.status >= 200 && res.status < 300) {
          $dialog.confirm({
            title: "操作提示",
            content: "创建成功，是否继续创建？", cancelText: "否", okText: "是", theme: "ios"
          })
            .then(async (res) => {
              if (res) {
                this.abbreviation = "";
                this.fullName = "";
                this.industry = "";
              } else {
                let mine = await api.get("users/current/mycompanies?token=" + api.token + "&size=1000");
                if (mine.status >= 200 && mine.status < 300) api.mycompanies = mine.data;
                else $toast.show(mine.data.errmsg, 1000);
                this.$router.go(-1);
              }
            });
        } else {
          $toast.show(res.data.errmsg, 3000);
        }
        this.loading = false;
      },
      async modify() {
        if (this.abbreviation == "") {
          $toast.show("公司简称不能为空", 3000);
          return;
        }
        this.loading = true;
        let companyJson = JSON.parse(sessionStorage.getItem('company_msg'));
        let url = `companys/${companyJson.company_id}?company_id=${companyJson.company_id}&token=${api.token}`;
        let res = await api.put(url, {"name": this.abbreviation, "fullname": this.fullName, "industry": this.industry});
        if (res.status >= 200 && res.status < 300) {
          this.abbreviation = "";
          this.fullName = "";
          this.industry = "";
          $toast.show('修改成功', 3000);
          this.$router.go(-1);
        } else {
          $toast.show(res.data.errmsg, 3000);
        }
        this.loading = false;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url("../../../establish/commoncss/common.css");

  .center {
    z-index: 1;
    position: fixed;
    width: 100%;
    height: calc(100 vh-11rem);
    padding-top: 2.5rem;
    margin-bottom: 2.2rem;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      height: 2.27rem;
      background-color: #fff;
      .left {
        padding-left: 1rem;
        font-size: 0.75rem;
        &.required {
          position: relative;
          > span {
            position: absolute;
            left: .4rem;
            font-size: 1rem;
            color: red;
          }
        }
      }
      .item-se {
        width: 70%;
        text-align: right;
        padding-right: .5rem;
        font-size: 0.75rem;
      }
      .text {
        position: absolute;
        right: 3rem;
        height: 1.8rem;
        line-height: 1.8rem;
        font-size: 0.75rem;
      }
      .icon-right {
        width: 1.3rem;
        height: 1.3rem;
        float: right;
        margin-top: 0.25rem;
        margin-right: 1rem;
        background: url('/static/work_images/rightArrow.png') no-repeat center center;
        background-size: cover;
      }
    }
  }
</style>
