<template>
    <div class="content outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
        </von-header>
        <div class="center">
            <div class="list">
                <ul>
                    <li class="list_headpics">
                        <div class="touBox">
                            <img class="headImg" :src="src + info.head_img_url_medium">
                        </div>
                    </li>
                    <li class="list-item">
                        <label>
                            <div class="item_icon">
                                <!-- <i class="icon-Name"></i> -->
                                <span class="left">姓名</span>
                            </div>
                            <p class="item-se">{{info.user_name}}</p>
                        </label>
                    </li>
                    <li class="list-item" ref="ss">
                        <label>
                            <div class="item_icon">
                                <!-- <i class="icon-mailbox"></i> -->
                                <span class="left">员工编号</span>
                            </div>
                            <p class="item-se">{{info.employee_no}}</p>
                        </label>
                    </li>
                    <li class="list-item">
                        <label>
                            <div class="item_icon">
                                <!-- <i class="icon-PhoneNumber"></i> -->
                                <span class="left">办公电话</span>
                            </div>
                            <p class="item-se">{{info.office_phone}}</p>
                        </label>
                    </li>
                    <li class="list-item" ref="ss">
                        <label>
                            <div class="item_icon">
                                <!-- <i class="icon-mailbox"></i> -->
                                <span class="left">办公邮箱</span>
                            </div>
                            <p class="item-se">{{info.e_mail}}</p>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../../asset/api.js"
    export default {
        data() {
            return {
                info:{
                    "id": "",
                    "app_date": "",
                    "user_account": "",
                    "company_id": "",
                    "company_name": "Userinfo.vue",
                    "user_name": "",
                    "employee_no": "",
                    "e_mail": "",
                    "totals": 0,
                    "TotalRows": 0,
                    "RowNum": 0,
                    "head_img_url_medium": "",
                    "office_phone":""
                },
                msg:"个人信息",
                isshow:true,
                src:"",
            }
        },
        mounted() {
            this.src = api.headUrl
            this.info = this.$route.params;
        },
        methods: {
            back: function() {
                $router.go(-1)
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
    select{
      -webkit-appearance: none;
      -webkit-tap-highlight-color: #fff;
      outline: 0;
      font-size:0.75rem;
    }
    .content{
        width:100vw;
        height:100vh;
        background: white;
        padding-top:0.025rem;
    }
    .scroll{
        top:0;
    }
    .center {
        width: 100%;
        padding-top:2.5rem;
        .list_headpics {
            position:relative;
            width:100%;
            height: 9.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: pink url(../../../../static/mine_images/head_backpic.jpg) no-repeat;
            background-size: 100%;
            .tou {
                position: absolute;
                width: 4.5rem;
                height: 4.5rem;
                top: 50%;
                left: 50%;
                margin-left: -2.25rem;
                margin-top: -2.25rem;
                opacity: 0;
            }
            .touBox{
                width: 4.5rem;
                height: 4.5rem;
                overflow:hidden;
                text-align:center;
                line-height:4.5rem;
                border-radius: 50%;
                line-height:4.5rem;
                img {
                    display:block;
                    width: 100%;
                    height:100%;
                }
            }
        }
        .list-item{
            width:100%;
            height:2.27rem;
            border-bottom:1px solid #eee;
            .item_sex{
                width:100%;
                height:100%;
                display:flex;
                justify-content: space-between;
                align-items: center;
                position:relative;
                .item_icon{
                    display:flex;
                    justify-content:flex-start;
                    align-items:center;
                    i{
                        display:block;
                        font-size:0.95rem;
                        margin-left:0.55rem;
                        margin-right:1rem;
                    }
                    .left{
                        font-size:0.75rem;
                    }
                }
                .item-se{
                    text-align:right;
                    margin-right:1rem;
                    font-size:0.75rem;
                    background:transparent;
                }
            }
            label{
                width:100%;
                height:100%;
                display:flex;
                justify-content: space-between;
                align-items: center;
                padding-left:0.55rem;
                .item_icon{
                    display:flex;
                    justify-content:flex-start;
                    align-items:center;
                    i{
                        display:block;
                        font-size:0.95rem;
                        margin-left:0.55rem;
                        margin-right:1rem;
                    }
                    .left{
                        font-size:0.75rem;
                    }
                }
                .item-se{
                    text-align:right;
                    font-size:0.75rem;
                    margin-right:1rem;
                }
            }
        }
    }

    .list {
        margin-bottom: 2.2rem;
    }

    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 2.2rem;
        color: #fff;
        font-size: 0.75rem;
        height: 2.2rem;
        z-index:3;
        background-color: #f2be06;
        p {
            width: 100%;
            text-align: center;
            line-height: 2.2rem;
            color: #333;
        }
    }
    .item-pick{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
    }
</style>