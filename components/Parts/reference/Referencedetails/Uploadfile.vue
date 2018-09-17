<template>
	<div class="chosepic">
		<p>附件</p>
		<div v-for="(item,index) in filelist" class="onefile">
			<div class="onefilein">
				<i class="icon-AccountTable"></i>
				<p>
					<span>{{item.name}}</span>
					<span>{{item.size}}</span>
				</p>
				<em class="ion-ios-close-empty" @click.stop="removelist(index)"></em>
			</div>
		</div>
		<div class="contpic">
			<!--icon-Increase-->
			<i>
					<img src="../../../../../static/images/Increase-01.png"/>
				</i>
			<form id="fileupload" action="" method="POST" enctype="multipart/form-data">
				<input type="file" accept="image/gif,image/jpeg,image/png,image/jpg,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/vnd.ms-powerpoint.presentation.macroEnabled.12,application/x-zip-compressed,application/pdf" @change="changes" />
			</form>
		</div>
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import './utrl/spark-md5.min.js'
	export default {
		data() {
			return {
				company_msg: {}
			}
		},
		props:['filelist'],
		mounted() {
			this.company_msg = utrl.getCompany()
		},
		methods: {
			//删除文件
			removelist(e) {
				$dialog.confirm({
					theme: 'ios',
					title: '确定删除吗吗?',
					cancelText: '取消',
					okText: '删除'
				}).then((res) => {
					if(res == true) {
						this.filelist.splice(e, 1)
					}
				})
			},
			async changes(e) {
				var files = e.target.files || e.dataTransfer.files;
				let file = files[0]

				if(!file) {
					//  alert('请选择文件！');
					return false;
				}
				this.get_filemd5sums(file)

			},
			get_filemd5sums(ofile) {
				var that = this
				var file = ofile;
				var tmp_md5;
				console.log(file.type)
				var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
					// file = this.files[0],
					chunkSize = 40485760, //  8097152  Read in chunks of 2MB
					chunks = Math.ceil(file.size / chunkSize),
					currentChunk = 0,
					spark = new SparkMD5.ArrayBuffer(),
					fileReader = new FileReader();
					fileReader.onload = async function(e) {
					var rFilter = /^(image\/gif|image\/jpeg|image\/png|image\/jpg|text\/plain|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.ms-word.document.macroEnabled.12|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.ms-excel.sheet.macroEnabled.12|application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.ms-powerpoint|application\/vnd.ms-powerpoint.presentation.macroEnabled.12|application\/x-zip-compressed|application\/pdf)$/i;
					//验证图片格式
					//注意rar的类型是空的。
					if(rFilter.test(file.type) == true || file.type == "") {
						$loading.show('上传中')
						spark.append(e.target.result); // Append array buffer
						currentChunk++;
						var md5_progress = Math.floor((currentChunk / chunks) * 100);
						if(currentChunk < chunks) {
							loadNext();
						} else {
							tmp_md5 = spark.end();
							let bizid = utrl.setbizid()
							let isexistsurl = "files/" + tmp_md5 + "/exists?token=" + api.token + "&company_id=" + that.company_msg.company_id
							let isexistsres = await api.get(isexistsurl);
							console.log(isexistsres)
							if(isexistsres.status >= 200 && isexistsres.status < 300) {
								if(isexistsres.data == 1){
									let Alreadyexisurl = "files/" + tmp_md5 + "/meta?bizid=" + bizid + "&token=" + api.token + "&company_id=" + that.company_msg.company_id
									let Alreadyexisres = await api.post(Alreadyexisurl, {
										filename: file.name
									})
									console.log(Alreadyexisres)
									if(Alreadyexisres.status >= 200 && Alreadyexisres.status < 300) {
										that.getfiles(Alreadyexisres.data.id,file)
									} else {
										$loading.hide()
										$toast.show(Alreadyexisres.data.errmsg + "，请重试！", 3000).then(() => {})
										return
									}
								}else{
									let formData = new FormData();
									// 向 formData 对象中添加文件
									formData.append('file', file);
									let url = "files/" + tmp_md5 + "?bizid=" + bizid + "&token=" + api.token + "&company_id=" + that.company_msg.company_id
									let res = await api.post(url, formData)
									if(res.status >= 200 && res.status < 300) {
										that.getfiles(res.data.id,file)
									} else {
										$loading.hide()
										$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
										return
									}
								}
							}	
						}
					} else {
						$toast.show("文件格式不正确", 1000)
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
			getfiles(id,file){
				let filesize = ""
				if(file.size / 1024 > 1024) {
					filesize = (file.size / 1024 / 1024).toFixed(2) + "M"
				} else {
					filesize = (file.size / 1024).toFixed(2) + "kb"
				}
				this.filelist.push({
					name: file.name,
					id:id,
					size: filesize
				})
				$loading.hide()
				$toast.show("提交成功", 1000)
			}
		},
		watch: {
			filelist() {
				var attachment = ""
				for(var i = 0; i < this.filelist.length; i++) {
					if(i == this.filelist.length - 1) {
						attachment += this.filelist[i].id
					} else {
						attachment += this.filelist[i].id + ","
					}
				}
				this.$emit("getattachment", attachment)
			}
		}
	}
</script>

<style scoped>
	.chosepic {
		width: 100%;
		padding: 0.75rem 0 0.4rem;
		min-height: 4rem;
		background: white;
		margin-top: 0.75rem;
		margin-bottom: 0.75rem;
		font-size: 0.75rem;
		padding: 0.75rem 1rem;
	}
	
	.chosepic>p {
		margin-bottom: 0.5rem;
	}
	
	.onefile {
		width: 100%;
		height: 2.5rem;
		display: flex;
		align-items: center;
		font-size: 1rem;
	}
	
	.onefilein {
		width: 100%;
		height: 2.2rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: #fafafa;
		position: relative;
	}
	
	.onefilein>i {
		display: block;
		margin-left: 0.75rem;
		margin-right: 0.4rem;
		font-size: 1.2rem;
	}
	
	.onefilein>p {
		height: 100%;
		margin-left: 0.5rem;
		font-size: 0.6rem;
		color: #777;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 0.3rem 0;
	}
	
	.contpic>i {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 2rem;
	}
	
	.contpic>i img {
		width: 80%;
	}
	
	.contpic {
		width: 100%;
		height: 2.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}
	
	.contpic input {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>