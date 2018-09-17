<template>
    <div id="content" @click="popshow = false">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <div ref="form">
            <div class="reference reference_top">
                <p class="required">*</p>
                <p>部门名称</p>
                <input class="msg-inp" type="text" placeholder="请输入部门名称" v-model="derName" data-test="部门名称">
            </div>
            <div class="reference" @click.stop="showAlert">
                <p class="required">*</p>
                <p>部门属性</p>
                <input class="msg-inp" type="text" placeholder="请选择部门属性" disabled="false" v-model="derAttr" data-test="部门属性">
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </div>
            <div class="reference" @click="selectCharges">
                <p class="required">*</p>
                <p>部门负责人</p>
                <input class="msg-inp" type="text" placeholder="请选择部门负责人" disabled="false" style="width:60%;" v-model="charges" data-test="部门负责人">
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </div>
            <div v-show="id == 1" class="reference" @click="selectDepartment">
                <p class="required">*</p>
                <p>选择上级部门</p>
                <input class="msg-inp" type="text" disabled="false" style="width:60%;" v-model="parentDer.name">
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </div>
        </div>
        <div class="btnsub">
            <!--<button @click="create">保存</button>-->
            <ButtonBottom :loading="loading" @call-back="create">保存</ButtonBottom>
        </div>
        <transition name="fade">
            <div v-show="popshow" class="dimmer">
                <transition name="scale">
                    <popup v-show="popshow" @my-event="callback" :der-attr-id="derAttrId"></popup>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import api from '../../../../asset/api.js';
import utrl from '../../../../controller/utrl.js';
import popup from './Popup.vue';


export default {
    data () {
        return {
            msg:'',
            menuButtonText: "",
            loading:false,
            popshow:false,
            company_msg:null,
            derName:"",                                         //部门名称
            derAttr:"",                                         //部门属性
            derAttrId:null,                                     //属性对应的数字，传入接口使用
            charges:[],                                         //负责人，多个
            charges_account:[],
            charges_user_id:[],
            parentDer:{                                         //上级部门
                name:null,                                      //上级部门名称
                id:null                                         //上级部门ID
            },
            bizid:null,
            id:null,
            OUID:null                                           //修改部门后更新stack来用
        }
    },
    activated(){
        let company_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
        this.menuButtonText = company_msg.company_name;
        this.company_msg = company_msg;
        this.company_id = company_msg.company_id;
        this.bizid = utrl.setbizid();
        let person = JSON.parse(window.sessionStorage.getItem('selectPerson'));
        console.log(person);
        if(person !== null) {
            let arr = [];
            let brr = [];
            let crr =[];
            for(let i = 0; i < person.length; i++){
                arr.push(person[i].user_name);
                brr.push(person[i].user_account);
                crr.push(person[i].user_id);
            }
            this.charges = arr.join(",");
            this.charges_account = brr;
            this.charges_user_id = crr;
        }
        if(this.$route.params.dep_msg !== undefined){
            let dep = this.$route.params;
            this.parentDer.name = dep.dep_msg.OUName;
            this.parentDer.id = dep.dep_msg.id;
            this.charges = [];
            this.charges_account = [];
            if(dep.index === 1){
                window.sessionStorage.removeItem('department');
                this.msg = "添加部门";
                this.id = 1;
                // this.derName = "";
                // this.derAttr = "";
                // this.derAttrId = null;
            }else {
                this.msg = "修改部门";
                this.id = 2;
                this.derName = dep.dep_msg.OUName;
                this.OUID = dep.dep_msg.OUID;                   //部门的OUID用来跟stack[i]来匹配
                this.derAttrId = dep.dep_msg.attribute_name;
                this.derAttrId === "01" ? this.derAttr = "管理部门" : this.derAttr = "销售部门";
                if(dep.dep_msg.charges.length !== 0){
                    for(let i = 0; i < dep.dep_msg.charges.length; i++){
                        this.charges.push(dep.dep_msg.charges[i].DisplayName);
                        this.charges_account.push(dep.dep_msg.charges[i].UserAccount);
                        this.charges_user_id.push(dep.dep_msg.charges[i].user_id);
                    }
                }
            }
        }

        let department = JSON.parse(window.sessionStorage.getItem('department'));
        if(department !== null) {
            console.log(this.parentDer);
            this.parentDer.name = department.OUName;
            this.parentDer.id = department.id;
        }
    },
    methods:{
        back: function() {
            window.sessionStorage.removeItem('selectPerson');
            window.sessionStorage.removeItem('department');
            if(this.id === 2){
                this.clearForm();
            }else{
                this.charges = "";
                this.charges_account = [];
                this.charges_user_id = [];
            }
            $router.go(-1);
        },
        async create(){
            let company_id = this.company_msg.company_id;
            let bizid = this.bizid;
            let url = "";
            let res = null;
            let param = {"name":this.derName, "attribute":this.derAttrId, "charges":this.charges_account};
            if(this.id === 1){                   //添加部门
                if(!this.inputTest()) return;
                let parent_id = this.parentDer.id === null ? company_id : this.parentDer.id;
                url = `departments?token=${api.token}&companyId=${company_id}&parentId=${parent_id}&bizid=${bizid}`;
                res = await api.post(url,param);
            }else {
                if(!this.inputTest(3)) return;              //修改部门
                let dep_id = this.parentDer.id;
                url = `departments?token=${api.token}&companyId=${company_id}&id=${dep_id}&bizid=${bizid}`;
                res =  await api.put(url,param);
            }
            this.loading = true;
            // await api.post(url,param).then((res) => {
            //     console.log(res);
            // });
            if(res.status === 204 || res.status === 504){
                $toast.show("添加失败",1000);
            }else if(res.status >= 200 && res.status < 300){
                if(this.id === 1) {
                    $toast.show("添加成功", 1000)
                }else {
                    let o = {OUName:this.derName, OUID:this.OUID};
                    window.sessionStorage.setItem('url_item',JSON.stringify(o));
                    $dialog.confirm({theme: 'ios',title: '修改成功，是否返回上一页查看？',
                        cancelText: '否',
                        okText: '是'
                    }).then((res) => { if(res) this.$router.go(-1); })
                }
                this.clearForm();
                window.sessionStorage.removeItem('selectPerson');
                // let department = JSON.stringify(res);
                // window.sessionStorage.setItem("department_msg",department);
            }else{
                $toast.show(res.data.errmsg, 1000);                         //服务器返回的错误信息
            }
            this.loading = false;
        },
        inputTest(j){                           //如果想略过某一个，传入下标为j数字
            let form = this.$refs.form;
            let inp = form.getElementsByClassName("msg-inp");

            for(let i = 0; i < inp.length; i++){
                if(j !== undefined && i === j){
                    continue;
                }else if(inp[i].value === "") {
                    let msg = inp[i].getAttribute("data-test");
                    $toast.show(`${msg}不能为空`, 1000);
                    return false;
                }
            }
            return true;
        },
        selectCharges(){
            this.$router.push({
                path:'/ChooseCharges',
                name:'chooseCharges',
                params:{
                    id:2,
                    name:"选择负责人",
                    user_id:this.charges_user_id
                }
            })
        },
        selectDepartment(){
            $router.push('/Mines/companyMessage/ChooseDepartment');
        },
        showAlert(){
            this.popshow = true;
        },
        callback(res){
            this.derAttr = res.name;
            this.derAttrId = res.id;
            this.popshow = false;
        },
        clearForm(){
            this.derName = "";
            this.derAttr = "";
            this.derAttrId = null;
            this.charges = "";
            this.charges_account = [];
            this.charges_user_id = [];
        },
        clearPerson(){
            this.charges = "";
            this.charges_account = [];
            this.charges_user_id = [];
        }
    },
    // beforeRouteEnter(to, from, next){
    //     console.log(to,from);
    // },
    components:{
        popup
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import url("../../../establish/commoncss/common.css");
.dimmer{
    position:fixed;
    width:100%;
    height:100vh;
    background:rgba(0,0,0,0.2);
    top:0;
    left:0;
    display:flex;
    justify-content: center;
    align-items: center;
    z-index:10;
}
.fade-enter-active, .fade-leave-active{
    transition: all 0.5s ease
}

.fade-enter, .fade-leave-active{
    opacity: 0;
}
.scale-enter-active, .scale-leave-active{
    transition: all 0.5s ease
}

.scale-enter, .scale-leave-active{
    transform: scale(0.1);
}
</style>
