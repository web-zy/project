<template>
    <div id="content">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div class="selAllPerson" v-if="id === 2">
            <span class="wrap" @click="selAll_func">
                <i :class="isSelAll ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                <span class="txt">全选</span>
            </span>
        </div>
        <div>
            <scroll :class="id === 2 ? 'top-5r' : 'top-2d5r'" :on-refresh="onRefresh">
                <ul class="msg-list">
                    <li class="msg-item" v-for="(item,k) in persons" :key="k" @click="selectCharges(k)">
                        <i :class="item.isTrue ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                        <!--<img class="img"-->
                             <!--:src="headUrl + 'files/' + item.head_image_id-->
                        <!--+ '/thumbnail/66?token=' + token + '&company_id=' + company_id" alt="" v-if="item.head_image_id">-->
                        <!--<span class="lastFont" v-else>{{item.user_name | interception}}</span>-->
                        <head-portrait class="img" :userInfo="item" :size="'small'"></head-portrait>
                        <span class="uname">{{item.user_name}}</span>
                    </li>
                </ul>
                <div v-if="infiniteCount"
                     slot="infinite" class="text-center">没有人员信息~</div>
            </scroll>
        </div>
        <div v-if="id === 2" class="btnsub">
            <button @click="confirm">确定</button>
        </div>
    </div>
</template>
<script>
    import api from '../../../../asset/api.js';
    import Vue from 'vue';

    export default {
        data() {
            return {
                msg:"",
                id:null,
                user_id:null,
                isSelAll:false,
                page:1,
                size:1000,
                headUrl:api.domain,
                company_msg:null,                                               //公司信息
                company_id:"",                                                  //公司ID
                persons:[],                                                      //该公司下所有人员
                infiniteCount:false,
                menuButtonText:"",
                token:api.token
            }
        },
        filters:{
            interception(val){
                if(val) return val.substr(-1);
            }
        },
        mounted(){
            let company_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
			console.log(this.$route.params)
            this.id = this.$route.params.id;
            this.msg = this.$route.params.name;
            this.user_id = this.$route.params.user_id;
            if(this.user_id.length){
            	 (Object.prototype.toString.call(this.user_id) === "[object String]")  ?
                this.user_id.split(",")     :     this.user_id.length === 0   ?
                this.user_id = []           :     this.user_id;
            }
           

            if(company_msg === undefined && company_msg === null){
                console.error("请传入公司信息");
            }else{
                this.company_msg = company_msg;
                this.menuButtonText = company_msg.company_name;
                this.company_id = company_msg.company_id;
            }
            this.init();
        },
        methods: {
            async init(){
                let company_id = this.company_id;
                let url = `employees?token=${api.token}&company_id=${company_id}&page=${this.page}&size=${this.size}`;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    console.log("没有人员信息");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    let num = 0;
                    let arr = this.user_id;
                    console.log(arr);
                    let ce_us = (this.id === 1) ? arr.length !== 0 ? [arr[arr.length - 1]] : [] : arr;
                    console.log(ce_us);
                    for(let i = 0; i < res.length; i++){
                        Vue.set(res[i],'isTrue',false);
                        for(let j = 0; j < ce_us.length; j++){
                            if(res[i].user_id === ce_us[j]){
                                Vue.set(res[i],'isTrue',true);
                                num++;
                            }
                        }
                    }
                    this.persons = res;
                    this.persons.length === num ? this.isSelAll = true : this.isSelAll = false;
                    // if(res[0].totals > this.persons.length){
                    //     this.persons.length == 0 ? this.persons = res : this.persons = this.persons.concat(res);
                    //     if(done) done();
                    //     res[0].totals > this.persons.length ? this.infiniteCount = false : this.infiniteCount = true;
                    // }
                    // return;
                }else{
                    console.log(res.data.errmsg);                         //服务器返回的错误信息
                }
                this.infiniteCount = true;
            },
            onRefresh(done) {                                           // 刷新
                // this.page = 1;
                // this.persons = [];
                this.init();
                done();
            },
            // onInfinite(done){                                           //加载
            //     if(this.infiniteCount){
            //         done();
            //     }else{
            //         this.page = this.page+1;
            //         this.init(done);
            //     }
            // },
            selAll_func(){
                this.isSelAll = !this.isSelAll
                for(let i = 0; i < this.persons.length; i++){
                    Vue.set(this.persons[i],'isTrue',this.isSelAll);
                }
            },
            selectCharges(k){
                let persons = this.persons;
                if(this.id === 1) {
                    for(let i = 0; i < persons.length; i++){
                        if(i !== k && persons[i].isTrue === true) Vue.set(persons[i],'isTrue',false);
                    }
                }
                persons[k].isTrue = !persons[k].isTrue;
                if(this.id === 1) {
                    this.confirm();
                }else {
                    let num = 0;
                    for(let val of this.persons){
                        if(!this.isSelAll && val.isTrue) {
                            num++;
                        } else if(this.isSelAll && !val.isTrue){
                            num--;
                        }
                    }
                    this.persons.length === num ? this.isSelAll = true : this.isSelAll = false;
                }
            },
            confirm(){
                let arr = this.persons;
                let exportArr = [];

                for(let i = 0; i < arr.length; i++){
                    if(arr[i].isTrue === true){
                        exportArr.push(arr[i]);
                    }
                }
                let o = JSON.stringify(exportArr);
                window.localStorage.setItem("selectPerson",o);
                window.sessionStorage.setItem("selectPerson",o);
                this.$router.go(-1);
            },
        }
    }
</script>
<style lang="less" scoped>
    @import url("../../../establish/commoncss/common.css");
    @import url("../../../Index/Mines/companyMessage/css/company.css");
    .top-5r{
        top:2.9rem !important;
    }
    .selAllPerson{
        position:fixed;
        top:2.5rem;
        background-color:#fff;
        width:100%;
        display: flex;
        align-items: center;
        height: 2.27rem;
        font-size: .75rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding: 0 .5rem;
        z-index: 20;
        .wrap{
            line-height: 1;
            .txt{
                margin:0 .5rem;
                vertical-align: text-top;
            }
            .ion-checkmark-circled{
                font-size:1.2rem;
                color:#f2bf07;
            }
            .ion-ios-circle-outline{
                font-size:1.2rem;
                color:#bbb;
            }
        }

    }
    .msg-list{
        background-color:#fff;
        .msg-item{
            display: flex;
            align-items: center;
            height:2.27rem;
            font-size:.75rem;
            color:#333;
            border-bottom:1px solid #eee;
            padding:0 .5rem;
            .ion-checkmark-circled{
                font-size:1.2rem;
                color:#f2bf07;
            }
            .ion-ios-circle-outline{
                font-size:1.2rem;
                color:#bbb;
            }
            .lastFont{
                text-align: center;
                color:#fff;
                vertical-align: middle;
                line-height: 1.7;
                background-color: #f39800;
            }
            .img,.lastFont{
                width:1.3rem;
                height:1.3rem;
                margin:0 .5rem;
                border-radius: 50%;
            }
        }
    }
</style>
