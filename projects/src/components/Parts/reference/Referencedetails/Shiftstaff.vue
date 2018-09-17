<template>
    <div id="content">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div>
            <scroll class="page-content padding-top" :on-infinite="onInfinite">
                <ul class="msg-list">
                    <li class="msg-item" v-for="(item,k) in persons" :key="k" @click="selectCharges(k)">
                        <i :class="item.isTrue === false ? 'ion-ios-circle-outline' : 'ion-checkmark-circled'"></i>
                        <!--<img class="img" :src="headUrl + item.head_img_url_medium" alt="">-->
                        <span class="uname">{{item.DisplayName}}</span>
                    </li>
                </ul>
                <div v-if="infiniteCount"
                     slot="infinite" class="text-center">没有人员信息~</div>
            </scroll>
        </div>
        <div class="btnsub">
            <button @click="confirm">确定</button>
        </div>
    </div>
</template>
<script>
    import api from '../../../../asset/api.js';
    import Vue from 'vue';
	 import utrl from '../../../../controller/utrl.js';
    export default {
        // props:['id','name','user_id'],
        data() {
            return {
                msg:"",
                headUrl:api.headUrl,
                company_msg:null,                                               //公司信息
                company_id:"",                                                  //公司ID
                persons:[],                                                      //该公司下所有人员
                infiniteCount:false,
                menuButtonText:""
            }
        },
        mounted(){
            this.id = this.$route.params.id;
            this.msg = this.$route.params.name;
            this.user_id = this.$route.params.user_id;
            let company_msg = utrl.getCompany()
			this.company_msg = company_msg;
            this.menuButtonText = company_msg.company_name;
            this.company_id = company_msg.company_id;

            // this.msg = this.name;
            this.init();
        },
        // activated(){
        //     this.init();
        // },
        methods: {
            async init(){
                let company_id = this.company_id;
               // let url = `employees?token=${api.token}&company_id=${company_id}`;
               let url = "kqschedulesets/staff?token="+api.token+"&company_id="+company_id
                let res = await api.get(url)
                if(res.status === 204 || res.status === 504){
                    console.log("没有人员信息");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;

                    let ce_us = this.user_id.split(",");
                    console.log(ce_us);
                    for(let i = 0; i < res.length; i++){
                        for(let j = 0; j < ce_us.length; j++){
                            if(res[i].user_id == ce_us[j]){
                                Vue.set(res[i],'isTrue',true);
                            }else if(res[i].isTrue !== true){
                                Vue.set(res[i],'isTrue',false);
                            }
                        }
                    }
                    this.persons = res;
                    console.log(res);
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
            selectCharges(k){
                let persons = this.persons;
                if(this.id == 1) {
                    for(let i = 0; i < persons.length; i++){
                        if(i !== k && persons[i].isTrue === true) Vue.set(persons[i],'isTrue',false);
                    }
                }
                persons[k].isTrue = !persons[k].isTrue;
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
                window.sessionStorage.setItem("selectPerson",o);
                localStorage.setItem("selectPerson",o)
                this.$router.go(-1);
            },
        }
    }
</script>
<style lang="less" scoped>
    @import url("../../../establish/commoncss/common.css");
    /*@import url("../../../Index/Mines/companyMessage/css/company.css");*/
    body {
        background: unset;
        background-color:unset;
    }
    .msg-list{
        margin-top:2.5rem;
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
            .img{
                width:1.3rem;
                height:1.3rem;
                margin:0 .5rem;
                border-radius: 50%;
            }
        }
    }
    .uname{
    	margin-left:0.35rem;
    }
</style>
