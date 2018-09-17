<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <div class="reference_top scroll">
            <ul>
                <li class="reference" v-for="(v, k) in person" :key="k">
                    <p class="left">{{v.user_name}}</p>
                    <p class="fuhao">
                        <i class="right ion-trash-a" @click="remove(k)"></i>
                    </p>
                </li>
            </ul>
            <!--<touch :data="person" :edit="false" @call-remove="remove"></touch>-->
            <p class="addcost" @click="selectPerson"><i class="ion-ios-plus-outline"></i> 选择人员</p>
        </div>
    </div>
</template>

<script>
    import api from '../../../../../asset/api.js';
    import utrl from '../../../../../controller/utrl.js';

    export default {
        data() {
            return {
                msg:'',
                companys:'',
                c_id:null,
                person:[],
                permission:{}
            }
        },
        mounted(){
            let data = JSON.parse(sessionStorage.getItem('company_msg'));
            this.permission = JSON.parse(sessionStorage.getItem('permissionGroup'));
            this.companys = data.company_name;
            this.c_id = data.company_id;
            this.msg = this.permission.name;

            let person = JSON.parse(sessionStorage.getItem('selectPerson'));
            console.log(person);
            if(person !== null){
                let arr = [];
                for(let val of person){
                    arr.push(val.user_id);
                }
                this.personFunc(arr);
                sessionStorage.removeItem('selectPerson');
            }else{
                this.init();
            }
        },
        methods:{
            async init(){
                let auth_id = JSON.parse(sessionStorage.getItem('permissionGroup'));
                let url = `authgroupusers/${auth_id.id}?token=${api.token}&company_id=${this.c_id}&page=1&size=20`;
                let res = await api.get(url);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("没有人员信息",3000);
                }else if(res.status >= 200 && res.status < 300){
                    this.person = res.data;
                }else{
                    $toast.show(res.data.errmsg, 3000);                         //服务器返回的错误信息
                }
            },
            async personFunc(param){
                console.log(param);
                let url = `authgroupusers/${this.permission.id}?token=${api.token}&company_id=${this.c_id}&bizid=${utrl.setbizid()}`;
                let res = await api.put(url,param);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("添加人员失败",3000);
                }else if(res.status >= 200 && res.status < 300){
                    this.init();
                    $toast.show("添加人员成功",3000);
                }else{
                    $toast.show(res.data.errmsg, 3000);                         //服务器返回的错误信息
                }
            },
            selectPerson(){
                let msg = `选择${this.msg}`;
                let checked = [];
                if(this.person.length === 0){
                    checked.push("");
                }else{
                    for(let val of this.person){
                        checked.push(val.user_id);
                    }
                }
                this.$router.push({
                    path:'/ChooseCharges',
                    name:'chooseCharges',
                    params:{
                        id:2,
                        name:msg,
                        user_id:checked
                    }
                })
            },
            async remove(i){
                this.person.splice(i,1);
                let arr = [];
                for(let val of this.person){
                    arr.push(val.user_id);
                }
                let url = `authgroupusers/${this.permission.id}?token=${api.token}&company_id=${this.c_id}&bizid=${utrl.setbizid()}`;
                let res = await api.put(url,arr);
                if(res.status === 204 || res.status === 504){
                    $toast.show("删除人员失败",3000);
                    this.init();
                }else if(res.status >= 200 && res.status < 300){
                    $toast.show("删除人员成功",3000);
                }else{
                    this.init();
                    $toast.show(res.data.errmsg, 3000);                         //服务器返回的错误信息
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    //@import url("../../../../establish/commoncss/common.css");
    .reference_top.scroll{
        overflow-y: auto;
        height: 100vh;
    }
    .reference .left{
        margin-left:.75rem;
    }
    .reference .right{
        font-size:1rem;
    }
</style>
