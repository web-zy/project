<template>
	<div class="content">
		<!-- <div class="header">
            <div class="return">&lt</div>
            <div class="title">我的信息</div>
        </div> -->
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
			<span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
			<div style="line-height: 2rem; font-size: 0.75rem;" class="button button-icon" slot="right"></div>
		</von-header>
		<div class="center" ref="selfAdaption">
			<scroll>
				<div class="list">
					<ul>
						<li class="list_headpics">
							<div class="touBox">
								<img class="headImg" :src="src" v-if="head_image_id!=''">
								<p class="edithead" v-else>修改头像</p>
								<input type="file" accept="image/png,image/jpeg,image/gif" class="tou" @change="changeHead" />
							</div>
						</li>
						<li class="list-item" ref="inpHeight">
							<div class="item_sex">
								<div class="item_icon">
									<i class="icon-Name"></i>
									<span class="left">姓名</span>
								</div>
								<input class="item-se" type="text" name="name" v-model="name">
							</div>
						</li>


						<li class="list-item">
							<div class="item_sex">
								<div class="item_icon">
									<i class="icon-Gender"></i>
									<span class="left">性别</span>
								</div>
								<select v-model="sex"  name="sex" class="item-se item-pick" style="opacity:0">
									<option value="0">男</option>
									<option value="1">女</option>
								</select>
								<input class="item-se" type="text" name="name" :value="sex==0?'男':'女'"/>
							</div>
						</li>
						<li class="list-item">
							<div class="item_sex" style="position: relative">
								<div class="item_icon">
									<i class="icon-Birthday"></i>
										<span class="left">生日</span>
									</div>
									<input class="item-se item-pick" style="opacity:0;width:100%"  type="date" name="birthday" v-model="birthday" />
									<input class="item-se"  type="text"  v-model="birthday" />

							</div>
						</li>
						<li class="list-item" @click="changephone">
							<label>
								<div class="item_icon">
									<i class="icon-PhoneNumber"></i>
									<span class="left">手机号</span>
								</div>
								<input class="item-se" style="background:transparent" type="text" name="uid" v-model="uid" disabled="false">
							</label>
						</li>
						<li class="list-item">
							<div class="item_sex">
								<div class="item_icon">
									<i class="icon-WeChat"></i>
									<span class="left">微信</span>
								</div>
								<input class="item-se" type="text" name="wechat" v-model="wechat">
							</div>
						</li>
						<li class="list-item">
							<div class="item_sex">
								<div class="item_icon">
									<i class="icon-QQ"></i>
									<span class="left">QQ</span>
								</div>
								<input class="item-se" type="text" id="qq" name="qq" v-model="qq">
							</div>
						</li>
						<li class="list-item" ref="ss">
							<div class="item_sex">
								<div class="item_icon">
									<i class="icon-mailbox"></i>
									<span class="left">电子邮件</span>
								</div>
								<input class="item-se" type="text" name="email" v-model="email">
							</div>
						</li>
						<!--
                    	<li class="list-item">
	                        <span class="left">二维码名片</span>
	                        <span class="ma" @click="$router.forward('twoMa')"></span>
	                        <!-- <div class="maBox" @click="changeHead">
	                            <img class="maImg" src="">
	                            <input class="ma" type="file" accept="image/*" id="capture" value="" capture="camera">
	                        </div>
                        </li>
                    -->

					</ul>
				</div>
			</scroll>
		</div>
		<div class="footer">
			<p @click="submit">确定</p>
		</div>

	</div>
</template>

<script>
	import api from "../../../asset/api.js"
	import utrl from "./../../../controller/utrl.js"
	import  '../../Parts/reference/Referencedetails/utrl/spark-md5.min.js'
	export default {
		data() {
			return {
		        name:"",
		        sex:0,
		        birthday:"",
		        uid:"",
		        wechat:"",
		        qq:"",
		        email:"",
		        msg: '我的信息',
		        src:"",
		        id:"",
		        clientHeight:document.body.clientHeight,
		        toTop:null,
		        inpH:null,
		        obj:{},
		        head_image_id:'',
		        company_msg:{}
			}
		},
		mounted() {
			this.company_msg=utrl.getCompany()
			this.getuser();
			// var windowheight=document.documentElement.clientHeight;
			// var that=this
			// window.onresize=function(){
			// 	var nowheight=document.documentElement.clientHeight;
			// 	if(windowheight==nowheight){
			// 		that.isshow=true
			// 	}else{
			// 		that.isshow=false
			// 	}
			// }
      //this.init();
		},
		methods: {
			//更换图片
			changeHead(e) {
				var files = e.target.files || e.dataTransfer.files;
					let file=files[0]
		             if(!file) {
		                alert('请选择文件！');
		                return false;
		            }
		           this.get_filemd5sum(file)
			},
			get_filemd5sum(ofile){
				var that=this
	            var file = ofile;
	            var tmp_md5;
	            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
	                // file = this.files[0],
	                chunkSize = 40485760,   //10M  // 8097152  Read in chunks of 2MB
	              	chunks = Math.ceil(file.size / chunkSize),
	                currentChunk = 0,
	                spark = new SparkMD5.ArrayBuffer(),
	                fileReader = new FileReader();

	            fileReader.onload = async function(e) {
	            	var rFilter = /^(image\/gif|image\/jpeg|image\/png|image\/jpg)$/i;
	            	if(rFilter.test(file.type) == true){
	            		 $loading.show('上传中')
	            	 
	                // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
	                spark.append(e.target.result); // Append array buffer
	                currentChunk++;
	                var md5_progress = Math.floor((currentChunk / chunks) * 100);
	                console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
	                $toast.show("已完成" + md5_progress + "%",1000)
	                if (currentChunk < chunks) {
	                    loadNext();
	                     $toast.show("11111",1000)
	                } else {
	                //	console.log(file.type)
	                    tmp_md5 = spark.end();
						let bizid=utrl.setbizid()
						let formData = new FormData();
						  // 向 formData 对象中添加文件
						 formData.append('file',file);
						let url="images/"+tmp_md5+"/head_image?bizid="+bizid+"&token="+api.token+"&company_id="+that.company_msg.company_id
	               	  	let res=await api.post(url,formData)
	               	  	if(res.status >= 200 && res.status < 300){
	               	  		setTimeout(function(){
								 $loading.hide()
							},1000)
	               	  		console.log(res)
							$toast.show("提交成功",1000)
							that.id=res.data.id
							that.head_image_id=res.data.id
							let picsrc="images/"+res.data.id+"/thumbnail/180?token="+api.token+"&company_id="+that.company_msg.company_id
							let picres=await api.get(picsrc)
							that.src="data:image/"+file.type+";base64,"+picres.data
							let editurl="users/current/head_image/"+res.data.id+"?token="+api.token+"&company_id="+that.company_msg.company_id
							let editres=await api.patch(editurl)

						}else{
							setTimeout(function(){
								 $loading.hide()
							},1000)
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
	                }
	            	}else{
	            		$toast.show("图片格式不支持", 1000)
	            	}
	            	
	            };

	            fileReader.onerror = function() {
	                console.warn('oops, something went wrong.');
	            };

	            function loadNext() {
	                var start = currentChunk * chunkSize,
	                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
	                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
	            }
	            loadNext();
	        },
	      init(){
	        let tagElem = this.$refs.selfAdaption;
	        window.addEventListener("resize", () => {
	          let curtH = document.body.clientHeight;
	          // this.clientHeight > curtH ? this.isshow = false : this.isshow = true;
	          let top = this.toTop - curtH + this.inpH * 2;

	          if(this.toTop - curtH > 0){
	            tagElem.style.top = `-${top}px`;
	          }else{
	            tagElem.style.top = `0px`;
	            this.toTop = null;
	          }
	        });
	      },
      focus(e){

     // 	e.target.scrollIntoView(false);
      	//e.target.scrollIntoViewIfNeeded();
      	//e.target.offsetTop='20px';
      //	e.target.style.display="block"
      //	e.target.style.margin="0 0 7rem 0"
        this.toTop = e.target.offsetTop + e.target.offsetHeight;
        this.inpH = this.$refs.inpHeight.offsetHeight;
      },
			changephone(){
				$toast.show('手机号不能修改哦', 1000).then(() => {

					})
				},
			async getuser() {
				var that = this
				var url = "users/current?token=" + api.token
				let res = await api.get(url);
				if(res.status >= 200 && res.status < 300) {
					that.name = res.data.name
					this.obj=res.data
					//去除字符串空白
					that.sex = res.data.sex
					//that.src=api.headUrl+res.data.head_img_url_medium
					if(res.data.birthday){
						that.birthday = res.data.birthday.split("T")[0];
					}
					if(!res.data.email){
						that.email = "";
					}else{
						that.email = res.data.email;
					}
					that.uid = res.data.uid;
					that.qq = res.data.qq;
					that.wechat = res.data.wechat;
					that.id=res.data.id
					if(res.data.head_image_id){
						this.head_image_id=res.data.head_image_id
					}
					let picsrc="images/"+res.data.head_image_id+"/thumbnail/180?token="+api.token+"&company_id="+that.company_msg.company_id
					let picres=await api.get(picsrc)
					if(picres.status >= 200 && picres.status < 300){
						that.src="data:image/png;base64,"+picres.data
					}else{
						this.head_image_id=""
					}
					
					//that.src=api.headUrl+res.data.head_img_url_medium
				} else {
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
			},
			async submit() {
				 var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
				 var re =  /^[@0-9a-zA-Z.]*$/g;
				 var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
				 /*
				 else if(this.obj.email!='undefined'||this.obj.email!=""&&!re.test(this.obj.email)){
		          	console.log(this.obj.email)
		          	console.log(this.obj)
		          	 $toast.show('邮箱格式不对', 2000).then(() => {})
		          }
				  */
				 var obj={
						name:this.name,
						sex:this.sex,
						birthday:this.birthday,
						uid:this.uid,
						wechat:this.wechat,
						qq:this.qq,
						email:this.email
					}
				 for(var k in obj){
				 	for(let key in this.obj){
				 		if(k==key){
				 			this.obj[key]=obj[k]
				 		}
				 	}
				 }
		        if (!myreg.test(this.uid)){
		             $toast.show('手机格式不对', 2000).then(() => {})
		          }else if(this.qq!=""&&!re.test(this.qq)){

		          	 $toast.show('qq格式不对', 2000).then(() => {})
		          }else if(this.email!=""&&!reg.test(this.email)){
		          	 $toast.show('邮箱格式不对', 2000).then(() => {})
		          }else{
						var url = 'users?token=' + api.token;
						var res = await api.put(url, obj);
						if(res.status >= 200 && res.status < 300) {
							 api.userInfo=this.obj
							 $toast.show('修改成功', 2000).then(() => {

							})
						}else{
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
						}
		          }

			},
			back: function() {
				$router.go(-1)
				//          @click="$router.forward('/Mines/myMessage')"
			},
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped="">
	* {
		padding: 0;
		border: none;
	}

	body {
		color: #000;
		font-size:0.75rem;
		background:white;
		input {
			border: none;
			background: #fff;
		}

	}
	select{
	  -webkit-appearance: none;
	  -webkit-tap-highlight-color: #fff;
	  outline: 0;
	  font-size:0.75rem;
	}
	.content{
		padding-top:0.025rem;

	}
	.center .scroll{
		top:0;
	}
	.center {
		width: 100%;
		position: fixed;
		height:calc(100vh - 7.8rem);
		margin-top:2.5rem;
		margin-bottom:2.2rem;
		background:white;
		top:0;
		.list_headpics {
			position:relative;
			width:100%;
			height: 9.4rem;
			display: flex;
			justify-content: center;
			align-items: center;
			background: url(../../../../static/mine_images/head_backpic.jpg) no-repeat;
			background-size: 100%;
			.tou {
				position: absolute;
				width: 4.5rem;
				height: 4.5rem;
				top: 50%;
				left: 50%;
				margin-left: -2.25rem;
				margin-top: -2.25rem;
				opacity: 0;
			}
			.touBox{
				width: 4.5rem;
				height: 4.5rem;
				overflow:hidden;
				text-align:center;
				line-height:4.5rem;
				border-radius: 50%;
				.edithead{
					width: 100%;
					height:100%;
					border-radius:50%;
					border:1px solid #333;
					color:#333;
				}
				img {
					width: 100%;
					height:100%;
				}
			}
		}
		.list-item{
			width:100%;
			height:2.27rem;
			border-bottom:1px solid #eee;
			.item_sex{
				width:100%;
				height:100%;
				display:flex;
				justify-content: space-between;
				align-items: center;
				position:relative;
				.item_icon{
					display:flex;
					justify-content:flex-start;
					align-items:center;
					i{
						display:block;
						font-size:0.95rem;
						margin-left:0.55rem;
						margin-right:1rem;
					}
					.left{
						font-size:0.75rem;
					}
				}
				.item-se{
					width:50%;
					text-align:right;
					margin-right:1rem;
					font-size:0.75rem;
					background:transparent;
				}
			}
			label{
				width:100%;
				height:100%;
				display:flex;
				justify-content: space-between;
				align-items: center;
				.item_icon{
					display:flex;
					justify-content:flex-start;
					align-items:center;
					i{
						display:block;
						font-size:0.95rem;
						margin-left:0.55rem;
						margin-right:1rem;
					}
					.left{
						font-size:0.75rem;
					}
				}
				.item-se{
					text-align:right;
					font-size:0.75rem;
					margin-right:1rem;
				}
			}
		}
	}

	.list {
		margin-bottom: 2.2rem;
	}

	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		line-height: 2.2rem;
		color: #fff;
		font-size: 0.75rem;
		height: 2.2rem;
		z-index:3;
		background-color: #f2be06;
		p {
			width: 100%;
			text-align: center;
			line-height: 2.2rem;
			color: #333;
		}
	}
	.center .list-item .item_sex .item-pick{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
	}
</style>
