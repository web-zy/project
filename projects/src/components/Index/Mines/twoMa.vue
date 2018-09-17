<template>
    <div>
        <!-- <div class="header">
            <div class="return">&lt</div>
            <div class="title">我的二维码</div>
        </div> -->
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <div class="center">
            <div class="msg">我的二维码</div>
            <div class="box">
                <img src="/static/work_images/ma.png">
            </div>
            <div class="msg msg2">请扫我的二维码</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg:'我的二维码'
        }
    },
    mounted(){

    },
    methods:{
        back: function() {
            $router.go(-1)
            //          @click="$router.forward('/Mines/myMessage')"
        },
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
    height:calc(100vh-5rem);
    padding-top:2.8rem;
    margin-bottom:2.2rem;
    .msg{
        font-size: 1rem;
        width:80%;
        margin:0 auto;
        margin-top:2rem;
        text-align:center;
    }
    .msg2{
        font-size: 0.8rem;
    }
    .box{
        width:50%;
        margin:0 auto;
        margin-top:3rem;
        img{
            width:100%;
            height:100%;
        }
    }
}
</style>
