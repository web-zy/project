<template>
    <div class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon company" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div class="choose-charges-container">
            <scroll class="page-content padding-top" :on-infinite="onInfinite">
                <div  class="reference" v-for="(v,k) in personOptions" @click="confirm(k)">
                    <p>{{v.user_name}}</p>
                    <!--<p class="fuhao">-->
                        <!--<i style="font-size:1rem"-->
                            <!--:class="['ion-ios-checkmark',k === personId ? 'assertive' : 'grey']"></i>-->
                    <!--</p>-->
                </div>
                <div v-if="infiniteCount"
                     slot="infinite" class="text-center">没有更多数据~</div>
            </scroll>
        </div>
    </div>
</template>
<script>
    import api from '../../asset/api.js';

    export default {
        data() {
            return {
                msg:"选择主管",
                company_msg:null,                                               //公司信息
                company_id:"",                                                  //公司ID
                //persons:[],                                                      //该公司下所有人员
                infiniteCount:false,
                personOptions: [],
                menuButtonText:"",
            }
        },
        mounted(){
            let company_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
            if(company_msg !== undefined && company_msg !== null){
                this.company_msg = company_msg;
                this.menuButtonText = company_msg.company_name;
                this.company_id = company_msg.company_id;
            }
            this.init();
        },
        methods: {
            async init(){
                let company_id = this.company_id;
                let url = `employees?token=${api.token}&company_id=${company_id}`;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    console.log("没有人员信息");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    this.personOptions = res;
                }else{
                    console.log(res.data.errmsg);                         //服务器返回的错误信息
                }

                this.infiniteCount = true;
            },
            onInfinite(done){
                if(this.infiniteCount){
                    done();
                    return;
                }
            },
            confirm(i){
                //console.log(this.personOptions[i]);
                //let obj = { name : this.personOptions[i].user_name, id : this.personOptions[i].id };
                let o = JSON.stringify(this.personOptions[i]);
                window.sessionStorage.setItem("radioselect",o);
                this.$router.go(-1);
            },
        }
    }
</script>
<style lang="less" scoped>
    @import url("../establish/commoncss/common.css");
    @import url("../Index/Mines/companyMessage/css/company.less");
    .outOf{
        width:100vw;
        height:100vh;
        >.choose-charges-container .page-content{
            top:2.5rem;
            .list-ios > .item{
                padding-left:1rem;
            }
        }
    }
    /*.ion-ios-checkmark.grey{*/
        /*color:#bbb;*/
    /*}*/
    .reference p{
        margin-left: .5rem;
    }
    /*.reference .fuhao{*/
        /*right:0.5rem;*/
    /*}*/
</style>