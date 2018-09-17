<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <div class="header-title li">
            <a @click="accordion">{{isDisplay ? '收起' : '展开'}}</a>
            <span class="checkBtn" @click="selectAll">
                <span>全选</span>
                <i :class="isSelAll ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
            </span>
        </div>
        <scroll>
            <div v-for="(v, k) in authGroupMenus" :key="k">
                <div class="title li" @click="toggle(k)" v-if="v.menu_level === 1">
                    <span class="level-one">{{v.name}}</span>
                    <i @click.stop="selectMenuAll(k)" :class="(v.isHalf)? 'grey ion-checkmark-circled' : (v.isTrue)? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                </div>
                <!--<transition name="slide">-->
                <div :class="[v.isShow ? 'show' : 'hide']">
                    <div v-for="(z, i) in v.child" :key="i" class="li son">
                            <span class="level-two">
                                <i class="branch-icon icon-Jurisdiction"></i>
                                {{z.name}}
                            </span>
                        <i @click="selectItem(k,i)" :class="z.isTrue ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                    </div>
                </div>
                <!--</transition>-->
            </div>
        </scroll>
        <div class="btnsub">
            <button @click="confirm">确定</button>
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
                msg:'人员权限',
                companys:'',
                c_id:null,
                authGroupMenus:[],
                isSelAll:false,                                                  //是否全选
                isDisplay:false,
                totalAll:0,                                                      //总条数
                secTotal:0,                                                       //选中数
                secItem:0                                                        //二级分组选中数
            }
        },
        mounted() {
            let data = JSON.parse(sessionStorage.getItem('company_msg'));
            this.companys = data.company_name;
            this.c_id = data.company_id;
            console.log(this.$route.params.permissions);
            this.init();
        },
        methods:{
            async init(){
                $loading.show('加载中..');
                let url = `menus?token=${api.token}&page=1&size=1000`;
                let res = await api.get(url);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("没有数据",1000);
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    let parentArr = [];
                    let routerArr = this.$route.params.permissions || [];
                    // console.log(routerArr);
                    for(let val of res){
                        if(val.menu_level === 1) {
                            Vue.set(val,'child',[]);
                            val.id == 1001000 ? Vue.set(val,'isShow',true) : Vue.set(val,'isShow',false);
                            parentArr.push(val);
                        }
                        Vue.set(val,'isTrue',false);
                        for(let id of routerArr){
                            console.log(val.id);
                            if(val.id === id.id) Vue.set(val,'isTrue',true);
                        }
                        for(let _val of parentArr){
                            if(parseInt(val.pid) === parseInt(_val.id)){
                                _val.child.push(val);
                            }
                        }
                    }
                    this.setHalfState(parentArr);
                    this.totalAll = res.length; this.secTotal = routerArr.length;
                    if(res.length === routerArr.length) this.isSelAll = true;
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
                $loading.hide();
            },
            accordion(){
                let data = this.authGroupMenus;
                this.isDisplay = !this.isDisplay;
                for(let i = 0; i < data.length; i++){
                    Vue.set(data[i],'isShow',this.isDisplay);
                }
            },
            selectAll(){
                let data = this.authGroupMenus;
                this.isSelAll = ! this.isSelAll;

                for(let i = 0; i < data.length; i++){
                    Vue.set(data[i],'isTrue',this.isSelAll);
                    Vue.set(data[i],'isShow',this.isSelAll);                    //待定
                    if(!this.isSelAll) Vue.set(data[i],'isHalf',false);
                    let childs = data[i].child;
                    for(let j = 0; j < childs.length; j++){
                        Vue.set(childs[j],'isTrue',this.isSelAll);
                    }
                }
                this.isSelAll ? this.secTotal = this.totalAll : this.secTotal = 0;
            },
            toggle(k){
                this.authGroupMenus[k].isShow = !this.authGroupMenus[k].isShow;
            },
            selectMenuAll(k){                                                     //1级权限事件
                let menus = this.authGroupMenus;
                let len = menus[k].child.length + 1;
                if(menus[k].isHalf) menus[k].isHalf = false;
                if(!menus[k].isShow) menus[k].isShow = true;
                menus[k].isTrue = !menus[k].isTrue;
                console.log(len);
                for(let val of menus[k].child){
                    if(val.isTrue && menus[k].isTrue) {
                        len--;
                    }else if(!val.isTrue && !menus[k].isTrue){
                        len--;
                    }
                    Vue.set(val,'isTrue',menus[k].isTrue);
                }
                console.log(menus[k].isTrue);
                menus[k].isTrue ? this.secTotal += len : this.secTotal -= len;
                this.totalAll === this.secTotal ? this.isSelAll = true : this.isSelAll = false;
                console.log(this.totalAll, this.secTotal);
            },
            selectItem(k,j){                                                     //2级权限事件
                let menu = this.authGroupMenus[k];
                let child = menu.child;
                let arr = [];

                Vue.set(child[j],'isTrue',!child[j].isTrue);
                child[j].isTrue ? this.secTotal++ : this.secTotal--;

                for(let i = 0; i < child.length; i++){
                    if(child[i].isTrue) arr.push(child[i].isTrue);
                }

                if(arr.length === child.length){                                 //全选
                    Vue.set(menu,'isHalf',false);
                    console.log("全选");
                }else if (arr.length > 0 && arr.length < child.length){          //半选
                    if(!menu.isTrue) {
                        console.log(1);
                        this.secTotal++;
                    }
                    Vue.set(menu,'isTrue',true);
                    Vue.set(menu,'isHalf',true);
                    console.log("半选");
                }else{                                                          //一个不选
                    this.secTotal--;
                    Vue.set(menu,'isHalf',false);
                    Vue.set(menu,'isTrue',false);
                    console.log("全不选");
                }

                this.totalAll === this.secTotal ? this.isSelAll = true : this.isSelAll = false;
                console.log(this.totalAll, this.secTotal);
                // console.log(this.secTotal);
            },
            setHalfState(arr){
                for(let i = 0; i < arr.length; i++){
                    let child = arr[i].child;
                    let store = [];
                    for(let j = 0; j < child.length; j++){
                        if(child[j].isTrue) store.push(1);
                    }
                    if(store.length > 0 && store.length < child.length) Vue.set(arr[i],'isHalf',true);
                }
                this.authGroupMenus = arr;
            },
            confirm(){
                let menu = this.authGroupMenus;
                let exportArr = [];
                for(let i = 0; i < menu.length; i++){
                    if(menu[i].isTrue) exportArr.push(menu[i].id);
                    let child = menu[i].child;
                    for(let j = 0; j < child.length; j++){
                        if(child[j].isTrue) exportArr.push(child[j].id);
                    }
                }
                console.log(exportArr);
                sessionStorage.setItem('personPermissions_list',JSON.stringify(exportArr));
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
    //@import url("../../../../establish/commoncss/common.css");
    #content .scroll{
        top:4.75rem;
    }
    .header-title{
        position:fixed;
        top:2.5rem;
        z-index: 10;
        .checkBtn{
            display: flex;
            width:2.6rem;
            justify-content: space-between;
            align-items: center;
            >span{
                color:#333;
            }
        }
    }
    .title{
        margin:.25rem 0;
        .level-one{
            color:#333;
        }
    }
    .li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:2.27rem;
        padding:0 .75rem;
        width:100vw;
        font-size:.75rem;
        border-bottom: 1px solid #eee;
        background-color:#fff;
        .icon{
            margin-left:.4rem;
        }
        &.son{
            padding-left:1.5rem;
            .level-two{
                color:#777;
                .branch-icon{
                    display: inline-block;
                    font-weight:100;
                    font-size:.5rem;
                    margin-right:.2rem;
                    transform: translateY(-.16rem);
                    &.icon-Jurisdiction:before{
                        color:#ddd;
                    }
                }
            }
        }
    }
    .ion-checkmark-circled{
        font-size:1rem;
        color:#f2bf07;
        &.grey{
            color:#bbb;
        }
    }
    .ion-ios-circle-outline{
        font-size:1rem;
        color:#bbb;
    }
    /*.slide-enter-active, .slide-leave-active{*/
    /*transition: all 0.5s ease*/
    /*}*/

    /*.slide-enter, .slide-leave-active{*/
    /*opacity: 0;*/
    /*}*/
</style>