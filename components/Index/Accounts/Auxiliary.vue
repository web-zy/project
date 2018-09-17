<template>
    <div>
        <von-header class="header">
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon company" style="" slot="right">{{name}}</div>
        </von-header>
        <scroll style="top:-0.1rem;background-color:#eeeeee;">
            <div class="center">
                <div class="info" v-for="(item,index) in items">
                    <label>{{item.account_name}}</label>
                    <span>{{item.account_balance_amt | formatNum}}</span>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
import api from "../../../asset/api.js";
import utrl from '../../../controller/utrl.js';
export default {
    data () {
        return {
            msg: '账表',
            name:"",
            items:[],
            company_id:""

        }
    },
    mounted(){
        this.name=this.$route.params.name;
        this.company_id=this.$route.params.company_id;
        this.getAccount();
    },
    /*activated(){
        this.$destroy()
    },*/
    // 过滤金额
    filters:{
        formatNum:function(val){
            val=String(val)
            return utrl.formatNum(val)
        }
    },
    methods:{
        back: function() {
            $router.go(-1)
            this.$destroy()
        },
        async getAccount(){
            let url = "glzzs?token=" + api.token + "&company_id=" + this.company_id + "&size=999";
            let res = await api.get(url)
            if(res.status != 200){
                this.items = [{
                    account_name: '目前公司没有数据',
                    account_balance_amt: ""
                }]
            }else{
                this.items = res.data;
            }

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header{
    .company{
        display: block!important;
        width:5.5rem;
        height:100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        line-height:40px;
        text-align:right;
    }
}
.center{
    margin-top:0.4rem;
    padding-top: 2.5rem;
    box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
    .info{
        height: 3.5rem;
        line-height:3.5rem;
        background-color: #fff;
        border-bottom: 1px solid #eeeeee;
        margin-top: 0.01rem;
        padding: 0 0.5rem;
        label{
            display: block;
            float: left;
            line-height: 3.5rem;
            font-size: 0.7rem;
        }
        span{
            font-size: 1.2rem;
            text-align: right;
            float: right;
        }
    }
}
.posback {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    top: 0;
    left: 0;
    z-index: 33;
}
</style>
