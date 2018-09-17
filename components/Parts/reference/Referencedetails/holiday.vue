<template>
	<div id="content">
		 <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="$router.go(-1)"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{company_msg.company_name}}</div>
        </von-header>
        <div>
        	<scroll  class="page-content padding-top">
        		  <ul class="msg-list">
        		  	<li class="msg-item" v-for="(item,index) in holidaylist" @click="active(index)">
        		  		<i :class="item.isTrue== false ? 'ion-ios-circle-outline' : 'ion-checkmark-circled'"></i>
                        <span class="uname">{{item.name}}</span>
        		  	</li>
        		  </ul>
        	</scroll>
        </div>
        <div class="btnsub">
            <button @click="confirm">确定</button>
        </div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import utrl from '../../../../controller/utrl.js'
	import api from '../../../../asset/api.js'
	export default{
		data(){
			return {
				msg:"选择节假日",
				company_msg:{},
				holidaylist:[]
			}
		},
		mounted(){
			let company_msg = utrl.getCompany()
			this.company_msg=company_msg
			this.gethoilday()
		},
		methods:{
			async gethoilday(){
				let url="legalholidays?token="+api.token
				let res=await api.get(url)
				if(res.status >= 200 && res.status < 300){
					this.holidaylist=res.data	
					//holidaylist
					for(var i=0;i<this.holidaylist.length;i++){
						//this.holidaylist[i].isTrue=false
						Vue.set(this.holidaylist[i],"isTrue",false)
					}
				}else{
						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						return
				}
				
			},
			active(e){
				let arr=this.holidaylist
				for(var i=0;i<arr.length;i++){
					if(i==e){
						arr[i].isTrue=!arr[i].isTrue
					}
				}
				
				this.holidaylist=arr
			},
			confirm(){
				let hoildaylists=[];
				for(var i=0;i<this.holidaylist.length;i++){
					if(this.holidaylist[i].isTrue==true){
						hoildaylists.push(this.holidaylist[i])
					}
				}
				let hoildaylist = JSON.stringify(hoildaylists)
                window.sessionStorage.setItem("hoildaylist",hoildaylist);
                this.$router.go(-1);
			}
		},
		watch:{
			
		}
	}
</script>

<style lang="less" scoped>
    @import url("../commoncss/common.css");
    /*@import url("../../../Index/Mines/companyMessage/css/company.less");*/
    body {
        background: unset;
        background-color:unset;
    }
    .scroll{
    	top:0;
    }
    .msg-list{
        margin-top:2.5rem;
        background-color:#fff;
        .msg-item{
            display: flex;
            align-items: center;
            height:2.27rem;
            font-size:.75rem;
            justify-content: space-between;
            color:#333;
            border-bottom:1px solid #eee;
            padding:0 .5rem;
            .ion-checkmark-circled{
                font-size:1.2rem;
                color:#f2bf07;
            }
            .ion-ios-circle-outline{
                font-size:1.2rem;
                color:#bbb;
            }
           
        }
    }
</style>