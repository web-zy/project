<template>
    <div>
    	<input-text :name="name" :edit="false" :alert="alert" v-model="clientObj.type" @click="setCompony">
    		<i class="icon-right ion-ios-arrow-forward"></i>
    	</input-text>
    </div>
	<!--<item :class="showCompony ? 'zIndex' : ''">
		<div class="info-list">
			<label>业务员</label>
			<span :class="clientObj.id ? '' : 'gray'" @click="setCompony">
				{{clientObj.id ? clientObj.type : '请选择业务员'}}
			</span>
		</div>
	</item>-->
</template>

<script>
    import api from "./../../asset/api.js"
    export default{
        data(){
            return{
                showCompony:false,
                companyArr:[],
                Acompanyname:"",
                Acompanyid:"",
                user_id:""
            }
        },
        activated(){
            if(window.sessionStorage.selectPerson != null && window.sessionStorage.selectPerson != ""){
                let selectPerson = JSON.parse(window.sessionStorage.selectPerson)
                let obj = selectPerson;
                sessionStorage.removeItem("selectPerson")
                this.giveData(obj)
                for(let i in obj){
                    this.user_id = obj[i].user_id + ',';
                }
            }
        },
        mounted(){
        },
        props:['clientObj','radio','min','max','name','alert'],
        methods:{
            setCompony(){
                console.log(this.user_id)
                $router.push({
                    name:"chooseCharges",
                    // name:"chooseExecutive",
                    params:{
                        name:this.name,
                        id:this.radio,
                        user_id:this.user_id,
                        min:this.min,
                        max:this.max
                    }
                })
            },
            giveData(obj){
                this.$emit('give-salesman',obj)
            }
        }
    }
</script>

<style lang="less" scoped>
	.absolute{
		position: fixed;
		z-index:99;
		top:0;
		left:0;
		bottom:0;
		right: 0;
	}
	.zIndex{
		z-index:44;
	}
</style>
