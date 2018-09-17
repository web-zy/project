<template>
    <div>
        <von-header class="header">
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon" slot="right">
                <ChoiceCompany @give-company="setCompony"></ChoiceCompany>
            </div>
        </von-header>
        <scroll style="top:-0.1rem;background-color:#eeeeee;">
            <div class="center">

                <div class="info" v-for="item in data" v-if="item.account_code == 1002 || item.account_code == 2202 || item.account_code == 1405 || item.account_code == 1122">
                    <label v-if="item.account_code != 1002">{{item.account_name}}</label>
                    <label v-else>账户余额</label>
                    <span>{{item.account_balance_amt | formatNum}}</span>
                </div>
                <div class="a" @click="addAccount">更多</div>
            </div>
        </scroll>
    </div>
</template>

<script>
import api from "../../asset/api.js";
import utrl from '../../controller/utrl.js';
export default {
    data () {
        return {
            msg: '账表',
            // 公司名称
            data:[],
            index:"",
            company_id:"",
            isgetcommpy:false,
            isbackground:false,
            name:""
        }
    },
    filters:{
        formatNum:function(val){
            val=String(val);
            return utrl.formatNum(val);
        }
    },
    methods:{
        // 选择公司
        setCompony(obj){
            this.name = obj.company_name;
            this.company_id = obj.company_id;

            this.getAccount(obj.company_id);
        },
        async getAccount(id){
            let url = "glzzs?token=" + api.token + "&company_id=" + id + "&size=31";
            let res = await api.get(url);
            if(res.status != 200){
                this.data = [
                    {
                        account_code:1002,
                        account_name: '账户余额',
                        account_balance_amt: 0
                    },
                    {
                        account_code:2202,
                        account_name: '库存商品',
                        account_balance_amt: 0
                    },
                    {
                        account_code:1405,
                        account_name: '应付账款',
                        account_balance_amt: 0
                    },
                    {
                        account_code:1122,
                        account_name: '应收账款',
                        account_balance_amt: 0
                    }
                ]
            }else{
                this.data = res.data;
            }
        },
        addAccount(){
            this.$router.push({name:"Auxiliary",params:{name:this.name,company_id:this.company_id}})
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
.info:last-child{
    box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
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
.a{
    width: 100%;
    height: 2rem;
    text-align:center;
    background-color:#fff;
    margin-top:0.5rem;
    line-height:2rem;
    font-size:0.8rem;
    box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
}
</style>
