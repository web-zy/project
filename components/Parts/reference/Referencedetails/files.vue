<template>
	<div id="">
		  <form id="fileupload" action="" method="POST" enctype="multipart/form-data">
		  	<p>文件上传</p>
			<input type="file" @change="changes"/>
			<div v-for="item in filelist" @click="down(item)">
			 	{{item.name}}
			 </div>
			<p>图片上传</p>
			<input type="file" @change="change"/>
			
		  </form>
		  <img :src="src"/>
		  <!--<button @click="down">下载</button>-->
	</div>
</template>

<script>
	import api from '../../../../asset/api.js'
	import utrl from '../../../../controller/utrl.js'
	import  './utrl/spark-md5.min.js'
	export default{
		data(){
			return {
				src:"http://img2.imgtn.bdimg.com/it/u=3588772980,2454248748&fm=27&gp=0.jpg",
				company_msg:{},
				filelist:[]
			}
		},
		mounted(){
			this.company_msg=utrl.getCompany()
		},
		methods:{
			async down(e){
				console.log(e)
			//	window.open("https://api.beeerp.com/api/v1/files/"+e.id+"?token="+api.token+"&company_id="+this.company_msg.company_id)
//				let url="files/dde46865-5e4b-4658-a679-9dc35b25a438?token="+api.token+"&company_id="+this.company_msg.company_id
//				let res=await api.get(url)
//					if(res.status >= 200 && res.status < 300){
//							$toast.show("下载成功",1000)
//							console.log(res)
//							//"data:image/png;base64,"+
//							//this.src=res.data
//							//location.href=res.data
//							//  application/octet-binary    application/vnd.ms-excel
//							//	let blob=new Blob([res.data],{type:"application/octet-binary"})
//							let objblob=URL.createObjectURL(blob)
//							window.location.href=objblob
//			
//							
//						//	window.open(objblob)
//						//	window.location.href=res.data
//						}else{
//							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
//							return
//						}
			},
			async change(e){
				var files = e.target.files || e.dataTransfer.files;
					let file=files[0]
		             if(!file) {
		                alert('请选择文件！');
		                return false;
		            }
		           this.get_filemd5sum(file)
			},
			//图片
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
						let url="images/"+tmp_md5+"?bizid="+bizid+"&token="+api.token+"&company_id="+that.company_msg.company_id
	               	  	let res=await api.post(url,formData)
	               	  	if(res.status >= 200 && res.status < 300){
	               	  		setTimeout(function(){
								 $loading.hide()
							},1000)
	               	  		console.log(res)
							$toast.show("提交成功",1000)
							let picsrc="images/"+res.data.id+"/thumbnail/180?token="+api.token+"&company_id="+that.company_msg.company_id
							let picres=await api.get(picsrc)
							console.log("src")
							console.log(picres)
							console.log(file)
							//file.type
							//this.src="http://img2.imgtn.bdimg.com/it/u=3588772980,2454248748&fm=27&gp=0.jpg"
						//	that.src="data:image/png;base64,"+picres.data
							that.src="data:image/"+file.type+";base64,"+picres.data
							console.log(that.src)
						}else{
							setTimeout(function(){
								 $loading.hide()
							},1000)
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
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
			async changes(e){
//				console.log(1)
//				  var that = this;
//				var files = e.target.files || e.dataTransfer.files;
//				  if (!files.length)
//	                return;
//	                
//				 var reader = new FileReader();
//				 
//              reader.readAsDataURL(files[0])
//             //注意files是一个数组  可以多张上传
//              reader.onload =async function(e){
//              	console.log(e)
//             	 	that.src=e.target.result.split(",")[1]; 
//             	  	let bizid=utrl.setbizid()
//             	  	let url="files/?bizid="+bizid+"&token="+api.token
//             	  	let res=await api.post(url,{
//             	  		md5:that.src
//             	  	})
//             	  	if(res.status >= 200 && res.status < 300){
//						$toast.show("提交成功",1000)
//					}else{
//						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
//						return
//					}
//              };       
					var files = e.target.files || e.dataTransfer.files;
					let file=files[0]
		             if(!file) {
		                alert('请选择文件！');
		                return false;
		            }
		           this.get_filemd5sums(file)
		            
			},
			get_filemd5sums(ofile){
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
	            	
	            	 $loading.show('上传中')
	                // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
	                spark.append(e.target.result); // Append array buffer
	                currentChunk++;
	                var md5_progress = Math.floor((currentChunk / chunks) * 100);
	                console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
	              //  $toast.show("已完成" + md5_progress + "%",1000)
	               
	                if (currentChunk < chunks) {
	                    loadNext();
	                } else {
	                    tmp_md5 = spark.end();
	               
//	                let bizid=utrl.setbizid()
//          	  	let url="files/"+tmp_md5+"?bizid="+bizid+"&token="+api.token
//             	  	let res=await api.post(url)
//             	  	if(res.status >= 200 && res.status < 300){
//						$toast.show("提交成功",1000)
//					}else{
//						$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
//						return
//					}
						let bizid=utrl.setbizid()
//	                 	let vFD = new FormData(document.getElementById('fileupload'))   //建立请求和数据
//	                 	console.log(1144)
//	                 	console.log(vFD)
//						var oXHR = new XMLHttpRequest();
//						oXHR.addEventListener('load', function(resUpload) {
//							//成功
//						}, false);
//						oXHR.addEventListener('error', function() {
//							//失败
//						}, false);
//						oXHR.addEventListener('abort', function() {
//							//上传中断
//						}, false);
//						oXHR.open('POST', "https://api.beeerp.com/api/v1/files/"+tmp_md5+"?bizid="+bizid+'&token='+api.token+"&company_id="+that.company_msg.company_id);
//						oXHR.send(vFD);    
						let formData = new FormData();
						  // 向 formData 对象中添加文件
						  formData.append('file',file);
						let url="files/"+tmp_md5+"?bizid="+bizid+"&token="+api.token+"&company_id="+that.company_msg.company_id
	               	  	let res=await api.post(url,formData)
	               	  	if(res.status >= 200 && res.status < 300){
							//
							console.log(res)
							that.filelist.push({
		                    	name:file.name,
		                    	id:res.data.id
		                    })
							setTimeout(function(){
								 $loading.hide()
							},1000)
							$toast.show("上传成功",1000)
						}else{
							setTimeout(function(){
								 $loading.hide()
							},1000)
							$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
							return
						}
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
	        }
		}
	}
</script>

<style scoped>
	img{
		width:200px;
		height:200px;
	}
</style>