<template>
	<div id="content" class="outOf">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" @click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{companys}}</div>
        </von-header>
        <div class="reference_top scroll">
            <ul>
                <li class="reference" v-for="(v, k) in person" :key="k">
                    <p class="left">{{v.DisplayName}}</p>
                </li>
            </ul>
            <p class="addcost" @click="selectPerson"><i class="ion-ios-plus-outline"></i> 选择人员</p>
        </div>
    </div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	export default{
		data() {
			return {
				msg:"选择排班人员",
				companys:"",
				User_Id:"",
				person:[
					
				]
			}
		},
		mounted(){
			let company_msg=utrl.getCompany()
			this.companys=company_msg.company_name
			let personData1 = JSON.parse(sessionStorage.getItem('selectPerson'));
            if(personData1 !== null){
            	this.User_Id=""
            	this.person=personData1
				if(personData1.length==0){
					this.User_Id="empty"
				}else{
					for(var i=0;i<personData1.length;i++){
						if(i==personData1.length-1){
							this.User_Id+=personData1[i].id
						}else{
							this.User_Id+=personData1[i].id+","
						}
					}
					
				}	
           }
            if(this.$route.params.val){
            	this.person=this.$route.params.val
            	for(var i=0;i<this.person.length;i++){
            		this.person[i].DisplayName=this.person[i].person_name
            	}
            }
		},
		methods:{
			selectPerson(){
				this.$router.push({name:"Shiftstaff",params:{
                	id:2,
                	name:"排班设置",
                	User_Id:this.User_Id
                }});
			}
		}
	}
</script>

<style lang="less" scoped>
    //@import url("../../../../establish/commoncss/common.css");
    .reference_top.scroll{
        overflow-y: auto;
        height: 84vh;
    }
    .reference .left{
        margin-left:.75rem;
    }
    .reference .right{
        right:.75rem;
    }
</style>