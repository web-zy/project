<template>
    <div class="flow-warp">
        <div class="title-warp">
        	<span class="title">{{name}}</span>
        	<span class="title-vice">{{viceName}}</span>
        </div>
        <div class="choice-warp">
        	<div class="flow-people-warp" v-for="(val,index) in showUser" :key="index">
        		<div class="people-header">
        			<!--<img :src="headUrl+val.head_img_url_medium" />-->
                    <head-portrait :userInfo="showUser[index]" :size="'small'"></head-portrait>
        			<i class="delete-button ion-ios-close-empty" @click="remFlow(index)"></i>
        			<span class="user-name">{{val.user_name}}</span>
        		</div>
        		<div class="right-warp ion-ios-arrow-thin-right"></div>
        	</div>
        	<div class="add-warp" @click="addFlow">
        		<img src="../../../static/images/sfsdd.png"/>
        	</div>
        </div>
    </div>
</template>

<script>
	import api from "./../../asset/api.js"
	export default{
		data(){
			return{
				headUrl:api.headUrl,
				// userArr:this.value,
                flowName:"",
                showUser:[]
			}
		},
        computed:{
            userArr:{
                get:function() {
                    return this.value;
	            },
	            set:function(val) {
                    this.$emit('input', val);
	            }
            }
        },
		activated(){
            if(window.sessionStorage.flowName != this.flowName){
                return
            }

			if(window.sessionStorage.selectPerson != null && window.sessionStorage.selectPerson != ""){
                let selectPerson = JSON.parse(window.sessionStorage.selectPerson)
                let obj = selectPerson;
                sessionStorage.removeItem("selectPerson")
                let arr = []
                for(let i in obj){
                    this.showUser.push(obj[i]);
                    this.userArr.push(obj[i].user_id);
                }
                window.sessionStorage.flowName = ""

               //  this.$nextTick(() => {this.$refs.Approver.scrollTop = 100;});
            }
		},
		mounted(){
            this.flowName = this.name
		},
		props:{
			value:{
				default:[]
			},
			name:{
				default:''
			},
			viceName:{
				default:''
			}
		},
        watch:{
            userArr(){
                if(this.userArr.length == 0){
                    this.showUser = []
                }
            }
        },
		methods:{
			addFlow(){
                window.sessionStorage.flowName = this.name;
                $router.push({
                    name:"chooseCharges",
                    // name:"chooseExecutive",
                    params:{
                        name:this.name,
                        id:1,
                        user_id:this.userArr
                    }
                })
			},
			remFlow(index){
                $dialog.confirm({
                    theme: 'ios',
                    title: '确定删除此人吗?',
                    cancelText: '取消',
                    okText: '确定'
                }).then((res) => {
                    if(res){
                        this.showUser.splice(index,1)
                        this.userArr.splice(index,1)
                    }
                })
			}
		}
	}
</script>

<style lang="less" scoped>
.flow-warp{
	padding: 0 1rem;
	.title-warp{
		display: block;
		height: 2rem;
		line-height: 2rem;
		span{
			display: inline-block;
		}
		.title{
			font-size: 0.75rem;
			color:#555;
		}
		.title-vice{
			font-size:0.6rem;
			color:#aeadac;
			margin-left: 0.2rem;
		}
	}
	.choice-warp{
		// padding:0.5rem 0;
        width: 100%;
		display: flex;
		justify-content: flex-start;
		min-height: 3rem;
		padding-bottom: 0.5rem;
        flex-wrap: wrap;
		.flow-people-warp{
			margin-right: 0.3rem;
			display: flex;
			justify-content:flex-start;
            padding-bottom: 0.5rem;
			.people-header{
				width: 2rem;
				height: 3rem;
				position: relative;
				display: flex;
				justify-content:flex-start;
				flex-direction: column;
				img{
					width:100%;
					border-radius: 50%;
					overflow: hidden;
					height: 2rem;
				}
				.user-name{
					height: 1rem;
					width:100%;
					text-align:center;
					line-height: 1rem;
					color:#333;
				}
				.delete-button{
					position: absolute;
					right: 0;
					top: 0;
                    color: #fff;
                    background: #999;
                    border-radius: 50%;
					transform: translate(20%,-30%) scale(0.9);
					width:1rem;
					line-height: 1rem;
                    height: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
					font-size:1rem;
				}
			}
			.right-warp{
				height: 2rem;
				width:0.8rem;
				line-height: 2rem;
				text-align: center;
				color:#c0c1c3;
				font-size:1.3rem;
				margin-left: 0.3em;
			}
		}
		.add-warp{
			border-radius: 50%;
			width: 2.5rem;
			height: 2.5rem;
			line-height: 2rem;
			font-size:2rem;
			img{
				width:80%;
			}
		}
	}
}
</style>
