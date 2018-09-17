<template>
    <div class="outOf backwrong">
        <!-- <div class="header">
            <div class="return">&lt</div>
            <div class="title">我的二维码</div>
        </div> -->
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon company" slot="right" @click="goMyBack">{{menuButtonText}}</div>
        </von-header>
        <div class="center">
            <textarea class="text-word" cols="30" rows="10" placeholder="请描述您的问题和您想实现的功能！" v-model="backwrongWord"></textarea>
            <div class="checked-warp">
                <von-toggle :text="toggleText" v-model="pushNotification" theme="energized"></von-toggle>
                <p>如果您接受电话回访，工程师可以更详细的询问您的需求，工程师一定会主动联系您的！回访时间段为上午11:00至12:00,下午5:00至6:00</p>
            </div>
            <!-- <div class="button-warp" @click="sublit">提交</div> -->
            <ButtonBottom @call-back="sublit" words="提交"></ButtonBottom>
        </div>
    </div>
</template>

<script>
import api from "./../../../asset/api.js"
import utrl from "./../../../controller/utrl.js"
export default {
    data () {
        return {
            msg:'问题反馈',
            menuButtonText:"我的反馈",
            toggleText:"是否接受电话回访",
            pushNotification:true,
            backwrongWord:"",
            info:{}
        }
    },
    mounted(){
        this.info = api.userInfo
        console.log(this.info)
    },
    methods:{
        back: function() {
            console.log($router.back)
            $router.back("/index")
            //          @click="$router.forward('/Mines/myMessage')"
        },
        async sublit(){
            if(this.backwrongWord == ""){
                $toast.show("问题描述不能为空", 1000).then(() => {})
                return
            }
            let obj = {
                "app_user_id":this.info.id,
                "app_user_account":this.info.uid,
                "app_user_name":this.info.name,
                "description":this.backwrongWord,
                "is_call_back":this.pushNotification ? 1 : 0
            };
            let url = "feedbacks?token=" + api.token + "&bizid=" + utrl.setbizid();
            let res = await api.post(url,obj)
            if(res.status >= 200 && res.status < 300){
                /* Alert 警告框 */
                $dialog.alert({
                    theme:"ios",
                    effect: 'default',
                    title: '提示',
                    content: '提交成功',
                    okText: '确定'
                }).then(function(){
                    $router.go(-1)
                })
            }
        },
        goMyBack(){
            $router.push("/mybackwrong")
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
.backwrong{
    background:#eee;
}
.center{
    width: 100vw;
    height:100vh;
    padding-top:2.5rem;
    .text-word{
        display:block;
        width:100vw;
        height:7.88rem;
        background: #fff;
        // text-indent: 0.75rem;
        font-size: 0.8rem;
        color: #333;
        padding:0.75rem;
        margin-bottom:0.25rem;
    }
    .checked-warp{
        background:#fff;
        p{
            padding:0.53rem;
            font-size: 0.55rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 0.75rem;
            letter-spacing: -0.01rem;
            color: #ff0000;
        }
    }
}
</style>
