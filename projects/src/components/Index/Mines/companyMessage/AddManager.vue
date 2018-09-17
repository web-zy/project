<template>
    <div id="ss">
        <!-- <div class="header">
            <div class="return">&lt</div>
            <div class="title">公司信息</div>
        </div> -->
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <scroll class="page-content scroll-view">
            <div class="center">
                <ul class="com-list">
                    <li class="com-item">
                        <div class="message">李文强</div>
                    </li>
                    <li class="com-item">
                        <div class="message">李宏业</div>
                    </li>
                </ul>
            </div>
        </scroll>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg:'公司信息'
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
<style lang="less" scoped>
#ss{
*{
    color:#000;
}
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
    position:relative;
    width:100%;
    height:calc(100vh - 5rem);
    padding-top:3rem;
    margin-bottom:2.2rem;
    .com-list{
        width:100%;
        height:4rem;
        margin-top: 0.75rem;
        padding-top:0.5rem;
        .com-item{
            height:2.5rem;
            line-height:2.5rem;
            padding-left:1.5rem;
            position:relative;
            border-bottom:1px solid #eee;
            .message{
                height:2.5rem;
                line-height:2.5rem;
                font-size:0.75rem;
            }
        }
    }
}
.footer{
    position: fixed;
    bottom:0;
    width:100%;
    text-align:center;
    line-height:2.2rem;
    color:#fff;
    font-size: 0.75rem;
    height:2.2rem;
    z-index:100;
    background-color: #333333;
}
}
</style>
