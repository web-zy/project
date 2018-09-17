<template>
    <div id="content">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
            <span slot="title">{{title}}</span>
            <div class="button button-icon" slot="right"></div>
        </von-header>

        <!--<search v-model="keywords" placeholder="请输入姓名搜索" cancelText="取消"></search>-->
        <div class="container">
            <div class="search_wrap">
                <i class="icon ion-ios-search img"></i>
                <input @keydown="search" v-model="keywords" @keyup="keyUpFunc" class="inp" type="search" placeholder="请输入姓名搜索">
                <i v-show="keywords" class="close icon ion-ios-close" @click="closeSeo"></i>
            </div>
            <div class="contents">
                <scroll class="page-content padding-top" :on-infinite="onInfinite">
                    <div v-show="isDshow" class="tab-wrap">
                        <div class="swiper-container chooseDepartment">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide list-itemss" v-for="(v, k) in urlStack" :key="k">
                                    <a :class="['btn tab',k+1 === urlStack.length ? 'grey':'']"
                                       @click="depart_go_func(v.OUID,v.OUName,v.id,v.attribute_name,v.charges,k)">{{v.OUName}}</a>
                                    <i class="ion-chevron-right" v-show="k+1 !== urlStack.length"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul v-show="isDshow">
                        <li class="list-itemss real" v-for="(v, k) in department" v-show="v.isShow" :key="k">
                            <span class="btn cho" @click="depart_go_func(v.OUID,v.OUName,v.id,v.attribute_name,v.details)">
                                <span><i class="branch-icon icon-Jurisdiction"></i> {{v.OUName}}</span>
                                <i class="ion-chevron-right"></i>
                            </span>
                        </li>
                    </ul>
                    <div v-show="isShow" class="persons">
                        <div v-for="(v,k) in person" :class="['person',v.isTouch === true?'mark':'']"
                             :key="v.id" @touchstart="touchstart(k)" @touchend="touchend(k)">
                            <head-portrait class="head" :userInfo="v" :size="'small'"></head-portrait>
                            <!--<img :src="domain + 'files/' + v.head_image_id-->
                                 <!--+ '/thumbnail/66?token=' + token + '&company_id=' + c_id" class="head" v-if="v.head_image_id">-->
                            <!--<span class="head" v-else>{{v.DisplayName | interception}}</span>-->
                            <span class="name">{{v.user_name ? v.user_name : v.DisplayName}}</span>
                            <span class="phone">{{v.user_account ? v.user_account : v.UserAccount}}</span>
                            <!--<span class="icon-editor ion-android-create"></span>-->
                            <div :class="['ol-popup',v.isShow === true?'show':'']">
                                <div class="ol-popup-closer" @click="remove(v.UserAccount,k)">删除</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="infiniteCount"
                         slot="infinite" class="text-center">没有更多人员信息~</div>
                </scroll>
            </div>
            <div class="footer">
                <div class="btn" @click="addPerson">添加员工</div>
                <div class="btn" @click="setDepartment(1)">
                    <!--<i class="inline"></i>-->
                    添加部门
                </div>
                <div class="btn" v-show="isDepart" @click="setDepartment(2)">
                    <!--<i class="inline"></i>-->
                    修改部门
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../../asset/api.js';
import Swiper from 'swiper';
import Vue from 'vue';
import utrl from '../../../../controller/utrl.js'

var timeOutEvent = null;                                                       //定时器

export default {
    data () {
        return {
            title:'组织架构',
            // 公司简称
            domain:api.domain,
            depart_msg:null,                                                    //部门Id
            person:[],                                                  //公司下所有人员
            keywords:"",
            index:1,                                                    //当前第几页
            pageSize:10,                                                //每页显示数量
            infiniteCount:false,
            isShow:true,
            isDshow:true,                                               //部门显示与否
            c_msg:"",                                                   //公司信息
            c_id:"",                                                    //公司id
            c_OUID:"",                                                  //公司OUID（部门id）
            department:"",                                              //部门
            urlStack:null,
            isEnd:false,
            isDepart:false,                                             //显示部门设置与否
            token:api.token
        }
    },
    filters:{
        interception(val){
            if(val) return val.substr(-1);
        }
    },
    mounted(){
        let c_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));

        if(c_msg !== undefined && c_msg !== null){
            this.init(c_msg);
        }

        let mySwiper = new Swiper('.swiper-container.chooseDepartment', {
            freeMode : true,
            slidesPerView : 'auto',
            observer:true
        });
        window.document.addEventListener('click',() => {
           let person = this.person;
           for(let i = 0; i < person.length; i++){
               Vue.set(person[i],'isTouch',false);
               Vue.set(person[i],'isShow',false);
           }
        });
    },
    activated(){
        // console.log(api.domain);
        let c_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
        if(this.c_id !== c_msg.company_id){
            this.init(c_msg);
        }else{
            let d = this.depart_msg;
            if(d !== null)
                this.depart_go_func(d.OUID,d.OUName,d.id,d.attribute_name,d.charges,false); //false阻止urlStack再次push
        }
    },
    methods:{
        init(c_msg){
            this.c_msg = c_msg;
            this.c_id = c_msg.company_id;
            this.c_OUID = c_msg.OUID;
            this.urlStack = [{OUName:c_msg.company_name, OUID:c_msg.OUID}];
            this.depart_go_func(c_msg.OUID);
        },
        search(e){
            let d = this.depart_msg;
            clearTimeout(timeOutEvent);
            if(e.key === "Enter"){
                this.load_totpersn_func(d.OUID);
            }
        },
        closeSeo(){
            this.keywords = '';
            let d = this.depart_msg;
            this.depart_go_func(d.OUID,d.OUName,d.id,d.attribute_name,d.charges,false);
        },
        keyUpFunc(){
            clearTimeout(timeOutEvent);
            timeOutEvent = setTimeout(() => {
                let d = this.depart_msg;
                this.keywords === '' ?
                    this.depart_go_func(d.OUID,d.OUName,d.id,d.attribute_name,d.charges,false) :
                    this.load_totpersn_func(d.OUID);
            },1000);
        },
        back(){
            this.$router.go(-1);
        },
        async load_totpersn_func(OUID = this.c_msg.OUID){                                 //加载所有人员
            this.isShow = false;
            this.isDshow = false;
            let url = "";
            let filter = "";
            let name = "";
            let c_id = "";

            if(this.keywords === ""){
                c_id = "";
                name = "oumembers/members";
                filter = `&company_id=${this.c_id}&filter=OUID=${OUID}`;
            }else {
                c_id = `&company_id=${this.c_id}`;
                name = "oumembers/deptmembers";
                filter = `&OUID=${OUID}&user_name=${this.keywords}`;
            }
            url = `${name}?token=${api.token}${c_id}&page=1&size=100${filter}`;

            let res = await api.get(url);

            if(res.status === 204 || res.status === 504){
                console.log("没有人员信息");
                this.isShow = false;
            }else if(res.status >= 200 && res.status < 300){
                res = res.data;
                for(let i = 0; i < res.length; i++){
                    Vue.set(res[i],'isTouch',false);
                    Vue.set(res[i],'isShow',false);
                    Vue.set(res[i],'user_name',res[i].DisplayName);
                }
                this.person = res;
                console.log(res);
                this.isShow = true;
                this.isDshow = true;
                // let person = JSON.stringify(res);
                // window.sessionStorage.setItem("total_person",person);
            }else{
                $toast.show(res.data.errmsg);                         //服务器返回的错误信息
            }
            this.keywords !== "" ? this.isDshow = false : this.isDshow = true;
            this.infiniteCount = true;
        },
        // getDepartOUID(OUID){
        //     this.depart_msg = OUID;
        //     this.load_totpersn_func(OUID.OUID);                          //加载所有人员
        //     console.log(this.person);
        // },
        onInfinite(done){
            done();
        },
        async depart_go_func(OUID,OUName,id,attribute,charges,i){
            let c_id = this.c_id;
            let c_OUID = this.c_OUID;
            let url = `departments?token=${api.token}&page=1&size=30&company_id=${c_id}${ OUID === c_OUID ? "&filter=ParentOUID=" + c_OUID : "&filter=ParentOUID=" + OUID}`;
            //let url = `departments?token=${api.token}&company_id=${c_id}&filter=OUName%${this.keywords}`;
            //&filter=ParentOUID=1053;
            let res = await api.get(url);

            if(res.status === 204 || res.status === 504){
                //$toast.show("没有下级部门",1000);
                res = this.department;
                for(let i = 0; i < res.length; i++){
                    Vue.set(res[i],"isShow",false);
                }
                let j = this.urlStack.length;
                console.log(i,j);
                if(i !== false) this.urlChange(OUID,c_OUID,OUName,attribute,charges,i,j);
            }else if(res.status >= 200 && res.status < 300){
                res = res.data;
                for(let i = 0; i < res.length; i++){
                    Vue.set(res[i],"isShow",true);
                }
                this.department = res;
                this.isEnd = false;
                console.log(res);
                //console.log(window.sessionStorage.getItem('url_item'));
                if(window.sessionStorage.getItem('url_item') !== null){
                    let item = JSON.parse(window.sessionStorage.getItem('url_item'));
                    let stack = this.urlStack;
                    for(let i = 0; i < stack.length; i++){
                        if(item.OUID === stack[i].OUID){
                            Vue.set(stack[i],'OUName',item.OUName);
                        }
                    }
                    window.sessionStorage.removeItem('url_item');
                }
                console.log(window.sessionStorage.getItem('url_item'));
                if(i !== false) this.urlChange(OUID,c_OUID,OUName,attribute,charges,i);
            }else{
                $toast.show(res.data.errmsg);                            //服务器返回的错误信息
                return;
            }
            this.OUID = OUID;
            OUID === c_OUID ? this.isDepart = false : this.isDepart = true;
            id === undefined ? id = this.c_msg.id : id;
            OUName === undefined ? OUName = this.c_msg.company_name : OUName;
            this.depart_msg = { OUID : OUID, OUName : OUName , id : id, attribute_name:attribute, charges:charges}; //给添加人员设置默认部门
            console.log(this.depart_msg);
            this.load_totpersn_func(OUID);                          //加载所有人员
            // console.log(this.isDepart);
        },
        urlChange(OUID,c_OUID,OUName,attribute,charges,i,j){
            let arr = this.urlStack;
            // console.log(res[0].ParentOUID , OUID);
            if(OUID !== c_OUID){
                if(arr.length !== i+1) {
                    if(!this.isEnd){
                        this.urlStack.push({OUName:OUName,OUID:OUID,attribute_name:attribute,charges:charges});
                        if(i !== undefined) arr.splice(i+1,arr.length);
                        j !== undefined ? this.isEnd = true : this.isEnd = false;
                    }
                }
            }else{
                arr.splice(1,arr.length);
            }
        },
        addPerson(){
            $router.push({
                name:'addPerson',
                params:{
                    dep_msg:this.depart_msg
                }
            });
        },
        setDepartment(i){
            console.log(this.depart_msg);
            $router.push({
                name:'addDepartment',
                params:{
                    dep_msg:this.depart_msg,
                    index:i
                }
            });
        },
        touchstart(k){
            for(let val of this.person){
                Vue.set(val, 'isShow', false);
                Vue.set(val, 'isTouch', false);
            }
            Vue.set(this.person[k],'isTouch',true);
            timeOutEvent = setTimeout(() =>{
                Vue.set(this.person[k],'isShow',true);
            },500);
        },
        touchend(k){
            window.clearTimeout(timeOutEvent);
            if(this.person[k].isShow === false) Vue.set(this.person[k],'isTouch',false);
            // Vue.set(this.person[k],'isTouch',false);
        },
        async remove(UserAccount,k){
            let bizid = utrl.setbizid();
            let url = `departments/${this.depart_msg.id}/users/${UserAccount}?token=${api.token}&bizid=${bizid}`;
            let res = await api.delete(url);
            if(res.status === 200){
                this.person.splice(k,1);
            }else{
                $toast.show(res.data.errmsg);
            }
        }
    },
}
</script>


<style lang="less" scoped>
    //@import url("../../../establish/commoncss/common.css");
#content .scroll{
    top: 4.95rem;
}
.container{
    display: flex;
    flex-direction:column;
    justify-content: flex-start;
    height:100vh;
    .search_wrap{
        /*position: fixed;如果降低index人员会遮盖住搜索框*/
        /*top:0;*/
        /*left:0;*/
        display: flex;
        justify-content: center;
        align-items: center;
        height:2.425rem;
        margin-top:2.5rem;
        width: 100%;
        z-index: 100;
        background-color:#fff;
        .img{
            position:absolute;
            left:1rem;
            font-size:1rem;
        }
        .inp{
            height: 1.375rem;
            line-height: 1.375rem;
            padding-left:1.5rem;
            width:100%;
            margin: 0 .5rem;
            border-radius: 20px;
            background-color:#eeeeee;
        }
        .close{
            position:absolute;
            right:1rem;
            font-size:1rem;
            color:#666;
        }
    }
    .contents{
        flex:1;
        .tab-wrap{
            height:2.2rem;
            line-height: 2.2rem;
            margin:.25rem 0;
            .chooseDepartment{
                background-color:#fff;
                .btn.grey{
                    color:#aaa;
                    font-size:.75rem
                }
            }
        }
    }
    .list-itemss{
        .btn.cho{
            display:flex;
            justify-content: space-between;
            align-items: center;
            font-size:.75rem;
            .ion-chevron-right{
                font-size:.75rem;
                color: #666;
            }
            .branch-icon{
                display: inline-block;
                margin-left: .25rem;
                font-weight: 100;
                font-size:.5rem;
                transform: translateY(-0.14rem);
                margin-right: .58rem;
                &.icon-Jurisdiction:before{
                    color:#eee;
                }
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
            padding:.6rem .5rem .6rem .9rem;
            font-size: 0.8rem;
            &.tab{
                padding:0 .5rem;
            }
        }
        .next{
            border-left:1px solid #eee;
        }
    }
    .persons{
        margin-top:.5rem;
        background-color:#fff;
        box-shadow: 0rem 0.03rem 0.05rem 0rem #cacaca;
        .person{
            display: flex;
            position:relative;
            align-items: center;
            width:100%;
            height:2.2rem;
            border-bottom:1px solid rgb(238,238,238);
            font-size: 0.75rem;
            &.mark{
                background-color:#fafafa;
            }
            .head{
                width:1.5rem;
                height:1.5rem;
                border-radius: 50%;
                margin-left:.5rem;
                color:#fff;
                text-align: center;
                vertical-align: middle;
                line-height: 2;
                background-color:#f39800;
            }
            .name{
                padding-left:.5rem;
                flex-grow:1;
                flex-shrink:0
            }
            .phone{
                margin-right:.5rem;
            }
            .icon-editor{
                font-size: 1.3rem;
                margin-right: .5rem;
                color:#ccc;
            }
            &:last-child{
                border:none;
            }
            .ol-popup {
                position: absolute;
                top:-2rem;
                left: 50%;
                z-index:10;
                display:none;
                width: 4rem;
                height: 2rem;
                margin-left:-2rem;
                border: 1px solid #cccccc;
                border-radius: 10px;
                background-color: #1B1C1D;
                &.show{
                    display:block;
                }
            }
            .ol-popup-closer{
                text-align: center;
                padding: .4rem;
                color:#fff;
                height:100%;
            }
            /*以下是尖角的实现*/
            .ol-popup:after, .ol-popup:before {
                top: 100%;
                border: solid transparent; /*边框颜色设置为透明*/
                content: " ";
                height: 0; /*高、宽都设置为0，边框的4条边就聚合到一起，组合成一个小正方形。*/
                width: 0; /*正方形按对角线分成4个小三角，分别对应4条边框*/
                position: absolute;
                pointer-events: none;/*不允许穿透层去点击下面的内容*/
            }
            .ol-popup:after {
                border-top-color: #1B1C1D;
                border-width: 10px;
                left: 50%;
                margin-left: -10px;
            }
            &:nth-child(1) .ol-popup{
                top:100%;
                &:after,&:before{
                    top:-50%;
                    transform: rotate(180deg);
                }
            }
        }
    }
    .footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align:center;
        height:2.5rem;
        font-size: 0.75rem;
        border-top: 0.05rem solid #dcdcdc;
        background-color: #f5f5f5;
        z-index: 10;
        .btn{
            color:#333;
            flex:1;
            height:100%;
            line-height: 2.5rem;
        }
    }
}
</style>

