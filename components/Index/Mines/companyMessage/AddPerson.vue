<template>
    <div id="content">
        <von-header>
            <button class="button button-icon ion-ios-arrow-back" slot="left" v-on:click="back"></button>
            <span slot="title" style="line-height: 2.5rem;">{{msg}}</span>
            <div class="button button-icon companyname" slot="right">{{menuButtonText}}</div>
        </von-header>
        <ul ref="form">
            <li class="reference  reference_top">
                <p class="required">*</p>
                <p>手机号</p>
                <input v-model="mobilePhone" @keyup="keyUpFunc" placeholder="请输入手机号"
                       maxlength="11" data-test="手机号" autocomplete="off" class=" msg-inp" type="tel" name="">
            </li>
            <li class="reference">
                <p class="required">*</p>
                <p>加入公司</p>
                <input v-model="addCompany" disabled="false" data-test="加入公司" class=" msg-inp" type="text" name="">
            </li>
            <li class="reference" @click="$router.push('/Mines/companyMessage/ChooseDepartment')">
                <p class="required">*</p>
                <p>加入部门</p>
                <input v-model="addDepartment.OUName" data-test="加入部门" class=" msg-inp" disabled="false" type="text" name="">
                <p class="fuhao"><i class="ion-chevron-right"></i></p>
            </li>
            <li class="reference">
                <p class="required">*</p>
                <p>姓名</p>
                <input v-model="uname" data-test="姓名" class="msg-inp" type="text" name="">
            </li>
            <!--<li class="reference" @click="selectExecutive">-->
                <!--<p>主管</p>-->
                <!--<input v-model="executiveDirector.user_name" placeholder="请选择主管" disabled="false" type="text" name="">-->
                <!--<p class="fuhao"><i class="ion-chevron-right"></i></p>-->
            <!--</li>-->
            <!--<li class="reference">-->
                <!--<p>员工编号</p>-->
                <!--<input v-model="jobNumber" placeholder="请输入员工编号" type="tel" name="">-->
            <!--</li>-->
            <!--<li class="reference">-->
                <!--<p>办公邮箱</p>-->
                <!--<input v-model="email" placeholder="请输入办公邮箱" type="email" name="">-->
            <!--</li>-->
            <!--<li class="reference">-->
                <!--<p class="required">*</p>-->
                <!--<p>办公电话</p>-->
                <!--<input v-model="officePhone" data-test="办公电话" class="msg-inp" type="tel" name="">-->
            <!--</li>-->
            <li class="reference">
                <p>备注</p>
                <input v-model="remarks" placeholder="请输入备注" class="" type="text" name="">
            </li>
        </ul>
        <div class="btnsub">
            <!--<button @click.stop="addEmployee">保存</button>-->
            <ButtonBottom :loading="loading" @call-back="addEmployee">保存</ButtonBottom>
        </div>
    </div>
</template>

<script>
import api from '../../../../asset/api.js';
import utrl from '../../../../controller/utrl.js';

// var timer = null;

export default {
    data () {
        return {
            msg:'添加员工',
            menuButtonText: "",
            loading:false,
            company_msg:null,                                       //公司信息
            //persons:null,                                           //员工信息
            mobilePhone:"",                                         //手机号
            addCompany:"",                                          //加入公司
            uname:"",                                               //姓名
            addDepartment:{},                                       //加入部门
            // executiveDirector:{
            //     user_name:"",
            //     user_id:""
            // },                                   //主管
            // jobNumber:"",                                           //员工编号
            // email:"",                                               //邮箱
            // officePhone:"",                                         //办公电话
            remarks:"",                                              //备注
            //bizid:utrl.setbizid()
        }
    },
    activated(){
        let company_msg = JSON.parse(window.sessionStorage.getItem('company_msg'));
        console.log(company_msg);
        this.company_msg = company_msg;
        this.menuButtonText = company_msg.company_name;
        this.addCompany = company_msg.company_name;
        // let person = JSON.parse(window.sessionStorage.getItem('selectPerson'));
        // console.log(person);
        // if(person !== null && person.length !== 0) {
        //     this.executiveDirector = person[0];
        // }else {
        //     this.executiveDirector.user_name = "";
        //     this.executiveDirector.user_id = "";
        // }
        if(this.$route.params.dep_msg !== undefined)
            this.addDepartment = this.$route.params.dep_msg;

        if(sessionStorage.department !== undefined){
            this.addDepartment = JSON.parse(sessionStorage.department);
        }
    },
    methods:{
        back: function() {
            //window.sessionStorage.removeItem('selectPerson');
            window.sessionStorage.removeItem('department');
            // this.executiveDirector.user_name = "";
            // this.executiveDirector.user_id = "";
            $router.go(-1);
        },
        async addEmployee(){
            if(!this.inputTest()) {
                console.log(1);return};
            if(!this.keyUpFunc()) {
                console.log(2);return;}
            this.loading = true;
            let bizid = utrl.setbizid();
            let company_id = this.company_msg.company_id;
            let url = `employees?token=${api.token}&bizid=${bizid}&company_id=${company_id}`;
            let param = {
                "user_account":this.mobilePhone, "user_name":this.uname,"app_user_id": api.userInfo.id,
                "app_user_account": api.userInfo.uid,"app_user_name":api.userInfo.name,
                "dept_id":this.addDepartment.id,"company_id":company_id,
                "company_name":this.addCompany, "dept_name"   :this.addDepartment.OUName,
                "ouid":this.addDepartment.OUID, "remarks":this.remarks,
                "biz_id":bizid,
                // "leader_id"    : this.executiveDirector.user_id,
                // "leader_name"  : this.executiveDirector.user_name,
                // "employee_no"  : this.jobNumber,
                // "office_phone" : this.officePhone,
            };

            let res = await api.post(url,param);

            if(res.status === 204 || res.status === 500){
                $toast.show("添加失败或您已经添加该员工",3000);
            }else if(res.status >= 200 && res.status < 300){
                $toast.show("添加成功,已经成功发出邀请！", 3000);
                this.mobilePhone = "";
                this.uname = "";
                // this.executiveDirector.user_name = "";
                // this.executiveDirector.user_id = "";
                // this.jobNumber = "";
                // this.email = "";
                // this.officePhone = "";
                this.remarks = "";
                sessionStorage.removeItem('selectPerson');
            }else{
                $toast.show(res.data.errmsg,3000);                         //服务器返回的错误信息
            }
            this.loading = false;
        },
        async updateMsg(account){
            //useraccount=1515151&company_id=12
            let url = `users/useraccount?useraccount=${account}&token=${api.token}&company_id=${this.company_msg.company_id}`;
            let res = await api.get(url);

            if(res.status === 204 || res.status === 504){
                $toast.show("该手机号未注册", 3000);
            }else if(res.status >= 200 && res.status < 300){
                res = res.data;
                this.uname = res.name;
                console.log(res);
                // this.officePhone = res.office_phone ? res.office_phone : res.uid;
                // this.email = res.email;
                //this.jobNumber = res.employee_no ? res.employee_no : '';
            }else{
                console.log(res.data.errmsg);                         //服务器返回的错误信息
            }
        },
        inputTest(){
            let form = this.$refs.form;
            let inp = form.getElementsByClassName("msg-inp");
            for(let i = 0; i < inp.length; i++){
                if(inp[i].value === "") {
                    let msg = inp[i].getAttribute("data-test");
                    $toast.show(`${msg}不能为空`, 3000);
                    return false;
                }
            }
            return true;
        },
        // selectExecutive(){
        //     let id = this.executiveDirector.user_id;
        //     let checked = [];
        //     id === "" ? checked.push("") : checked.push(id);
        //     this.$router.push({
        //         path:'/ChooseCharges',
        //         name:'chooseCharges',
        //         params:{
        //             id:1,
        //             name:"选择主管",
        //             user_id:checked
        //         }
        //     })
        // },
        // keyDownFunc(){
        //     clearTimeout(timer);
        // },
        keyUpFunc(e){
            console.log(e);
            if(e === undefined){
                if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobilePhone))) {
                    $toast.show("请输入正确的手机号码",3000);
                    return false;
                }else if(this.mobilePhone.length === 11) {
                    return true;
                }
            }else {
                if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobilePhone)) && this.mobilePhone.length === 11){
                    $toast.show("请输入正确的手机号码",3000);
                }else if(this.mobilePhone.length === 11){
                    this.updateMsg(this.mobilePhone);
                }
            }
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import url("../../../establish/commoncss/common.css");
</style>
