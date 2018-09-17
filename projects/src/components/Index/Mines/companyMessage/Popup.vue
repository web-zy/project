<template>
    <div class="popup-cpy">
        <div class="procont">
            <div>
                <ul>
                    <li @click.stop="chooseAttr(0)">
                        <div class="left">
                            <i :class="derAttrId === '01' ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                        </div>
                        <p class="content">管理部门</p>
                    </li>
                    <li @click.stop="chooseAttr(1)">
                        <div class="left">
                            <i :class="derAttrId === '02' ? 'ion-checkmark-circled' : 'ion-ios-circle-outline'"></i>
                        </div>
                        <p class="content">销售部门</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['derAttrId'],
        data(){
            return {
                Attr:["管理部门","销售部门"]
            }
        },
        methods:{
            chooseAttr(n){
                let data = {id:`0${n+1}`, name:this.Attr[n]};
                this.$emit('my-event',data);
            }
        }
    }
</script>

<style lang="less" scoped>
    .procont{
        width:94vw;
        max-height:80vh;
        padding:0.5rem 0;
        display:flex;
        flex-direction: column;
        justify-content: flex-start;
        background:white;
        border-radius: 0.25rem;
        .left i{
            font-size: 1rem;
            display:inline-block;
            line-height: 2rem;
            padding-right: 1.15rem;
        }
        .content{
            display:inline-block;
            font-size: 0.8rem;
            line-height: 2rem;
            width: 93%;
        }
        .ion-checkmark-circled{
            color:#f2bf07;
        }
        .ion-ios-circle-outline{
            color:#bbb;
        }
    }
    .popup-cpy ul li{
        display: flex;
        justify-content: center;
        align-items: center;
        padding:0 1.15rem;
        list-style:none;
        line-height:2rem;
        font-size:0.8rem;
        position:relative;
    }
    .popup-cpy ul li p{
        text-indent:0.1rem;
        box-sizing: border-box;
    }
</style>