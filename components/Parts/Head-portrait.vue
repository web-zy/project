<template>
    <div class="head-portrait" ref="headWarp">
    	<img v-if="src" :src="src" :alt="word" class="head-img">
        <em v-else class="head-word">{{word}}</em>
    </div>
</template>

<script>
    import api from "./../../asset/api.js"
	export default{
		data(){
			return{
			    src:false,
                word:""
			}
		},
		mounted(){
            this.setHead()
		},
		props:['userInfo',"size"],
		methods:{
			setHead(){
                var that=this
                setTimeout(function(){
                    let size = 66;
                    if((typeof that.size) == Number){
                        that.$refs.headWarp.style.width = that.size + "rem"
                        that.$refs.headWarp.style.height = that.size + "rem"
                    }else if(that.size == "large"){
                        size = 180;
                        that.$refs.headWarp.style.width = "3.3rem"
                        that.$refs.headWarp.style.height = "3.3rem"
                    }else if(that.size == "inside"){
                        size = 88;
                        that.$refs.headWarp.style.width = "2.2rem"
                        that.$refs.headWarp.style.height = "2.2rem"
                    }else{
                        that.$refs.headWarp.style.width = "1.65rem"
                        that.$refs.headWarp.style.height = "1.65rem"
                    }
                    let str = that.userInfo.user_name;
                    if(str != undefined && str != "") that.word = str.substr(str.length-1,1);
                    if(that.userInfo.head_image_id == undefined || that.userInfo.head_image_id.replace(/\s+/g,'') == ""){
                        return
                    }
                    let imgurl = api.headUrl + that.userInfo.head_image_id + '/thumbnail/' + size + '?token=' + api.token + '&company_id=' + api.mycompanies[0].company_id;
                    that.src = imgurl
                },0)
            },
			giveData(obj){
				this.$emit('give-client',obj)
			}
		},
        watch:{
            userInfo:{
                handler(newValue,oldValue){
                    console.log(newValue,oldValue)
                    this.setHead()
                },
                deep:true
            }
        }
	}
</script>

<style lang="less" scoped>
	//66px
    //88px
    //180px
    .head-portrait{
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f39800;
        font-size: .75rem;
        overflow: hidden;
        img{
            display: block;
            width: 100%;
            height: 100%;
            color: #fff;
            position: relative;
            &:before{
                content: "";
            }
            &:after{
                content: attr(alt);
                color: #fff;
                display: flex;
                position: absolute;
                z-index: 2;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
                background-color: #f39800;
            }
        }
        .head-word{
            color: #fff;
        }
    }
</style>