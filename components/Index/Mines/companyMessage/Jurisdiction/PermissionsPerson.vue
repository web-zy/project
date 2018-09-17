<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div>
            <scroll class="page-content padding-top top-2d5r" :on-refresh="onRefresh" :on-infinite="onInfinite">
                <ul>
                    <li class="reference" v-for="(item,k) in persons" :key="k" @click="routerGo(item)">
                        <!--<img class="img"-->
                             <!--:src="headUrl + 'files/' + item.head_image_id-->
                        <!--+ '/thumbnail/66?token=' + token + '&company_id=' + company_id" alt="" v-if="item.head_image_id">-->
                        <!--<span class="lastFont" v-else>{{item.user_name | interception}}</span>-->
                        <head-portrait class="img" :userInfo="item" :size="'small'"></head-portrait>
                        <p class="name">{{item.user_name}}</p>
                        <p class="fuhao"><i class="ion-chevron-right"></i></p>
                    </li>
                </ul>
                <div v-if="infiniteCount"
                     slot="infinite" class="text-center">没有人员信息~</div>
            </scroll>
        </div>
    </div>
</template>
<script>
    import api from '../../../../../asset/api.js';
    import Vue from 'vue';
    import utrl from '../../../../../controller/utrl.js';

    export default {
        data() {
            return {
                msg:"人员",
                headUrl:api.domain,
                page:1,
                size:20,
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

            if(company_msg === undefined && company_msg === null){
                console.error("请传入公司信息");
            }else{
                this.company_msg = company_msg;
                this.menuButtonText = company_msg.company_name;
                this.company_id = company_msg.company_id;
            }

            let perData = JSON.parse(sessionStorage.getItem('personPermissions_list'));
            if(perData){
                let userId = JSON.parse(sessionStorage.getItem('user_id'));
                if(userId) this.update(userId,perData);
                sessionStorage.removeItem('personPermissions_list');
            }
            sessionStorage.removeItem('user_id');
            this.init();
        },
        methods: {
            async init(done){
                let url = `employees?token=${api.token}&company_id=${this.company_id}&page=${this.page}&size=${this.size}`;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    console.log("没有人员信息");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;

                    if(res[0].totals > this.persons.length){
                        this.persons.length == 0 ? this.persons = res : this.persons = this.persons.concat(res);
                        if(done) done();
                        res[0].totals > this.persons.length ? this.infiniteCount = false : this.infiniteCount = true;
                    }
                    return;
                }else{
                    console.log(res.data.errmsg);                         //服务器返回的错误信息
                }
                this.infiniteCount = true;
            },
            async currentPermission(id){
                let url = `usermenus/${id}?token=${api.token}&company_id=${this.company_id}`;
                let res = await api.get(url);
                let arr = [];                                   //存储当前当前人所有的权限
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    console.log("没有权限信息");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    for(let val of res){
                        if(val.company_id === this.company_id){
                            arr.push(val);
                        }
                    }
                }else{
                    console.log(res.data.errmsg);                         //服务器返回的错误信息
                }
                return arr;
            },
            onRefresh(done){                                                     // 刷新
                this.page = 1;
                this.persons = [];
                this.init();
                done();
            },
            onInfinite(done){                                                //加载
                if(this.infiniteCount){
                    done();
                }else{
                    this.page = this.page+1;
                    this.init(done);
                }
            },
            async update(id, allow = [], deny = []){
                let url = `usermenus/${id}?token=${api.token}&company_id=${this.company_id}&bizid=${utrl.setbizid()}`;
                console.log(allow);
                let param = {"allow": allow, "deny": deny};
                let res = await api.put(url,param);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    console.log("没有权限信息");
                }else if(res.status >= 200 && res.status < 300){
                    $toast.show("分配成功，可在人员权限中查看",1000);
                }else{
                    console.log(res.data.errmsg);                         //服务器返回的错误信息
                }
            },
            routerGo(item){
                sessionStorage.setItem('user_id',JSON.stringify(item.user_id));
                this.currentPermission(item.user_id).then(res => {
                    console.log(item.user_id);
                    console.log(res);
                    this.$router.push({
                        name:'SettingPersonPermissions',
                        params:{
                            permissions:res
                        }
                    })
                });
            },
        }
    }
</script>
<style></style>
<style lang="less" scoped>
    @import url("../../../../establish/commoncss/common.css");
    @import url("../css/company.css");
    .reference{
        padding:0 .75rem;
        justify-content: flex-start;
        .name{
            margin-left:unset;
        }
        /*.lastFont{*/
            /*color:#fff;*/
            /*text-align: center;*/
            /*line-height: 2;*/
            /*vertical-align: middle;*/
            /*background-color:#f39800;*/
        /*}*/
        .img{
            min-height: unset;
        }
        .fuhao{
            right:.75rem;
        }
    }
</style>
