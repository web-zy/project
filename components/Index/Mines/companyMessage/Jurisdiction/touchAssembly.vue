<template>
    <ul>
        <li v-for="(v, k) in data" @touchstart="touchstart($event,k)" @touchend="touchend(k)" @click="routerGo(k)"
            :class="['reference', v.isTouch === true?'mark':'']">
            <p class="left">{{edit ? v.name : v.user_name}}</p>
            <p class="fuhao right"><i class="ion-chevron-right"></i></p>
            <div :class="['ol-popup',v.isShow === true?'show':'']">
                <div class="ol-popup-edit" @click.stop="edit_func(k)" v-show="edit">编辑</div>
                <div class="ol-popup-closer" @click.stop="remove(k)">删除</div>
            </div>
        </li>
    </ul>
</template>

<script>
    import Vue from 'vue';

    var timeOutEvent = null;                                                       //定时器

    export default {
        props:['data','edit'],
        data() {
            return {}
        },
        mounted() {
            let data = this.data;
            for(let i = 0; i < data.length; i++){
                Vue.set(data[i],'isTouch',false);
                Vue.set(data[i],'isShow',false);
            }

            document.addEventListener('touchmove', this.touchmove, false);
            document.addEventListener('click', this.touchmove, false);
        },
        methods:{
            touchstart(e,k){
                console.log(e,k);
                Vue.set(this.data[k],'isTouch',true);
                timeOutEvent = setTimeout(() =>{
                    Vue.set(this.data[k],'isShow',true);
                },500);
            },
            touchend(k){
                window.clearTimeout(timeOutEvent);
                if(this.data[k].isShow === false) Vue.set(this.data[k],'isTouch',false);
                // Vue.set(this.person[k],'isTouch',false);
            },
            touchmove(){
                let data = this.data;
                for(let i = 0; i < data.length; i++){
                    Vue.set(data[i],'isTouch',false);
                    Vue.set(data[i],'isShow',false);
                }
            },
            edit_func(k){
                this.$emit('call-edit',k);
            },
            remove(k){
                this.$emit('call-remove',k);
            },
            routerGo(k){
                this.$emit('call-router',k);
            }
        },
        destroyed(){
            document.removeEventListener('touchmove', this.touchmove, false);
            document.removeEventListener('click', this.touchmove, false);
        }
    }
</script>

<style lang="less" scoped>
.reference{
    position:relative;
    .left{
        margin-left:.75rem;
    }
    .right{
        right:.75rem;
    }
    &.mark{
        background-color:#fafafa;
    }
    .ol-popup {
        position: absolute;
        top:-2rem;
        left: 50%;
        z-index:10;
        display:none;
        width: 5rem;
        height: 2rem;
        margin-left:-2.5rem;
        border: 1px solid #cccccc;
        border-radius: 10px;
        background-color: #1B1C1D;
        justify-content: center;
        align-items: center;
        &.show{
            display:flex;
        }
        .ol-popup-edit,.ol-popup-closer{
            width:auto;
            padding: 0 .4rem;
            margin:0;
            text-align: center;
            color:#fff;
            height:100%;
        }
    }
    /*以下是尖角的实现*/
    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent; /*边框颜色设置为透明*/
        content: " ";
        height: 0; /*高、宽都设置为0，边框的4条边就聚合到一起，组合成一个小正方形。*/
        width: 0; /*正方形按对角线分成4个小三角，分别对应4条边框*/
        position: absolute;
        pointer-events: none;/*不允许穿透层去点击下面的内容*/
    }
    .ol-popup:after {
        border-top-color: #1B1C1D;
        border-width: 10px;
        left: 50%;
        margin-left: -10px;
    }
}
</style>