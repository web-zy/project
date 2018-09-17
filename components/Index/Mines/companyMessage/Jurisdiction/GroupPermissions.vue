<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <!--<ul class="reference_top">-->
            <!--<li class="reference" v-for="item in dataArray">-->
                <!--<p class="left">{{item.name}}</p>-->
                <!--<p class="fuhao"><i class="ion-chevron-right"></i></p>-->
            <!--</li>-->
        <!--</ul>-->
        <div class="reference_top">
            <touch :data="dataArray" :edit="true" @call-edit="editPopup" @call-remove="remove" @call-router="routerGo"></touch>
        </div>
        <p class="addcost" @click="addPopup"><i class="ion-ios-plus-outline"></i> 添加权限组</p>
        <transition name="fade">
            <div v-show="popshow" class="dimmer" @click.stop="hidePopup">
                <transition name="scale">
                    <div v-if="popshow" class="popup">
                        <h1 class="title" v-if="pattern">添加权限组</h1>
                        <h1 class="title" v-else>修改权限组</h1>
                        <input v-focus v-model="groupName" type="text" placeholder="请输入权限组名称">
                        <div class="buttons">
                            <div class="permissionBtn" @click="confirm" v-if="pattern">保存</div>
                            <div class="permissionBtn" @click="update" v-else>保存</div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
    import api from '../../../../../asset/api.js';
    import utrl from '../../../../../controller/utrl.js';
    export default {
        data () {
            return {
                msg:'权限组',
                companys:'',
                index:1,
                pageSize:20,
                c_id:null,
                infiniteCount:false,
                popshow:false,
                bizid:null,
                dataArray:[],
                groupName:'',
                pattern:true,
                currEditId:null
            }
        },
        mounted(){
            let data = JSON.parse(window.sessionStorage.getItem('company_msg'));
            this.companys = data.company_name;
            this.c_id = data.company_id;
            this.init();                                //初始化权限组分组
            console.log(data);
        },
        methods:{
            async init(){
                let url = `authgroups?token=${api.token}&company_id=${this.c_id}&page=${this.index}&size=${this.pageSize}`;
                let res = await api.get(url);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("没有数据",1000);
                }else if(res.status >= 200 && res.status < 300){
                    let data = res.data;
                    this.dataArray = data;
                    console.log(data);
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            async confirm(){
                if(this.groupName === '') {
                    $toast.show("名称不能为空！");
                    return;
                }
                let url = `authgroups?token=${api.token}&bizid=${this.bizid}&company_id=${this.c_id}`;
                let param = {"company_id":this.c_id,"name":this.groupName};
                let res = await api.post(url,param);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("添加失败",1000);
                }else if(res.status >= 200 && res.status < 300){
                    $toast.show("添加成功",1000);
                    this.popshow = false;
                    this.init();
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            async update(){                                     //修改
                if(this.groupName === '') {
                    $toast.show("名称不能为空！");
                    return;
                }
                let bizid = utrl.setbizid();
                let id = this.currEditId;
                let url = `authgroups/${id}?token=${api.token}&bizid=${bizid}`;
                let param = {"company_id": this.c_id, "name": this.groupName, "id":id};
                let res = await api.put(url,param);

                if(res.status === 204 || res.status === 504){
                    $toast.show("修改失败",1000);
                }else if(res.status >= 200 && res.status < 300){
                    $toast.show("修改成功",1000);
                    this.popshow = false;
                    console.log(res);
                    this.init();
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            addPopup(){
                this.bizid = utrl.setbizid();
                [this.pattern, this.popshow, this.groupName] = [true, true, ''];
            },
            editPopup(k){
                let name = this.dataArray[k].name;
                if(name === "管理员" || name === "所有人"){
                    $toast.show("系统权限组不能编辑", 1000);
                    return;
                }
                [this.pattern, this.popshow, this.currEditId] = [false, true, this.dataArray[k].id];
                this.groupName = this.dataArray[k].name;
            },
            hidePopup(e){
                `${e.target.className}`.indexOf('dimmer') > -1 ? this.popshow = false : this.popshow = true;
            },
            routerGo(k){
                console.log(1);
                sessionStorage.setItem('permissionGroup',JSON.stringify(this.dataArray[k]));
                this.$router.push("PermissionsStaffDisplay");
            },
            remove(k){
                let name = this.dataArray[k].name;
                if(name === "管理员" || name === "所有人"){
                    $toast.show("系统权限组不能删除", 1000);
                    return;
                }
                $dialog.confirm({
                    theme: 'ios',
                    title: `是否要删除权限组【${name}】？`,
                    cancelText: '取消',
                    okText: '确定'
                }).then((res) => {
                    if(res) this.confirmDelete(k);
                });
            },
            async confirmDelete(k){
                let bizid = utrl.setbizid();
                let id = this.dataArray[k].id;
                let url = `authgroups?token=${api.token}&id=${id}&bizid=${bizid}`;
                let res = await api.delete(url);

                if(res.status === 204 || res.status === 504){
                    $toast.show("删除失败",1000);
                }else if(res.status >= 200 && res.status < 300){
                    $toast.show("删除成功",1000);
                    this.dataArray.splice(k,1);
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    @import url("../../../../establish/commoncss/common.css");
    .dimmer{
        position:fixed;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,0.2);
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
        z-index:10;
    }
    .popup{
        width:94vw;
        max-height:80vh;
        height:8rem;
        padding:0.8rem;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        background:white;
        border-radius: 0.25rem;
        >input{
            font-size:.8rem;
        }
        .title{
            font-size:.8rem;
            color:#777;
        }
        .buttons>.permissionBtn{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 6rem;
            height: 2rem;
            margin: 0 auto;
            border: 1px solid #f3a419;
            border-radius: 6px;
            font-size: .75rem;
        }
    }
    .buttons{
        font-size: .75rem;
        text-align: center;
    }
    /*动画*/
    .fade-enter-active, .fade-leave-active{
        transition: all 0.5s ease
    }

    .fade-enter, .fade-leave-active{
        opacity: 0;
    }
    .scale-enter-active, .scale-leave-active{
        transition: all 0.5s ease
    }

    .scale-enter, .scale-leave-active{
        transform: scale(0.1);
    }
</style>