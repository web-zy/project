<template>
    <div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <ul class="reference_top">
            <li class="reference" @click="$router.push('GroupPermissions')">
                <p class="left">组权限</p>
                <p class="fuhao right"><i class="ion-chevron-right"></i></p>
            </li>
            <!--by lwq 注释 2018-06-07 暂时不支持这个功能-->
            <!--<li class="reference" @click="$router.push('PermissionsPerson')">-->
                <!--<p class="left">人员权限</p>-->
                <!--<p class="fuhao right"><i class="ion-chevron-right"></i></p>-->
            <!--</li>-->
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg:'功能权限',
                companys:''
            }
        },
        mounted(){
            let data = JSON.parse(window.sessionStorage.getItem('company_msg'));
            this.companys = data.company_name;
        }
    }
</script>

<style lang="less" scoped>
    //@import url("../../../../establish/commoncss/common.css");
    .reference .left{
        margin-left:.75rem;
    }
    .reference .right{
        right:.75rem;
    }
</style>
