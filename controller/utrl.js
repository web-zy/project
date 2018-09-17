import Vue from 'vue'
import api from "./../asset/api.js"
import Vonic from "vonic"
import router from "vue-router"

// import Vuex from 'vuex';
// Vue.use(Vuex);
// import store from "./../store/store.js"

var app = new Vue({
  methods: {
    async setRem() {
      //获取html元素
      var html = document.getElementsByTagName('html')[0];
      //屏幕的宽度（兼容处理）
      var w = document.documentElement.clientWidth || document.body.clientWidth;
      //750这个数字是根据你的设计图的实际大小来的，所以值具体根据设计图的大小
      html.style.fontSize = w / 18.75 + "px";
//       if(sessionStorage.hrefImportant) return
//       sessionStorage.hrefImportant = true;
//       let res = await api.get("mobileappversions/minor")
// //       let timestamp = new Date().getTime();
// //       let url = window.location.origin + '?' + res.data.version_minor
// //       let hash = window.location.hash
//       if(res.data.version_minor != api.edition){
//         api.edition = res.data.version_minor
//         window.location.reload(true)
//       }
      // window.location.href = url + hash;
    }
  }
})

window.onresize = onload = function(){
	app.setRem()
}
//获取焦点
    // directives有两个参数
        //参数一： 自定义指令 v-focus
        //参数二： 对象，对象中可以添加很多方法
                 // 添加一个inserted方法:而这个方法中又有两个参数：
                 //参数一:el 当前使用自定义指令的对象
                 //参数二：obj 是指它(v-color="color" )后面设置的表达式
Vue.directive("focus",{
    inserted:function(el,obj){
         el.focus();
    }

});

if(window.plus){
    ourPlus();
}else{
    document.addEventListener('plusready', ourPlus, false);
}
function fullscreen(){
    // 设置应用全屏显示！
    plus.navigator.setFullscreen(true);
}
function unfullscreen(){
    // 设置应用非全屏显示！
    plus.navigator.setFullscreen(false);
}
function ourPlus(){
    setBarColor('#F3BF06','dark')
    unfullscreen()
}
// 设置状态栏背景颜色
function setBarColor(back,befor){
	// plus.io.resolveLocalFileSystemURL("https://mobile.beeerp.com",function(){
	// 	console.log('成功清楚缓存')
	// },function(){
	// 	console.log('啊呀呀，出了点小意外')
	// })
    plus.navigator.setStatusBarBackground(back);
    plus.navigator.setStatusBarStyle(befor);
}

// 转换时间戳
function gettime(timestr){
	let month=timestr.getMonth() + 1<10?"0"+(timestr.getMonth()+1):timestr.getMonth()+1
	let dates=timestr.getDate()<10?"0"+timestr.getDate():timestr.getDate()
	let houes=timestr.getHours()<10?"0"+timestr.getHours():timestr.getHours()
	// let houes=timestr.getHours()
	let minutes=timestr.getMinutes()<10?"0"+timestr.getMinutes():timestr.getMinutes()
	let seconds=timestr.getSeconds()<10?"0"+timestr.getSeconds():timestr.getSeconds()
	return timestr.getFullYear() + "-" + month + "-" + dates + " " + houes + ":" + minutes+":"+seconds
}
// 获取地址
function onPlusReady(){
    plus.geolocation.getCurrentPosition(function(p){
        // alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
        let bbb = getDisance(p.coords.latitude,p.coords.longitude,38.0225,114.425912)
        return bbb
    }, function(e){
        // alert('Geolocation error: ' + e.message);
        return e.message
    } );
}

// 获取时间格式
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
// 计算时间差
function dateDiff(sDate,eDate){
//	const y = Math.abs(eDate.getFullYear() - sDate.getFullYear());
//	const m = Math.abs(eDate.getMonth() - sDate.getMonth());
//	const d = Math.abs(eDate.getDate() - sDate.getDate());
//
//	// 如果年月日都相等，那肯定是同一天
//	if (y === 0 && m === 0 && d === 0) {
//	 	return 0;
//	} else {
//	// 否则今天算一天，然后计算从明天的0点到结束的日期共经过多少个"24小时"
//	// 向下取整，最后加1天，就是真正的从开始日期到结束日期过了几天
//		const last = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate() + 1, 0, 0, 0);
//		const diff = Math.floor((eDate - last)/  1000  /  60  /  60  / 24);
//		return 1 + diff;
//	}
		const diff = Math.floor((eDate - sDate)/  1000  /  60  /  60  / 24);
		return 1 + diff;
}
// 计算距离差
function toRad(d) {  return d * Math.PI / 180;}
function getDisance(lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return (dis * 6378137).toFixed(0);
}

// 创建并显示新窗口
function create(obj){
    //https://mobile.beeerp.com/#/Mines/workMessage/work
    // plus.webview.open( url, id, styles, aniShow, duration, showedCB );
    // plus.webview.open(null,'doccontent',{top:topoffset,bottom:'0px',bounce:'vertical',bounceBackground:'#F3BF06'})
}

// 返回键
document.addEventListener('plusready', function() {
    var first = null;
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function() {
        webview.canBack(function(e) {
            if(e.canBack) {
                webview.back();
            } else {
				if (!first) {
					first = new Date().getTime();
					$toast.show("再按一次退出应用", 1000)
					setTimeout(function() {
						first = null;
					}, 1000);
				} else {
					if (new Date().getTime() - first < 1000) {
						plus.runtime.quit();
					}
				}
            }
        })
    });
});



// 生成 bizid
function setbizid(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for(var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}


// 循环双层数据
function setJson(obj,refer){
	var tmpIndex = 0;
	var showJson = []
	seeObj(obj,refer)
	function seeObj(data,refer){
		if(data instanceof Array){
			if(tmpIndex == data.length){
				tmpIndex = 0;
				return
			}
			if(!(data[0] instanceof Array)){
				let nowData = data[tmpIndex];
				var funJson = [].concat(JSON.parse(JSON.stringify(refer)));
				for(let j in funJson){
					for(let q in nowData){
						// console.log(q)
						if(funJson[j].sing == q){
							funJson[j].content = nowData[q]
						}
					}
				}
				tmpIndex++
				showJson.push(funJson)
				seeObj(obj,refer)
			}
		}
	}
	return showJson
}

// 千分位
function formatNum(str){
	str=String(str)
	 var newStr = "";
	 var count = 0;
	 if(str.indexOf(".")==-1){
	 	if(str==0){
	 		str = "0.00"
	 		return str
	 	}else{
	 		for(var i=str.length-1;i>=0;i--){
		   if(count % 3 == 0 && count != 0){
		    newStr = str.charAt(i) + "," + newStr;
		   }else{
		    newStr = str.charAt(i) + newStr;
		   }
		   count++;
		  }
		  str = newStr+".00"; //自动补小数点后两位
		  return str
	 	}
	 }
	 else
	 {
	  for(var i = str.indexOf(".")-1;i>=0;i--){
	   if(count % 3 == 0 && count != 0){
	    newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
	   }else{
	    newStr = str.charAt(i) + newStr; //逐个字符相接起来
	   }
	   count++;
	  }
	  str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
	  return str
	 }
}
// 八位小数
function eight(str){
				// console.log(str)
	str=String(str)
	var newStr = "";
	if(str.indexOf(".")==-1){
	 	if(str == 0){
	 		str = "0.00000000"
	 		return str
	 	}else{
		  	str = str+".00000000"; //自动补小数点后八位
		  	return str
	 	}
	}else{
	  	str = newStr + (str + "00000000").substr((str + "00000000").indexOf("."),9);
	  	return str
	}
}
// 八位小数
function eights(obj, parameter,can) {
	for(var i = 0; i < obj.length; i++) {
		if(obj[i][can] instanceof Array){
			for(var j = 0; j < obj[i][can].length; j++) {
				if(obj[i][can][j].sing == parameter) {
					obj[i][can][j].content = eight(obj[i][can][j].content)
				}
			}
		}else{
			for(var k in obj[i][can]){
				if(k==parameter){
					obj[i][can][k]=eight(obj[i][can][k])
				}
			}
		}
	}
}


//转换千分位
function thousand(obj, parameter) {
	for(var i = 0; i < obj.length; i++) {
		for(var j = 0; j < obj[i].length; j++) {
			if(obj[i][j].sing == parameter) {
				obj[i][j].content = formatNum(obj[i][j].content)
			}
		}
	}
}
function qianfens(obj,parameter,can) {
	for(var i = 0; i < obj.length; i++) {
		if(obj[i][can] instanceof Array){
			for(var j = 0; j < obj[i][can].length; j++) {
				if(obj[i][can][j].sing == parameter) {
					obj[i][can][j].content = formatNum(obj[i][can][j].content)
				}
			}
		}else{
			for(var k in obj[i][can]){
				if(k==parameter){
					obj[i][can][k]=formatNum(obj[i][can][k])
				}
			}
		}
	}
}

//订单详情审批按钮
function approvalClcik(val,obj){
	var btnId = val.btnId;
	var inter = obj.name;
	var id = 0;
	btnId == "quickagree" || btnId == "indicatesubmit" ?  id = obj.stepId : id = obj.id;
	if(btnId == "indicatesubmit"){
		appovalFun(inter,btnId,id);
		return
	}
	if(btnId == 'reject'){						//拒绝的话需要输入拒绝理由
        order_module_func(inter,btnId,id);
    }else{
        $dialog.confirm({
            theme: 'ios',
            title: '确定' + val.name + '该审批吗？',
            cancelText: '取消',
            okText: '确定'
        }).then(async (res) => {
            if(res){
                appovalFun(inter,btnId,id)
            }
        })
	}
}
//动态输入拒绝理由弹框函数
function order_module_func(inter,btnId,id,callback){
    let orderDim      =      document.getElementsByTagName('body')[0];
    let dim           =      document.createElement('div'); dim.id = 'order-dim';
    let pop           =      document.createElement('div'); pop.className = 'popup-cpy';
    let p             =      document.createElement('p'); p.className = 'title';
    let textarea      =      document.createElement('textarea'); textarea.className = 'text'; textarea.id = 'order-textarea';
    let btn           =      document.createElement('div'); btn.className = 'btn';

    history.pushState(null, null, document.URL);
    window.addEventListener("popstate", returnKey, false);

    p.innerText = "审批意见";
    btn.innerText = "确定";
    textarea.setAttribute('placeholder','请输入拒绝理由');
    orderDim.appendChild(dim);
    dim.appendChild(pop);
    pop.appendChild(p);
    pop.appendChild(textarea);
    pop.appendChild(btn);

    let timer = null;
    if(timer) clearTimeout(timer);
    dim.style.display = 'flex';
    btn.addEventListener('click',function(){
        let text = document.getElementById('order-textarea').value;
        if(text === "") {
            $toast.show('理由不能为空！',3000);
            return;
        }
        returnKey();
        history.go(-1);
        appovalFun(inter,btnId,id,text).then((res) => {
            return callback(res);
        });
    },false);
    timer = setTimeout(function(){
        dim.className = 'show';
    },20);
    pop.addEventListener('click',function(e){e.stopPropagation();});
    dim.addEventListener('click',function(){
        returnKey();
    	history.go(-1);
    },false);
}
function returnKey(){
	let orderDim = document.getElementsByTagName('body')[0];
	let dim = document.getElementById('order-dim');
    dim.className = '';
	setTimeout(() => {
        dim.style.display = 'none';
        window.removeEventListener("popstate", returnKey, false);
        orderDim.removeChild(dim);
    },300);
}
async function appovalFun(inter,btnId,id,reason){
	$loading.show();
    let param = '';
    if(reason) param = btnId == 'reject' ? '&opinion=' + reason : '';
  	let url = inter + "/0/" + btnId + "/" + id + "?bizid=" + setbizid() + param + "&token=" + api.token;
	let res = await api.patch(url)
	if(res.status >= 200 && res.status <= 300){
		res = res.data;
		$loading.hide()
		$toast.show("成功",1000)
		setTimeout(function(){
			$router.go(-1)
		},1000);
		return true;
	}else{
		$loading.hide()
		setTimeout(function(){
			$dialog.alert({
				theme:"ios",
				title: "错误",
				content: res.data.errmsg,
				okText: '确定'
			})
		},500)
		// $toast.show(res.data.errmsg, 1000)
		return false
	}
}

function confirmFun(obj){
	$dialog.confirm({
	  theme: obj.theme ? obj.theme : "ios",
	  title: obj.title,
	  cancelText: obj.cancelText ? obj.cancelText : "取消",
	  okText: obj.okText ? obj.okText : "确认"
	}).then(obj.fn)
	var obj = {
		theme: 'ios',
		title: '确定同意该审批吗？',
		cancelText: '取消',
		okText: '同意',
		fn:async (res) => {
			if(res){
				let url = inter + "/0/quickagree/" + step + "?bizid=" + this.guid + "&opinion=agree&token=" + api.token;
				let res = await api.patch(url)
				if(res.status >= 200 && res.status < 300){
					res = res.data;
				}else{
					$toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
					return
				}
				if(res.taskid){
					this.arr.splice(index, 1)
				}
			}
		}
	}
	// utrl.confirmFun(obj)
}

// 登录
async function signIn (Obj){
	var url = "sessions";
	$loading.show('登录中..')
	let res = await api.post(url,Obj);
	if(res.status >= 200 && res.status < 300){
		res = res.data;
		api.token = res.access_token;
		api.loginStatus = true
		// store.commit('loginSuss')
		//获取公司信息并保存至api
		let mine = await api.get("users/current/mycompanies?token=" + api.token + "&size=1000");
        if(mine.status >= 200 && mine.status < 300)api.mycompanies = mine.data;
		else $toast.show(mine.data.errmsg, 3000).then(() => {})
		//获取个人信息
		let mine2 = await api.get("users/current?token=" + res.access_token)
		if(mine2.status >= 200 && mine2.status < 300)api.userInfo = mine2.data;
		else $toast.show(mine2.data.errmsg, 3000).then(() => {})
		$loading.hide()
	}else{
		api.loginStatus = false;
		$toast.show(res.data.errmsg, 3000).then(() => {})
		// store.commit('loginErr')
		return false
	}
	localStorage.user = Obj.uid;
	localStorage.pass = Obj.password;
	return true
}


// 动态添加路由
function routerGo(path,id,vue_name,processname,description,src,displayName,createAt,serialNum,stepId){
	let _this = this;
	let vName = "";
	if(vue_name == undefined){
		vName = "Allorder";
	}else if(vue_name=='Employee'){
		return
	}else{
		vName = vue_name;
	}
	// let childPath = "/index/" + path;
	let tmpRouter;
	function hasRouter(){
		let a = 1;
		for(let i in $router.options.routes[0].children){
			if($router.options.routes[0].children[i].name == path){
				a = 0;
				break
			}
		}
		return !a ? true : false
	}
	if(!hasRouter()){
		// alert(1)
		tmpRouter = $router.options.routes[0].children.push({
		    path: path,
		    name: path,
		    meta:{keepAlive:false},
		    component: resolve => require(['./../components/Index/News/Order/' + vName + '.vue'], resolve)
		});
		$router.addRoutes($router.options.routes)
	}
	// this.$router.addRoutes([
	// 	{
	// 	    path: childPath,
	// 	    name: path,
	// 	    component: resolve => require(['./Order/' + vName + '.vue'], resolve)
	// 	}
	// ])
}


// 获取公司
	function getCompany(){
		if(sessionStorage.getItem('company_msg') == null || sessionStorage.getItem('company_msg') == ''){
			// 公司信息
			let apiCompany = null;   //用户第一次进入时 ，没用session的时候
			//先查api里的默认公司
			for(let i in api.mycompanies){
				if(api.mycompanies[i].default == 1){
					// apiCompany变成这个默认公司的对象
					apiCompany = api.mycompanies[i]
				}
			}
			// 如果没有默认公司，就先取第一个公司
			if(apiCompany == null){
				apiCompany = api.mycompanies[0]
			}
			// mycompanies 是你用来拉接口的公司信息
			let mycompanies = apiCompany;
			sessionStorage.company_msg = JSON.stringify(apiCompany)
			return mycompanies
		}else{
			let a = JSON.parse(sessionStorage.company_msg);
			return a
		}
	}

export default {
	app:app,
    create:create,
    onPlusReady:onPlusReady,
    setbizid:setbizid,
    formatNum:formatNum,
    eights:eights,
    eight:eight,
    thousand:thousand,
    qianfens:qianfens,
    setJson:setJson,
    confirmFun:confirmFun,
    approvalClcik:approvalClcik,
    signIn:signIn,
    routerGo:routerGo,
    gettime:gettime,
    getCompany:getCompany,
    fullscreen:fullscreen,
    unfullscreen:unfullscreen,
    order_module_func:order_module_func,
    dateDiff:dateDiff
    // testPlus:testPlus
}

// var mixin = {
//   created: function () {
//     console.log('混合对象的钩子被调用')
//   }
// }
// new Vue({
//   mixins: [mixin],
//   created: function () {
//     console.log('组件钩子被调用')
//   }
// })
