<template>
    <div>
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">账号安全</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <div class="center">
            <div class="btn" @click="showAlt">修改密码</div>
        </div>
        <transition name="scale">
            <div v-if="show" class="alertBox">
                <div class="mask" @click.stop="returnKey"></div>
                <div class="content" transiton="scale">
                    <div class="title">您的手机号码是{{phone | phoneHide}}<br>请点击"获取验证码"</div>
                    <p class="error">{{errorMsg}}</p>
                    <div class="valid-wrapp">
                        <input @input="clean" ref="valid" class="update-inp" type="text" placeholder="输入验证码">
                        <div class="btn" @click="even && getCode()">
                            <span v-if="even">获取验证码</span>
                            <span v-if="!even">{{count}}s</span>
                        </div>
                    </div>
                    <input @input="clean" ref="oldPassword" class="update-inp" type="password" name="" placeholder="请输入原密码">
                    <input @input="clean" ref="newPassword" class="update-inp" type="password" name="" placeholder="请输入新密码">
                    <input @input="clean" ref="newPassword2" class="update-inp" type="password" name="" placeholder="请再次输入新密码">
                    <div class="btn" @click="changePassword">确定</div>
                    <div class="forget-btn" @click="$router.push('/user/Forget')">忘记密码</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import api from '../../../../asset/api.js';

export default {
    data () {
        return {
          phone:localStorage.getItem("user"),
          even:true,                                                      //防止按钮连续点击多次
          count:60,                                                       //倒计时
          show: false,
          errorMsg:""
        }
    },
    filters:{
        phoneHide:function(val){
          let val1 = val.slice(0,3);
          let val2 = val.slice(7);
          // console.log(val1+"****"+val2);
          return val1+"****"+val2;
        }
    },
    methods:{
        async getCode(){                                                    //获取验证码
            if(this.phone == null){                                           //如果本地缓存user为空
                $dialog.confirm({
                    title:"提示",
                    content:"您未登陆或登陆超时，请重新登陆。",
                    okText:"确定",
                    cancelText:"取消",
                    theme:'ios'}).then((res) => {
                        if(res){
                            this.$router.forward("/user/login");                        //退到登陆界面
                        }
                    })
            }else{                                                            //确定用户已经登陆
                let url = "sms";
                let obj = {"type":"User.ChangePassword","phone_number":this.phone};
                let res = await api.post(url,obj);
                console.log(this.phone,res);
                if(res.status >= 200 && res.status < 300){
                    this.even = false;
                    let interval = window.setInterval(() => {
                        if(this.count-- <= 1){
                            this.even = true;
                            this.count = 60;
                            window.clearInterval(interval);
                        }
                    },1000);
                }else{
                    this.errorMsg = res.data.errmsg;
                }
            }
        },
        async changePassword(){                                             //修改密码
            let valid     =   this.$refs.valid.value;                         //验证码
            let oldPass   =   this.$refs.oldPassword.value;                   //旧密码
            let newPass1  =   this.$refs.newPassword.value;                   //新密码
            let newPass2  =   this.$refs.newPassword2.value;                  //新密码2

            console.log(valid,oldPass,newPass1,newPass2);
            if(valid === "" || oldPass === "" || newPass1 === "" || newPass2 === ""){
                this.errorMsg = "您有未填写的项，请补充完整。";
                return false;
            }else if(newPass1 != newPass2){
                this.errorMsg = "两次输入的密码不一致，请重新填写。";
                return false;
            }else{
                let url = `users/current/password?token=${api.token}&validCode=${valid}`;
                let obj = {"password":oldPass,"new_password":newPass2};

                let res = await api.patch(url,obj);

                if(res.status >= 200 && res.status < 300){
                this.show = false;
                $dialog.alert({title:"操作提示",content:"修改成功",okText:"确定",theme:"ios"})
                    .then(()=>{
                        localStorage.setItem("pass","");
                        this.$router.forward("/user/login");
                    });
                }else{
                    this.errorMsg = res.data.errmsg;
                }
            }
        },
        showAlt(){
            this.show = true;
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate", this.returnKey, false);
        },
        clean(){
            this.errorMsg = "";
        },
        returnKey(e){
            this.show = false;
            if(e.toString() === '[object MouseEvent]') history.go(-1);
            window.removeEventListener("popstate", this.returnKey, false);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.center{
    background-color: #eee;
    z-index:1;
    position:fixed;
    width:100%;
    height:calc(100vh);
    padding-top:2.57rem;
    .btn{
      height: 2.5rem;
      line-height: 2.51rem;
      margin-top: .5rem;
      padding-left: .5rem;
      background-color: #fff;
      color:rgb(85,85,85);
      font-size: .75rem;
      box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
    }
}
.alertBox{
    position:absolute;
    z-index:10;
    width:100%;
    height:100%;
    top:0;
    left:0;
    .mask{
        position:absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background-color:rgba(0,0,0,0.3);
    }
    .content{
        position: absolute;
        width:14.42rem;
        height:18.6rem;
        background-color:#fff;
        top:50%;
        left:50%;
        margin-left:-7.21rem;
        margin-top:-9.3rem;
        border-radius: 10px;
        .title{
            width:11rem;
            margin:1rem auto 0;
            text-align:center;
            font-size: 0.8rem;
            line-height:1.4;
        }
        .error{
          text-align: center;
          height: 1.2rem;
          line-height: 1.2rem;
          color: red;
        }
        .valid-wrapp{
            position:relative;
            width:10rem;
            margin:0 auto;
            overflow:hidden;
            border-radius: 1.5rem;
            .btn{
                position:absolute;
                right:0;
                top:0;
                line-height: 2rem;
                text-align: center;
                width:3.8rem;
                color: #6b6b6b;
                height:100%;
                background: rgba(0, 0, 0, 0.1);
            }
            .update-inp{
              margin:0;
            }
        }
        .update-inp{
            border:1px solid gray;
            width:10rem;
            height:2rem;
            padding: 0;
            padding-left: 1rem;
            border-radius: 1.5rem;
            margin:.5rem auto 0 auto;
        }
        >.btn{
            width:10rem;
            height:2rem;
            color: #444;
            line-height:2rem;
            font-size:.8rem;
            border-radius: 1.5rem;
            text-align:center;
            margin:.6rem auto 0 auto;
            background-color:rgb(242,173,6);
        }
        >.forget-btn{
            width:10rem;
            text-align: left;
            margin-top: .5rem;
            color: #4a90e2;
            margin-left: auto;
            margin-right: auto;
            font-size:.7rem;
        }
    }
}
.scale-enter-active{
  transition: all .3s;
}
.scale-enter{
  transform: scale(1.3);
  opacity:0;
}
.scale-leave-active{
  transition: all .3s;
  opacity: 0;
}

</style>
