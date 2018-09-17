<template>
    <div id="content">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{companys}}</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <ul class="reference_top">
            <!--<li class="reference">-->
                <!--<p class="left">公司简称</p>-->
                <!--<input class="right" :value="companys" disabled="false" type="text">-->
            <!--</li>-->
            <!--<li class="reference">-->
                <!--<p class="left">创建人</p>-->
                <!--<input class="right" :value="createPerson" disabled="false" type="text">-->
            <!--</li>-->
            <li class="reference" @click="routerGo">
                <p class="left">功能权限</p>
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
            <li class="reference" @click="$router.push('AddPersonAndDepartment')">
                <p class="left">管理组织架构</p>
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
            <li class="reference" @click="modifyCompany">
                <p class="left">修改公司信息</p>
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
        </ul>
    </div>
</template>

<script>
import api from '../../../../asset/api.js';
export default {
    data () {
        return {
            // msg:'管理公司',
            companys:"",
            createPerson:"",
            createPersonId:"",
            company_id:null,
            manager:null
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        back: function() {
            $router.go(-1);
        },
        init(){
            let data = null;
            if(this.$route.params.data !== undefined){
                data = JSON.stringify(this.$route.params.data);
                console.log(data);
                this.companys = this.$route.params.data.company_name;
                this.createPerson = this.$route.params.data.owner_name;
                this.createPersonId = this.$route.params.data.owner_id;
                this.company_id = this.$route.params.data.company_id;
                window.sessionStorage.setItem('company_msg',data);
            }else{
                data = JSON.parse(window.sessionStorage.getItem('company_msg'));
                this.companys = data.company_name;
                this.createPerson = data.owner_name;
                this.createPersonId = data.owner_id;
                this.company_id = data.company_id;
            }
            this.getManager();
        },
        async getManager(){
            let res = await api.get(`authgroupusers?token=${api.token}&company_id=${this.company_id}&page=1&size=1&&filter=name=管理员`);
            if(res.status >= 200 && res.status <= 300) {
                if(res.data !== "") this.manager = res.data[0].user_name;
            }
        },
        routerGo(){
            if((api.userInfo.id == this.createPersonId) || (api.userInfo.name == this.manager)) $router.push('Jurisdiction/PermissionsBranch');
            else $toast.show("您不是管理员或创建人，没有此权限。",3000);
        },
        modifyCompany(){
            if((api.userInfo.id == this.createPersonId) || (api.userInfo.name == this.manager)) $router.push({name:'createCompany',params:{type:'修改公司信息'}});
            else $toast.show("您不是管理员或创建人，没有此权限。",3000);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import url("../../../establish/commoncss/common.css");
.reference_top{
    margin-top:2.75rem;
    .reference{
        margin-top:.5rem;
        /*box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;*/
    }
}
.reference .left{
    margin-left:.5rem;
}
.reference .right{
    margin-right:.5rem;
}
</style>
