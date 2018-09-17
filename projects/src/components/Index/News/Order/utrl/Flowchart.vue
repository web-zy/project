<template>
	<div class="flowchart" style="background: #fff;">
		<div class="trial-list" v-for="(val,index) in trialList"
		 :key="index"
		 :class="index == 0 ? 'last' : index == trialList.length-1 ? 'first' : ''">
			<div class="headPic">
				<!--<img style="width:100%; height: 100%;border-radius: 50%;" :src="headUrl + val.head_img_url_medium">-->
                <head-portrait :userInfo="{'user_name':val.ExtUsername,'head_image_id':val.head_image_id}" :size="'inside'"></head-portrait>
			</div>
			<label style="width:14rem; padding-left: 0;">
				<em style="font-size:0.7rem;width: 2.2rem;">{{val.ExtUsername}}</em>
				<em class="color">{{val.SelAction || val.NodeName}}</em>
				<span class="comments" v-html="val.Comments.replace(/[\r\n]/g,'<br/>')"  style="width: 9rem;" v-if="val.Comments">{{val.Comments}}</span>
				<!-- .answer.replace(/\n/g,"<br/>") -->
			</label>
			<div class="timer">
				<span class="wait" v-if="val.wait">{{val.wait}}</span>
				<span v-if="!val.wait" style="font-size:0.7rem;">{{val.time}}</span>
				<span v-if="!val.wait">{{val.year}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import api from "../../../../../asset/api.js"
	export default {
		data() {
			return {
				trialList:[],
				headUrl:"",
			}

		},
		mounted() {
			this.headUrl = api.headUrl
			this.del_info = {name:this.$route.params.interface,id:this.$route.params.id}
			this.getProcsteps();
		},
		methods: {
			//获取审批进度
			async getProcsteps(){
				let _this = this;
				let url = "procsteps/currentbill/" + this.del_info.id + "?token=" + api.token;
				let res = await api.get(url);
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				for(let val of res){
				    if(val.head_image_id === undefined) val.head_image_id = "";
				}
				this.trialList = res;
                for(let i in this.trialList){
					if(_this.trialList[i].FinishAt){
						let newTime = _this.trialList[i].FinishAt;
						let year = newTime.split("T")[0]
						let time = newTime.split("T")[1].split(":")[0] + ":" + newTime.split("T")[1].split(":")[1];
						_this.trialList[i].year = year
						_this.trialList[i].time = time
						_this.trialList = _this.trialList;
					}else{
						let nowTime = Date.parse(new Date());
						let newTime = Date.parse(new Date(_this.trialList[i].ReceiveAt))
						let waitTime = (nowTime - newTime);
						let Hours = waitTime / 1000 / 60 / 60 % 24;
						let Minutes = waitTime / 1000 / 60 % 60;
						let Seconds = waitTime / 1000 % 60;
						// setInterval(function(){
						let Day = parseInt(waitTime / 1000 / 60 / 60 / 24);
						_this.trialList[i].wait = "已等待" + (Day >= 1 ? + Day + "天" : '') + parseInt(Hours) + "小时" + (Day >= 1 ? '' : parseInt(Minutes) + "分") ; //+ parseInt(Seconds) + "秒"
						// },1000)
					}
				}
			}
		},
	}
</script>

<style lang="less" scoped>
.timer .wait{
	color:#f39800 !important;
}
</style>
