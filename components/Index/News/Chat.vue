<template>
    <div>
        <h1>{{msg}}</h1>

        <div class="bottom">
            <von-input
              type="text"
              v-model="mySay"
              placeholder="请输入消息">
            </von-input>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
          msg: '聊天',
          mySay:""

        }
    },
    mounted(){
        // this.$router.forward("/chatPage")
    },
    methods:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bottom{
    position: absolute;
    bottom: 0;
    left: 0;
}
</style>
