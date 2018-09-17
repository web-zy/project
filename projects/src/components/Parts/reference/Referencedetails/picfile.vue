<template>
	<div class="filepic">
		<p>图片</p>
		<div id="">
			<ul>
				<li v-for="(item,index) in piclist" @click="godetails(item,index)">
					<img :src="item.src" />
					<em class="ion-ios-close-empty" @click.stop="remove(index)"></em>
				</li>
				<li>
					<form id="fileupload" action="" method="POST" enctype="multipart/form-data">
						<input type="file" accept="image/png,image/jpeg,image/gif"  @change="change" />
					</form>
					<i>
						<img src="../../../../../static/images/Increase-01.png"/>
					</i>
				</li>
			</ul>
		</div>
		<preview v-if="picshow" :picdetails="picdetails" @picturhide="pichide"></preview>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import './utrl/spark-md5.min.js'
	export default {
		data() {
			return {
				picshow: false,
				picdetails: "",
				company_msg: {}
			}
		},
		props:['piclist'],
		mounted() {
			this.company_msg = utrl.getCompany()
		},
		methods: {
			//预览图片
			godetails(val, e) {
				this.picshow = true
				this.picdetails = val
				history.pushState(null, null, document.URL);
				window.addEventListener("popstate", this.pichide, false);
			},
			//取消预览
			pichide() {
				this.picshow = false
				//if(e.toString() === '[object MouseEvent]') history.go(-1);
				window.removeEventListener("popstate", this.pichide, false);

			},
			//删除图片
			remove(e) {
				$dialog.confirm({
					theme: 'ios',
					title: '确定删除吗吗?',
					cancelText: '取消',
					okText: '删除'
				}).then((res) => {
					if(res == true) {
						this.piclist.splice(e, 1)
					}
				})
			},
			async change(e) {
				var files = e.target.files || e.dataTransfer.files;
				let file = files[0]
				if(!file) {
					alert('请选择文件！');
					return false;
				}
				this.get_filemd5sum(file)
			},
			get_filemd5sum(ofile) {
				var that = this
				var file = ofile;
				var tmp_md5;
				var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
					// file = this.files[0],
					chunkSize = 40485760, //10M  // 8097152  Read in chunks of 2MB
					chunks = Math.ceil(file.size / chunkSize),
					currentChunk = 0,
					spark = new SparkMD5.ArrayBuffer(),
					fileReader = new FileReader();
				fileReader.onload = async function(e) {
					var rFilter = /^(image\/gif|image\/jpeg|image\/png|image\/jpg)$/i;
					//验证图片格式
					if(rFilter.test(file.type) == true) {
						$loading.show('上传中')
						spark.append(e.target.result); // Append array buffer
						currentChunk++;
						var md5_progress = Math.floor((currentChunk / chunks) * 100);
						// $toast.show("已完成" + md5_progress + "%",1000)
						if(currentChunk < chunks) {
							loadNext()
						} else {
							tmp_md5 = spark.end();
							let isexistsurl = "files/" + tmp_md5 + "/exists?token=" + api.token + "&company_id=" + that.company_msg.company_id
							let isexistsres = await api.get(isexistsurl);
							console.log(isexistsres)
							let bizid = utrl.setbizid()
							if(isexistsres.status >= 200 && isexistsres.status < 300) {
								//判断是否已经存在    0没有上传过  
								var id = ""
								if(isexistsres.data == 1) {
									let Alreadyexisurl = "files/" + tmp_md5 + "/meta?bizid=" + bizid + "&token=" + api.token + "&company_id=" + that.company_msg.company_id
									let Alreadyexisres = await api.post(Alreadyexisurl, {
										filename: file.name
									})
									console.log(Alreadyexisres)
									if(Alreadyexisres.status >= 200 && Alreadyexisres.status < 300) {
										id = Alreadyexisres.data.id
										that.getpic(id, file)
									} else {
										$loading.hide()
										$toast.show(Alreadyexisres.data.errmsg + "，请重试！", 3000).then(() => {})
										return
									}
								} else {
									let formData = new FormData();
									// 向 formData 对象中添加文件
									formData.append('file', file);
									let url = "images/" + tmp_md5 + "?bizid=" + bizid + "&token=" + api.token + "&company_id=" + that.company_msg.company_id
									let res = await api.post(url, formData)
									if(res.status >= 200 && res.status < 300) {
										id = res.data.id
										that.getpic(id, file)
									} else {
										$loading.hide()
										$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
										return
									}
								}
							} else {
								$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
								return
							}
						}
					} else {
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
			async getpic(id, file) {
				let picsrc = "images/" + id + "/thumbnail/180?token=" + api.token + "&company_id=" + this.company_msg.company_id
				let picres = await api.get(picsrc)
				if(picres.status >= 200 && picres.status < 300) {
					this.piclist.push({
						src: "data:" + file.type + ";base64," + picres.data,
						id: id,
						type: file.type
					})
						$toast.show("上传成功", 1000)
						$loading.hide()
				}else{
						$loading.hide()
					$toast.show(picres.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
//				//获取原图
//				let Customaryurl = "images/" + id + "?token=" + api.token + "&company_id=" + this.company_msg.company_id
//				let Customaryres = await api.get(Customaryurl)
//				if(Customaryres.status >= 200 && Customaryres.status < 300) {
//					
//				} else {
//					$toast.show(Customaryres.data.errmsg + "，请重试！", 3000).then(() => {})
//					return
//				}
//				$loading.hide()
				
			}

		},
		watch: {
			piclist() {
				var picture = ""
				for(var i = 0; i < this.piclist.length; i++) {
					if(i == this.piclist.length - 1) {
						picture += this.piclist[i].id
					} else {
						picture += this.piclist[i].id + ","
					}
				}
				this.$emit("getpiclist", picture)
			}
		}
	}
</script>

<style scoped>
	.filepic {
		width: 100%;
		min-height: 4rem;
		background: white;
		font-size: 0.75rem;
		margin-top: 0.75rem;
		padding: 0.75rem 1rem;
	}
	
	.filepic p {
		margin-bottom: 0.5rem;
	}
	
	.filepic ul {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		list-style: none;
	}
	
	.filepic ul li {
		height: 2.5rem;
		width: 2.5rem;
		margin-right: 0.5rem;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-left: 0;
	}
	
	.filepic ul li i {
		display: flex;
		align-items: center;
		width: 2.5rem;
		height: 2.5rem;
	}
	
	.filepic ul li i img {
		width: 80%;
	}
	
	.filepic ul li input {
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}
	
	.filepic ul li img {
		max-width: 100%;
		max-height: 100%;
	}
	
	.filepic ul li em {
		position: absolute;
		right: 0;
		top: 0;
		color: #fff;
		background: #999;
		border-radius: 50%;
		transform: translate(20%, -30%) scale(0.9);
		width: 1rem;
		line-height: 1rem;
		height: 1rem;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-pack: center;
		justify-content: center;
		-ms-flex-align: center;
		align-items: center;
		font-size: 1rem;
	}
</style>