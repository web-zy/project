
const routes = [{
	path:"/",
	component:resolve => require(['./App'], resolve),
	redirect: '/index',
	children:[
		{
			path: '/index',
			name:'index',
			meta:{keepAlive:true},
			component:resolve => require(['./components/Index'], resolve)
		},
		{
			path:"/user",
			component:resolve => require(['./components/User'], resolve),
			meta:{keepAlive:true},
			children: [
				{
					path: "login",
					name:"login",
					meta:{keepAlive:true},
					component: resolve => require(['./components/User/Login'], resolve)
				},{
					path: 'register',
					name: "register",
					meta:{keepAlive:true},
					component: resolve => require(['./components/User/Register'], resolve)
				},{
					path:"forget",
					name: "forget",
					meta:{keepAlive:true},
					component: resolve => require(['./components/User/Forget'], resolve)
				},{
					path: "verification",
					name:"verification",
					meta:{keepAlive:true},
					component: resolve => require(['./components/User/Verification'], resolve)
				}
			]
		},{
			path:"/backwrong",
			name:"backwrong",
			meta:{keepAlive:false},
			component:resolve => require(['./components/Index/Mines/Backwrong'], resolve)
		},{
			path:"/mybackwrong",
			name:"mybackwrong",
			meta:{keepAlive:false},
			component:resolve => require(['./components/Index/Mines/Mybackwrong'], resolve)
		},{
			path:"/userinfo",
			name:"userinfo",
			meta:{keepAlive:false},
			component:resolve => require(['./components/Index/Mail_list/Userinfo'],resolve)
		},{
			path:"/search",
			meta:{keepAlive:false},
			component:resolve => require(['./components/Index/News/Search/Search'], resolve)
		},{
			path:"/Brandadd",
			name:"Brandadd",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Parts/reference/Referencedetails/Brandadd'], resolve)
			// 添加品牌档案
		},{
			path:"/Brandedit",
			name:"Brandedit",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Parts/reference/Referencedetails/Brandedit'], resolve)
			// 修改品牌档案
		},{
			path:"/Measureadd",
			name:"Measureadd",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Parts/reference/Referencedetails/Measureadd'], resolve)
			// 添加计量单位
		},
		{
			path:"/picktime",
			name:"picktime",
			meta:{keepAlive:true},
			component:resolve => require(['./components/ceshi/picktime'], resolve)
			// 时间选择
		},
		{
			path:"/Measureedit",
			name:"Measureedit",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Parts/reference/Referencedetails/Measureedit'], resolve)
			// 修改计量单位
		},{
			path:"/EsLoan",
			name:"EsLoan",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Index/Workbench/EsLoan'], resolve)
			// 创建借款申请单
		},{
			path:"/EsLeave",
			name:"EsLeave",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Index/Workbench/EsLeave'], resolve)
			// 创建请假单
		},{
			path:"/Auxiliary",
			name:"Auxiliary",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Index/Accounts/Auxiliary'], resolve)
			// 账表
		},
		{
			path:"/commanreference",
			name:"commanreference",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Parts/reference/commanreference.vue'], resolve)  //参照
		},
		{
			path:"/input",
			name:"input",
			meta:{keepAlive:true},
			component:resolve => require(['./components/index/Workbench/InputAll'], resolve)  //Input参照
		},
        {
            path:"/ChooseCharges",
            name:"chooseCharges",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/ChooseCharges.vue'], resolve)  //人员参照多选
        },
        //Shiftstaff.vue
         {
            path:"/Shiftstaff",
            name:"Shiftstaff",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/Shiftstaff.vue'], resolve)  //人员参照多选
        },
        {
            path:"/ChooseExecutive",
            name:"chooseExecutive",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/ChooseExecutive.vue'], resolve)  //人员参照单选
        },
        {
            path:"/ChooseDepartment",
            name:"chooseDepartment",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/ChooseDepartment.vue'], resolve)  //选择部门树形
        },
        {
            path:"/ChooseListDepartment",
            name:"chooseListDepartment",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/ChooseListDepartment.vue'], resolve)  //选择部门列表
        },
		{
			path:"/esCost",
			name:"esCost",
			meta:{keepAlive:true},
			component:resolve => require(['./components/Index/Workbench/esCost.vue'], resolve)  //新建费用报销
		},
		{
			path:"/myMessage",
			name:"myMessage",
			meta:{keepAlive:false},
			component:resolve => require(['./components/Index/Mines/myMessage'], resolve)  //个人信息修改
		},
		/****************************** 公司信息 Start**********************************/
        {
            path:"/Mines/companyMessage/CompanyHomepage",
            name:"companyHomepage",
            component:resolve => require(['./components/Index/Mines/companyMessage/CompanyHomepage'], resolve),  //公司信息
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/CreateCompany",
            name:"createCompany",
            component:resolve => require(['./components/Index/Mines/companyMessage/CreateCompany'], resolve),  //创建公司信息
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/ModifyCompany",
            name:"modifyCompany",
            component:resolve => require(['./components/Index/Mines/companyMessage/ModifyCompany'], resolve),  //修改公司信息
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/AddManagerAndOrgnize",
            name:"addManagerAndOrgnize",
            component:resolve => require(['./components/Index/Mines/companyMessage/AddManagerAndOrgnize'], resolve),  //管理公司
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/AddPersonAndDepartment",
            name:"addPersonAndDepartment",
            component:resolve => require(['./components/Index/Mines/companyMessage/AddPersonAndDepartment'], resolve),  //管理组织架构
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/AddManager",
            name:"addManager",
            component:resolve => require(['./components/Index/Mines/companyMessage/AddManager'], resolve),  //设置管理员
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/AddPerson",
            name:"addPerson",
            component:resolve => require(['./components/Index/Mines/companyMessage/AddPerson'], resolve),  //添加员工
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/AddDepartment",
            name:"addDepartment",
            component:resolve => require(['./components/Index/Mines/companyMessage/AddDepartment'], resolve),  //添加部门
            meta:{keepAlive:true}
        },
        {
            path:"/Mines/companyMessage/ChooseCharges",
            name:"chooseCharges",
            component:resolve => require(['./components/Index/Mines/companyMessage/ChooseCharges'], resolve),  //选择人
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/ChooseDepartment",
            name:"chooseDepartment",
            component:resolve => require(['./components/Index/Mines/companyMessage/ChooseDepartment'], resolve),  //选择部门
            meta:{keepAlive:false}
        },
        /****************************** 公司信息 End**********************************/

        /****************************** 功能权限 Start**********************************/
        {
            path:"/Mines/companyMessage/Jurisdiction/PermissionsBranch",                                    //权限分支
            name:"permissionsBranch",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/PermissionsBranch'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/GroupPermissions",                                     //权限组
            name:"groupPermissions",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/GroupPermissions'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/PermissionsStaffDisplay",                                     //权限组的权限和人员展示
            name:"PermissionsStaffDisplay",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/PermissionsStaffDisplay'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/PermissionsGroupPersons",                                     //权限组选择人员
            name:"PermissionsGroupPersons",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/PermissionsGroupPersons'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/PermissionsPerson",                                     //选择人员设置权限
            name:"PermissionsPerson",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/PermissionsPerson'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/SettingPermissions",                                     //分配权限
            name:"SettingPermissions",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/SettingPermissions'], resolve),
            meta:{keepAlive:false}
        },
        {
            path:"/Mines/companyMessage/Jurisdiction/SettingPersonPermissions",                                     //分配权限
            name:"SettingPersonPermissions",
            component:resolve => require(['./components/Index/Mines/companyMessage/Jurisdiction/SettingPersonPermissions'], resolve),
            meta:{keepAlive:false}
        },
        /****************************** 功能权限 End**********************************/

        /****************************** 设置 Start**********************************/
        {
            path:"/Mines/Setting",
            name:"setting",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Index/Mines/Setting'], resolve)  //设置
        },
        {
            path:"/Mines/safe/Safe",
            name:"safe",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Index/Mines/safe/Safe'], resolve)  //账号与安全
        },
        {
            path:"/Mines/aboutUs/AboutUs",
            name:"aboutUs",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Index/Mines/aboutUs/AboutUs'], resolve)  //关于小蜜蜂风
        },
        {
            path:"/ceshi/addloan",
            name:"addLoan",
            meta:{keepAlive:true},
            component:resolve => require(['./components/Parts/edit/addLoan'], resolve)  //添加借款类型
        },
        {
            path:"/ceshi/Editloan",
            name:"xiugailoan",
            meta:{keepAlive:true},
            component:resolve => require(['./components/Parts/edit/Editloan'], resolve)  //修改借款类型
        },
         {
            path:"/establish/Crmcustomer",
            name:"Crmcustomer",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/edit/Crmcustomer'], resolve)  //客户档案
        },
         {
            path:"/establish/Addcrmcustomerm",
            name:"Addcrmcustomerm",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/edit/Addcrmcustomerm'], resolve)  //添加客户档案
        },
        {
            path:"/establish/Modifycrmcustomer",
            name:"Modifycrmcustomer",
            meta:{keepAlive:true},
            component:resolve => require(['./components/Parts/edit/Modifycrmcustomer'], resolve)  //完善客户档案
        },
        {
            path:"/ceshi/linkage",
            name:"linkage",
            meta:{keepAlive:false},
            component:resolve => require(['./components/ceshi/linkage'], resolve)  //联动
        },
        {
            path:"/Workattendance/clocknav",
            name:"clocknav",
            redirect: '/Workattendance/clocknav/Punchclock',
            meta:{keepAlive:false},
            component:resolve => require(['./components/Index/Workbench/Workattendance/clocknav'], resolve),  //打卡
            children:[
          			  {
			            path:"Punchclock",
			            name:"Punchclock",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Punchclock'], resolve)  //考勤
			        },
            		{
			            path:"Reportform",
			            name:"Reportform",
			            meta:{keepAlive:false},
			            redirect: '/Workattendance/clocknav/Reportform/Myreport',
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Reportform'], resolve), //报表
			            children:[
			            	{
				            	path:"Monthlyreport",
					            name:"Monthlyreport",
					            meta:{keepAlive:false},
					            component:resolve => require(['./components/Index/Workbench/Workattendance/clockcomponent/Monthlyreport'], resolve)  //月考勤
				            },
				            {
				            	path:"Myreport",
					            name:"Myreport",
					            meta:{keepAlive:false},
					            component:resolve => require(['./components/Index/Workbench/Workattendance/clockcomponent/Myreport'], resolve)   //我的考勤
				            }
			            ]
			        },
			        {
			            path:"Setup",
			            name:"Setup",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Setup'], resolve)  //设置
			        },
			        //worktimelist  Kqworktimeset
			        {
			            path:"worktimelist",
			            name:"worktimelist",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/worktimelist'], resolve)  //工作时间
			        },
			        {
			            path:"Kqworktimeset",
			            name:"Kqworktimeset",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Kqworktimeset'], resolve)  //工作时间
			        },
			        //Schedulinglist
			         {
			            path:"Schedulinglist",
			            name:"Schedulinglist",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Schedulinglist'], resolve)  //排班设置
			        },
			         {
			            path:"Scheduling",
			            name:"Scheduling",
			            meta:{keepAlive:true},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Scheduling'], resolve)  //排班设置
			        },
			         {
			            path:"Schedulingedit",
			            name:"Schedulingedit",
			            meta:{keepAlive:true},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Schedulingedit'], resolve)  //排班设置
			        },//choseSchedulingperson.vue
			        {
			            path:"choseSchedulingperson",
			            name:"choseSchedulingperson",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/choseSchedulingperson'], resolve)  //排班设置
			        },
			         {
			            path:"Workattendance",
			            name:"Workattendance",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Workattendance'], resolve)  //排班设置
			        },//Addworkattendance
			         {
			            path:"Addworkattendance",
			            name:"Addworkattendance",
			            meta:{keepAlive:false},
			            component:resolve => require(['./components/Index/Workbench/Workattendance/Addworkattendance'], resolve)  //排班设置
			        },
            ]
        },
        //Modifycrmcustomer.vue
        /****************************** 设置 End**********************************/

        /****************************** 工作台一级路由**********************************/
        //客户订单
        //作者：杜东宇
        {
            path:"/Ccustomerestablish",
            name:"Ccustomerestablish",
            meta:{keepAlive:true},
            component:resolve => require(['./components/Index/Workbench/Ccustomerestablish'], resolve)
        },
        {
        	path:"/productref",
        	name:"productref",
        	meta:{keepAlive:false},
        	component:resolve => require(['./components/Parts/reference/Referencedetails/Productref.vue'],resolve)
        },
        //integral
		{
        	path:"/integral",
        	name:"integral",
        	meta:{keepAlive:false},
        	redirect: '/integral/Addsubtraction',
        	component:resolve => require(['./components/Index/Workbench/integral/integral.vue'],resolve),
        	children:[
        		{
        			path:"Addsubtraction",
		        	name:"Addsubtraction",
		        	meta:{keepAlive:true},
		        	component:resolve => require(['./components/Index/Workbench/integral/Addsubtraction.vue'],resolve),  //加减分审批单
        		},
        		{
        			path:"Personalintegral",
		        	name:"Personalintegral",
		        	meta:{keepAlive:false},
		        	component:resolve => require(['./components/Index/Workbench/integral/Personalintegral.vue'],resolve),  //个人积分
        		},
        		{
        			path:"Integralstatistics",
		        	name:"Integralstatistics",
		        	meta:{keepAlive:false},
		        	component:resolve => require(['./components/Index/Workbench/integral/Integralstatistics.vue'],resolve), //积分统计
        		},
        		{
        			path:"Integralsetting",
		        	name:"Integralsetting",
		        	meta:{keepAlive:false},
		        	component:resolve => require(['./components/Index/Workbench/integral/Integralsetting.vue'],resolve), //积分设置
        		},
        		{
        			path:"Adddivideditem",
		        	name:"Adddivideditem",
		        	meta:{keepAlive:false},
		        	component:resolve => require(['./components/Index/Workbench/integral/integralcomponent/Adddivideditem.vue'],resolve), //积分设置
        		}
        		//Adddivideditem
        	
        	]
        },
         {
            path:"/holiday",
            name:"holiday",
            meta:{keepAlive:true},
            component:resolve => require(['./components/Parts/reference/Referencedetails/holiday.vue'], resolve)
        },
         {
            path:"/files",
            name:"files",
            meta:{keepAlive:false},
            component:resolve => require(['./components/Parts/reference/Referencedetails/files.vue'], resolve)
        },
//       {
//          path:"/picfile",
//          name:"picfile",
//          meta:{keepAlive:false},
//          component:resolve => require(['./components/Parts/reference/Referencedetails/picfile.vue'], resolve)
//      }
        /****************************** 工作台一级路由结束**********************************/
	]
	
}]

export default routes;
