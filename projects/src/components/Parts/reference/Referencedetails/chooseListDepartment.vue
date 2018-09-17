<template>
    <div id="content" class="department">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companyName}}</div>
        </von-header>
        <scroll class="top-2d5r" :on-refresh="onRefresh" :on-infinite="onInfinite">
            <ul class="list-wrap">
                <li class="list-item" v-for="(v, k) in arr" :key="k" @click="confirm(v)">
                    <i :class="v.isTrue ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                    <span class="txt">{{v.OUFullName}}</span>
                </li>
            </ul>
            <div v-if="infiniteCount"
                 slot="infinite" class="text-center">没有更多信息~</div>
        </scroll>
    </div>
</template>

<script>
    import api from '../../../../asset/api.js';
    import Vue from 'vue';
    export default {
        data(){
            return {
                msg:"选择部门",
                c_id:"",                                //公司id
                OUID:"",
                page:1,
                arr:"",                                 //部门
                companyName:"",
                infiniteCount:false
            }
        },
        mounted() {
            let c_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
            console.log(c_msg);
            if(c_msg){
                this.c_id = c_msg.company_id;
                this.OUID = c_msg.OUID;
                this.companyName = c_msg.company_name;
                this.init();
            }else{
                $toast.show("没有公司信息，请选择公司后进行操作！",1000);
            }
        },
        methods: {
            async init(done){
                let url = `departments/depts?token=${api.token}&page=${this.page}&size=20&company_id=${this.c_id}&filter=ParentOUID=${this.OUID}`;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    $toast.show("没有部门信息",500); // console.log("没有下级部门");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    let OUID = this.$route.params.OUID;
                    console.log(res);
                    for(let val of res){
                        val.OUID === OUID ? Vue.set(val,'isTrue',true) : Vue.set(val,'isTrue',false);
                    }
                    if(res[0].totals > this.arr.length){
                        this.arr.length == 0 ? this.arr = res : this.arr = this.arr.concat(res);
                        if(done) done();
                        res[0].totals > this.arr.length ? this.infiniteCount = false : this.infiniteCount = true;
                    }
                    return;
                }else{
                    $toast.show(res.data.errmsg);                         //服务器返回的错误信息
                }
                this.infiniteCount = true;
            },
            onRefresh(done){                                  //刷新
                this.page = 1;
                this.arr = [];
                this.init();
                done();
            },
            onInfinite(done){                             //加载
                if(this.infiniteCount){
                    done();
                }else{
                    this.page = this.page+1;
                    this.init(done);
                }
            },
            confirm(v){
                for(let val of this.arr){
                    Vue.set(val,'isTrue',false);
                }
                Vue.set(v,'isTrue',!v.isTrue);
                let obj = null;
                v.isTrue ? obj = { OUID:v.OUID, OUFullName:v.OUFullName } : obj;
                window.sessionStorage.setItem("department",JSON.stringify(obj));
                this.$router.go(-1);
            }
        },
    }
</script>

<style lang="less" scoped>
    @import url("../../../establish/commoncss/common.css");
    @import url("../../../../components/Index/Mines/companyMessage/css/company.css");
    .department{
        width:100vw;
        height:100vh;
        background-color:#eee;
        overflow: hidden;
        color:#333;
        .list-wrap{
            background-color: #ffffff;
            .list-item{
                display: flex;
                align-items: center;
                height:2.6rem;
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
                .txt{
                    margin-left:.5rem;
                }
            }
        }
    }
</style>