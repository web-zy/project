<template>
    <div>
        <!-- <div class="header">
            <div class="return">&lt</div>
            <div class="title">工作信息</div>
        </div> -->
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <div class="center">
            <ul class="list">
                <router-link to="workInner">
                    <li class="list-item">
                        <span class="left">我的职位</span>
                        <span class="right"></span>
                    </li>
                </router-link>

                <router-link to="workInner">
                <li class="list-item">
                    <span class="left">我的主管</span>
                    <span class="right"></span>
                </li>
                </router-link>

                <router-link to="workInner">
                <li class="list-item">
                    <span class="left">我的下属</span>
                    <span class="right"></span>
                </li>
                </router-link>

                <li class="list-item">
                    <span class="left">我担当的角色</span>
                    <!-- <span class="right"></span> -->
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg:'工作信息'
        }
    },
    mounted(){

    },
    methods:{
        back: function() {
            $router.go(-1)
            //          @click="$router.forward('/Mines/myMessage')"
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
.header{
    width:100%;
    height:2.47rem;
    background-color: #fc0;
    position:fixed;
    z-index:100;
    .return{
        width:2.47rem;
        height:2.47rem;
        text-align:center;
        position:absolute;
        line-height:2.47rem;
        font-size: 1.3rem;
    }
    .title{
        width:8rem;
        height:2.47rem;
        line-height: 2.47rem;
        font-size: 0.85rem;
        text-align:center;
        background-color:#fc0;
        margin:0 auto;
    }
}
.center{
    z-index:1;
    position:fixed;
    width:100%;
    height:calc(100vh);
    padding-top:2.57rem;
    .list{
        width:100%;
        .list-item{
            width:98%;
            margin:0 auto;
            height:2rem;
            border-bottom:1px solid #f3f3f4;
            .left{
                height:2rem;
                line-height:2rem;
                margin-left:1.5rem;
                font-size:0.75rem;
                color:#000;
            }
            .right{
                width:1.25rem;
                height:1.25rem;
                margin-top:0.35rem;
                margin-right:1rem;
                background:url('/static/work_images/rightArrow.png');
                background-size: cover;
            }
        }
    }
}
</style>
