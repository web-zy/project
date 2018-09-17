<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <ul class="reference_top">
            <li class="reference" @click="msg !== '所有人' ? selectPerson() : false">
                <p class="name">人员</p>
                <span :class="['text-overflow',user_names ? '' : 'grey']">
                    {{user_names ? user_names : msg === '所有人' ? '所有人无需维护人员' : '请选择人员'}}
                </span>
                <p v-show="msg !== '所有人'" class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
            <li class="reference" @click="settingPermission">
                <p class="name">权限分配</p>
                <span class="text-overflow grey">{{permissions.length === 0 ? '请分配权限' : ''}}</span>
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
        </ul>
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
                user_names:null,
                permissions:[]
            }
        },
        mounted(){
            let data = JSON.parse(sessionStorage.getItem('company_msg'));
            let permission = JSON.parse(sessionStorage.getItem('permissionGroup'));
            this.companys = data.company_name;
            this.c_id = data.company_id;
            this.msg = permission.name;

            this.initPersons();

            let perData = JSON.parse(sessionStorage.getItem('permissions_list'));
            if(perData !== null){
                this.update(perData);
                sessionStorage.removeItem('permissions_list');
            }else{
                this.initPermissions();
            }
        },
        methods:{
            async initPersons(){                                            //加载权限组中的人员
                let auth_id = JSON.parse(sessionStorage.getItem('permissionGroup'));
                let url = `authgroupusers/${auth_id.id}?token=${api.token}&company_id=${this.c_id}`;
                let res = await api.get(url);

                if(res.status >= 200 && res.status < 300){
                    let str = "";
                    for(let i = 0; i < res.data.length; i++){
                        str += `${ i !== 0 ? ',' : ''}${res.data[i].user_name}`;
                    }
                    this.user_names = str;
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            async initPermissions(){                                        //加载权限组所有的权限
                let auth_id = JSON.parse(sessionStorage.getItem('permissionGroup'));
                let url = `authgroupmenus/${auth_id.id}?token=${api.token}&company_id=${this.c_id}&page=1&size=1000`;
                let res = await api.get(url);
                console.log(res);
                if(res.status >= 200 && res.status < 300){
                    res = res.data;
                    this.permissions = res;
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            async update(param){                                            //修改权限组的权限
                let auth_id = JSON.parse(sessionStorage.getItem('permissionGroup'));
                let url = `authgroupmenus/${auth_id.id}?token=${api.token}&company_id=${this.c_id}`;
                let res = await api.put(url,param);
                console.log(res);
                if(res.status === 204 || res.status === 504){
                    $toast.show("更新失败",1000);
                }else if(res.status >= 200 && res.status < 300){
                    this.initPermissions();
                    $toast.show("分配成功，可在权限分配中查看",1000);
                }else{
                    $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
                }
            },
            selectPerson(){
                let msg = this.msg;
                this.$router.push({
                    name:'PermissionsGroupPersons',
                    params:{
                        name:msg
                    }
                })
            },
            settingPermission(){
                let per = this.permissions;
                this.$router.push({
                    name:'SettingPermissions',
                    params:{
                        permissions:per
                    }
                })
            },
            back(){
                sessionStorage.removeItem('permissionGroup');
                $router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
    //@import url("../../../../establish/commoncss/common.css");
    .reference{
        padding:0 .75rem;
        .name{
            margin-left:unset;
        }
        .fuhao{
            right:.75rem;
        }
    }
    .text-overflow{
        max-width: 60%;
        color:#666;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: right;
        font-size: 0.75rem;
        margin-right: .8rem;
        &.grey{
            color:darkgrey;
        }
    }
</style>