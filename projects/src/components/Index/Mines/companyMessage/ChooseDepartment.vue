<template>
    <div id="content" class="department">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div class="tab-wrap">
            <div class="swiper-container chooseDepartment">
                <div class="swiper-wrapper">
                    <div class="swiper-slide list-item" v-for="(v, k) in urlStack">
                        <a :class="['btn tab',k+1 === urlStack.length ? 'grey':'']"
                            @click="depart_go_func(v.OUID,v.OUName,k)">{{v.OUName}}</a>
                        <i class="ion-chevron-right" v-show="k+1 !== urlStack.length"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <ul>
                <li class="list-item real" v-for="(v, k) in department">
                    <span class="btn cho" @click="confirm(v)">
                        <span >{{v.OUName}}</span>
                    </span>
                    <a class="btn next" @click="depart_go_func(v.OUID,v.OUName)">
                        <i class="ion-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import api from '../../../../asset/api.js';
    import Swiper from 'swiper';

    export default {
        data(){
            return {
                msg:"选择部门",
                c_msg:"",                               //公司信息
                c_id:"",                                //公司id
                c_OUID:"",                                 //公司OUID（部门id）
                department:"",                          //部门
                urlStack:null,
                menuButtonText:"",
            }
        },
        mounted() {
            let c_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));

            if(c_msg !== undefined && c_msg !== null){
                this.c_msg = c_msg;
                this.menuButtonText = c_msg.company_name;
                this.c_id = c_msg.company_id;
                this.c_OUID = c_msg.OUID;
            }

            let mySwiper = new Swiper('.swiper-container.chooseDepartment', {
                freeMode : true,
                slidesPerView : 'auto',
                observer:true
            });

            this.urlStack = [{OUName:this.c_msg.company_name, OUID:this.c_msg.OUID}];
            this.depart_go_func(this.c_OUID);
        },
        methods: {
            async depart_go_func(OUID,OUName,i){
                let c_id = this.c_id;
                let c_OUID = this.c_OUID;
                let url = `departments?token=${api.token}&page=1&size=20&company_id=${c_id}${ OUID === c_OUID ? "&filter=ParentOUID=" + c_OUID : "&filter=ParentOUID=" + OUID}`;
                //&filter=ParentOUID=1053;
                let res = await api.get(url);

                if(res.status === 204 || res.status === 504){
                    $toast.show("没有下级部门",500); // console.log("没有下级部门");
                }else if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    this.department = res;
                    console.log(res);
                    let arr = this.urlStack;
                    console.log(res[0].ParentOUID , OUID);
                    if(OUID !== c_OUID){
                        if(arr.length !== i+1) {
                            this.urlStack.push({OUName:OUName,OUID:OUID});
                            if(i !== undefined)
                                arr.splice(i+1,arr.length);
                        }
                    }else{
                        arr.splice(1,arr.length);
                    }
                }else{
                    $toast.show(res.data.errmsg);                         //服务器返回的错误信息
                }
            },
            confirm(v){
                let obj = { id:v.id, OUName:v.OUName, attribute_name:v.attribute_name };
                let o = JSON.stringify(obj);
                window.sessionStorage.setItem("department",o);
                this.$router.go(-1);
            }
        },
    }
</script>

<style lang="less" scoped>
@import url("../../../establish/commoncss/common.css");
@import url("./css/swiper.min.css");
.department{
    width:100vw;
    height:100vh;
    background-color:#eee;
    overflow: hidden;
    color:#333;
    .tab-wrap{
        position:fixed;
        top:2.5rem;
        left:0;
        width:100%;
        .chooseDepartment{
            background-color:#fff;
            .btn.grey{
                color:#333;
                font-size:.75rem;
            }
        }
    }
    .container{
        margin-top: 5.25rem;
        height:100%;
        overflow-y: auto;
    }
    .list-item{
        &.real{
            display:flex;
            justify-content: space-between;
            .btn.cho{
                flex:1;
            }
        }
        &.swiper-slide{
            border:none;
        }
        border-bottom:1px solid #eee;
        width:auto;
        background-color:#fff;
        font-size:0;
        .ion-chevron-right{
            display:inline-block;
            color:#bbb;
            font-size: 0.75rem;
        }
        .btn{
            display:inline-block;
            padding:.8rem .5rem;
            font-size: 0.8rem;
        }
        .next{
            padding-left:1.5rem;
            text-align:right;
        }
    }
}
</style>