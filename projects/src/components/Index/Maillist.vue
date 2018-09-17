<template>
	<div id="Mail">
		<von-header>
			<button style="color: #F3BF06;" class="button button-icon ion-ios-arrow-back" slot="left"></button>
			<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <!--<div class="button button-icon ion-ios-person" slot="right"></div>-->
		</von-header>
		<div class="scroll-warp">
			<scroll>
				<div class="companies" v-for='(val,index) in mycompanies' :key="index" @click.stop="getStaff(val.id,index)">
					<div class="companies-name">
						<p>{{val.company_name}}</p>
						<div class="button button-icon " :class="val.show ? 'ion-ios-arrow-up' : 'ion-ios-arrow-down'"></div>
						<div class="toOrganize" @click.stop="toOrganize(index)">组织架构</div>
					</div>
					<div class="companies-staff" :class="val.show ? 'show' : 'hide'">
						<ul v-if="val.users.length > 0">
							<li v-for="(item,index) in val.users" :key="index" @click.stop="goUserInfo(val.users[index])">
								<span>
									<em class="headPic">
										<!--<img :src="headUrl + item.head_img_url_medium" alt="">-->
										<head-portrait :userInfo="item" :size="'small'"></head-portrait>
									</em>{{item.user_name}}
								</span>
								<span class="managerBtnCls" v-if="item.manager">管理员</span>
								<span>{{item.user_account}}</span>
							</li>
						</ul>
						<span class="noData" v-else>暂无数据</span>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
import api from "./../../asset/api.js"
import utrl from "./../../controller/utrl.js"
import Vue from 'vue'
export default {
	data() {
		return {
			msg: '通讯录',
			headUrl:"",
			mycompanies:[]
		}
	},
	mounted() {
		// utrl.create()
		this.headUrl = api.headUrl
		this.getCompany()
	},
	methods: {
		//获取默认公司联系人
		async getCompany(){
			let _this = this;
            let mine = await api.get("users/current/mycompanies?token=" + api.token + "&size=1000");
            if(mine.status >= 200 && mine.status < 300)api.mycompanies = mine.data;
            else $toast.show(mine.data.errmsg, 3000).then(() => {})
			let mycompanies = api.mycompanies;
			let defaultId = null;
			let defaultIndex = 0;
			for(let i = 0;i<mycompanies.length;i++){
				mycompanies[i].users = []
				mycompanies[i].show = false;
				if(mycompanies[i].default == 1){
					mycompanies[i].show = true;
					defaultId = mycompanies[i].id;
					defaultIndex = i;
				}
			}
			if(defaultId != null){
				let url = "employees?token=" + api.token + "&company_id=" + defaultId + "&size=1000";
				let res = await api.get(url)
				if(res.status >= 200 && res.status < 300){
					mycompanies[defaultIndex].users = res.data;
                    _this.mycompanies = mycompanies
				}else{
					$toast.show(res.data.errmsg, 3000).then(() => {})
					return
				}
			}else{
				return
			}
		},
		async getStaff(id,index){
            // if(this.mycompanies[index].show){
			// 	this.mycompanies[index].show = false;
			// 	return
			// }
			// for(let i in this.mycompanies){
			// 	this.mycompanies[i].show = false;
			// }
			// this.mycompanies[index].show = true;
			// if(this.mycompanies[index].users.length > 0){
			// 	return
			// }
			let arr = this.mycompanies
			if(arr[index].show){
				arr[index].show = false;
				this.mycompanies = []
				this.mycompanies = this.mycompanies.concat(arr)
				return
			}
			for(let i in arr){
				arr[i].show = false;
			}
			arr[index].show = true;
			this.mycompanies = []
			this.mycompanies = this.mycompanies.concat(arr)

            let managerUrl = `authgroupusers?token=${api.token}&company_id=${arr[index].company_id}&filter=name=管理员`;
            let magagerRes = await api.get(managerUrl);

            if(magagerRes.status >= 200 && magagerRes.status < 300){
                let users = arr[index].users;
                if(magagerRes.data[0]) {
					let manager = magagerRes.data[0].user_name;
					for(let val of users){
						if(val.user_name === manager){
							Vue.set(val,'manager',manager);
						}
					}
                }
            }else{
                $toast.show(res.data.errmsg, 3000);
            }
            console.log(this.mycompanies);
            if(arr[index].users.length > 0){
				return
			}
			let url = "employees?token=" + api.token + "&company_id=" + id + "&size=1000";

            let res = await api.get(url)
			if(res.status >= 200 && res.status < 300){
				this.mycompanies[index].users = res.data;
			}else{
				$toast.show(res.data.errmsg, 3000).then(() => {})
				return
			}
		},
		goUserInfo(info){
			$router.push({
				name:"userinfo",
				params:info
			})
		},
		toOrganize(index){
			sessionStorage.company_msg = JSON.stringify(this.mycompanies[index])
			$router.push({
				name:"addPersonAndDepartment",
				// params: {
    //                 data: this.mycompanies[index]
    //             }
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	#Mail {
		width: 100vw;
		height: 100vh;
		padding-bottom: 2.5rem;
		padding-top: 2.5rem;
		.scroll-warp{
			height:100%;
			// margin-top: 2.5rem;
			position: relative;
			.scroll{
				top:0;
			}
		}
		.companies{
			width: 18.75rem;
			min-height: 3rem;
			background-color: #ffffff;
			//box-shadow: 0rem 0.05rem 0.08rem 0rem #dadada;
			border-bottom:1px solid #eee;
			margin-bottom:0.05rem;
				transition: all .5s ease;
			.companies-name{
				justify-content: space-between;
				display:flex;
				height:3rem;
				width:100%;
				position: relative;
				.toOrganize{
					position: absolute;
					right:2.5rem;
					top:50%;
					transform: translate(0,-50%);
					display:flex;
					width:4rem;
					justify-content:center;
					align-items:center;

					position: absolute;
				    height: 1.35rem;
				    border: 1px solid #f3a419;
				    border-radius: 6px;
				    font-size: .7rem;
				}
				&>p{
					line-height:3rem;
					font-size: 0.85rem;
					// letter-spacing: -0.02rem;
					text-indent:0.48rem;
					color: #333333;
				}
				&>.button{
					font-size:1.3rem;
					color:#333;
					margin-right: 0.57rem;
					line-height:3rem;
				}
			}
			.companies-staff{
				display:block;
				width:100%;
				max-height:0;
				// padding: 0.25rem 0;
				box-sizing: border-box;
				background: #eee;
				transition: all .3s ease;
				overflow:hidden;
				&.show{
					max-height:100vh;
				}
				&.hide{
					max-height:0;
				}
				.managerBtnCls{
					margin-top:.1rem;
					padding: 0 0.5rem;
					border-radius: 0.2rem;
					margin-right: 3.5rem;
					background: transparent;
					font-size: 0.63rem;
					border: 1px solid #4cbed7;
					color: #4cbed7;
				}
				ul{
					padding:0 0.48rem;
					border-top: 0.25rem solid #eee;
					border-bottom: 0.25rem solid #eee;
					background:#FFF;
					// transition: all .3s ease;
					overflow:hidden;
				}
				li{
					height:2.15rem;
					display:flex;
					align-items: center;
					justify-content:space-between;
					border-bottom: 1px solid #eee;
					p,span{
						font-size: 0.75rem;
						color: #333333;
						display:flex;
						align-items:center;
					}
					&:last-child{
						border:none;
					}
					.headPic{
						display:inline-block;
						width:1.65rem;
						height:1.65rem;
						border-radius: 50%;
						overflow:hidden;
						margin-right:0.63rem;
						img{
							width:100%;
							height:100%;
						}
					}
				}
			}
		}
	}
	.noData{
		display:flex;
		height:2rem;
		justify-content:center;
		align-items:center;
		color:#999;
	}
</style>