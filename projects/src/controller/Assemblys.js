import Vue from "vue"
// 审批按钮组
import ApprovalButton from "./../components/Index/News/Order/utrl/Approvalbutton.vue";
Vue.component('ApprovalButton', ApprovalButton);

//Tab
import TabItem from "./../components/Index/News/Order/utrl/Tab.vue";
Vue.component('tab-item', TabItem);

//审批
import Flowchart from "./../components/Index/News/Order/utrl/Flowchart.vue";
Vue.component('Flowchart', Flowchart);


const NewsWarp  = () => import('./../components/Index/News')
Vue.component('NewsWarp', NewsWarp);
	//待办
	const Staydo = () => import('./../components/Index/News/Staydo')
	Vue.component('Staydo', Staydo);
	//通知
	const Notice = () => import('./../components/Index/News/Notice')
	Vue.component('Notice', Notice);
	//我的申请
	const Myapply = () => import('./../components/Index/News/Myapply')
	Vue.component('Myapply', Myapply);

//工作
const Wooks = () => import('./../components/Index/Wooks')
Vue.component('Wooks', Wooks);

//通讯录
const MailList = () => import('./../components/Index/Maillist')
Vue.component('MailList', MailList);

//账表
const Account = () => import('./../components/Index/Account')
Vue.component('Account', Account);

//我的
const Mine = () => import('./../components/Index/Mine')
Vue.component('Mine', Mine);


//公司参照
const Getcommpy = () => import('./../components/Parts/reference/Referencedetails/getcommpy')
Vue.component('Getcommpy', Getcommpy);

//部门参照
// const

// // 选择日期
// const Datetext = () => import('./../components/Parts/Date.vue')
// Vue.component('Datetext', Datetext);

// 数字输入框
const Numtext = () => import('./../components/Parts/Numtext.vue')
Vue.component('Numtext', Numtext);

// 底部按钮
const ButtonBottom = () => import('./../components/Parts/Buttonbottom.vue')
Vue.component('ButtonBottom', ButtonBottom);

//选择部门
const Choicedepar = () => import ("./../components/Parts/Choicedepar.vue")
Vue.component('Choicedepar', Choicedepar)

//选择业务员
const Choicesalesman = () => import ("./../components/Parts/Choicesalesman.vue")
Vue.component('Choicesalesman', Choicesalesman)

//选择公司
const ChoiceCompany = () => import('./../components/Parts/Choicecompany.vue')
Vue.component('ChoiceCompany', ChoiceCompany)

//选择发票
const Choiceinvoice = () => import('./../components/Parts/Choiceinvoice.vue')
Vue.component('Choiceinvoice', Choiceinvoice)

//选择客户
const Choiceclient = () => import('./../components/Parts/Choiceclient.vue')
Vue.component('Choiceclient', Choiceclient)

//选择仓库
const Choicehouse = () => import('./../components/Parts/Choicehouse.vue')
Vue.component('Choicehouse', Choicehouse)

//请假类型
const leaves = () => import ("./../components/Parts/reference/Referencedetails/leaves.vue")
Vue.component('leaves', leaves)

//增加时间段
const Timeslot = () =>import("../components/Index/Workbench/Workattendance/clockcomponent/Timeslot.vue")
Vue.component("Timeslot",Timeslot)

//工作时间
const Workingday = () =>import("../components/Index/Workbench/Workattendance/clockcomponent/Workingday.vue")
Vue.component("Workingday",Workingday)

//增加打卡地点
const Cardlocation = () =>import("../components/Index/Workbench/Workattendance/clockcomponent/Cardlocation.vue")
Vue.component("Cardlocation",Cardlocation)

//产品档案
const Productref = () => import ("./../components/Parts/reference/Referencedetails/Productref.vue")
Vue.component('Productref', Productref)

//仓库档案
const Refwarehouse = () => import ("./../components/Parts/reference/Referencedetails/Refwarehouse.vue")
Vue.component('Refwarehouse', Refwarehouse)

//发票类型
const Refinvoicetype = () => import ("./../components/Parts/reference/Referencedetails/Refinvoicetype.vue")
Vue.component('Refinvoicetype', Refinvoicetype)


//品牌档案
const Refbrand = () => import ("./../components/Parts/reference/Referencedetails/Refbrand.vue")
Vue.component('Refbrand', Refbrand)

//计量单位
const Refmeasure = () => import ("./../components/Parts/reference/Referencedetails/Refmeasure.vue")
Vue.component('Refmeasure', Refmeasure)

//供应商档案
const Refsuppliers = () => import ("./../components/ceshi/Refsuppliers.vue")
Vue.component('Refsuppliers', Refsuppliers)

//积分明细  Integraldetail.vue
const Integraldetail = () => import ("./../components/Index/Workbench/integral/integralcomponent/Integraldetail.vue")
Vue.component('Integraldetail', Integraldetail)

//加减分项目 
const Addproject = () => import ("./../components/Index/Workbench/integral/integralcomponent/Addproject.vue")
Vue.component('Addproject', Addproject)

//积分明细
const costDetailed = () => import ("../components/Parts/reference/Referencedetails/costDetailed.vue")
Vue.component('costDetailed', costDetailed)




//Loanpopup 借款类型参照
const Loanpopup = () => import ("../components/Parts/reference/Referencedetails/Loanpopup.vue")
Vue.component('Loanpopup', Loanpopup)

// 结算方式参照
const Settlemethods = () => import ("../components/Parts/reference/Referencedetails/Settlemethods.vue")
Vue.component('Settlemethods', Settlemethods)

// 费用明细参照
const cost = () => import ("../components/Parts/reference/Referencedetails/cost.vue")
Vue.component('cost', cost)

//Reason 补考勤理由
const Reason = () => import ("../components/Parts/reference/Referencedetails/Reason.vue")
Vue.component('Reason', Reason)

//预览图片  preview
const preview = () => import ("../components/Parts/reference/Referencedetails/preview.vue")
Vue.component('preview', preview)

//积分类别 Integralclass
const Integralclass = () => import ("../components/Parts/reference/Referencedetails/Integralclass.vue")
Vue.component('Integralclass', Integralclass)

//touch长按组件
const longPressCot = () => import ("../components/Index/Mines/companyMessage/Jurisdiction/touchAssembly.vue");
Vue.component('touch',longPressCot);


//Monthselection  月份选择
const Monthselection = () => import ("../components/Parts/reference/Referencedetails/Monthselection.vue")
Vue.component('Monthselection', Monthselection)
//选人组件
const SelectPerson = () => import ("../components/Parts/reference/Referencedetails/SelectPerson.vue")
Vue.component('selectPerson', SelectPerson)


// 头像组件
const HeadPortrait = () => import ("../components/Parts/Head-portrait")
Vue.component('HeadPortrait', HeadPortrait)

/* Input组件集 */
const Form = () => import ("../components/Parts/input/Form")
Vue.component('BeeForm', Form)

//Timetext
const Timetext = () => import ("../components/Parts/input/Timetext")
Vue.component('Timetext', Timetext)

const FormItem = () => import ("../components/Parts/input/Form-item")
Vue.component('BeeFormItem', FormItem)

const InputText = () => import ("../components/Parts/input/Text")
Vue.component('InputText', InputText)

const InputNumber = () => import ("../components/Parts/input/Number")
Vue.component('InputNumber', InputNumber)

const InputRadio = () => import ("../components/Parts/input/Radio")
Vue.component('InputRadio', InputRadio)

const InputToggle = () => import ("../components/Parts/input/Toggle")
Vue.component('InputToggle', InputToggle)

const InputCheckbox = () => import ("../components/Parts/input/Checkbox")
Vue.component('InputCheckbox', InputCheckbox)

const InputDatepicker = () => import ("../components/Parts/input/Datepicker")
Vue.component('InputDatepicker', InputDatepicker)

const SetFlow = () => import ("../components/Parts/Set-flow")
Vue.component('SetFlow', SetFlow)

/* Input组件集结束 */

//LateReference 迟到参照
const LateReference = () => import ("../components/Parts/reference/Referencedetails/LateReference.vue")
Vue.component('LateReference', LateReference)

//积分选择  Choseintegral.vue
const Choseintegral = () => import ("../components/Parts/reference/Referencedetails/Choseintegral.vue")
Vue.component('Choseintegral', Choseintegral)

//图片选择参照  picfile
const picfile = () => import ("../components/Parts/reference/Referencedetails/picfile.vue")
Vue.component('picfile', picfile)


//Uploadfile  文件上传
const Uploadfile = () => import ("../components/Parts/reference/Referencedetails/Uploadfile.vue")
Vue.component('Uploadfile', Uploadfile)