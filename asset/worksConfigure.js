const worksArr = [
  // {
  //     title:"常用",
  //     show:true,
  //     subIcon:[
  //         {
  //             name: "代办",
  //             icon:"icon-NeedToBeDealtWith",
  //             bgc: "#deb727",
  //             to: "/",
  //             show:true,
  //         },
  //         {
  //             name:'抄送我的',
  //             icon:'icon-CopyMe',
  //             bgc:'#46a4d4',
  //             to:"/",
  //             show:true,
  //         },
  //         {
  //             name: "通知",
  //             icon:"icon-NoticeWork",
  //             bgc: "#46a4d4",
  //             to: "/",
  //             show:true,
  //         },
  //         {
  //             name: "我的申请",
  //             icon:"icon-MyApplication",
  //             bgc: "#45a377",
  //             to: "/",
  //             show:true,
  //         },
  //     ]
  // },
  {
    title: "智能财务",
    show: true,
    subIcon: [
      {
        name: '费用报销',
        icon: 'icon-ExpenseReimbursement',
        bgc: '#45a377',
        to: "/esCost",
        id: 1007010,
        show: false,
      },
      {
        name: "营业收入",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
      {
        name: "付款申请",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
      {
        name: "存货",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
      {
        name: "报表",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
    ]
  },
  {
    title: "销售管理",
    show: true,
    subIcon: [
      {
        name: "客户订单",
        icon: "icon-CustomerOrder",
        bgc: "#deb727",
        to: "/Ccustomerestablish",
        id: 1010010,
        show: false,
      },
      {
        name: "销售出库单",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
      {
        name: "销售退货单",
        icon: "",
        bgc: "#eeeeee",
        to: "/",
        show: true,
      },
    ]
  },
  {
    title: "采购管理",
    show: true,
    subIcon: [
      {
        name: '采购订单',
        icon: '',
        bgc: '#eeeeee',
        to: "/",
        show: true,
      },
      {
        name: '采购入库单',
        icon: '',
        bgc: '#eeeeee',
        to: "/",
        show: true,
      },
      {
        name: '采购退货单',
        icon: '',
        bgc: '#eeeeee',
        to: "/",
        show: true,
      },
    ]
  },
  {
    title: "人事行政",
    show: true,
    subIcon: [
      {
        name: '考勤',
        icon: 'icon-CheckWorkAttendance',
        bgc: 'rgb(76, 190, 215)',
        to: "/Workattendance/clocknav",
        id: 1004000,
        show: false,
      },
      {
        name: 'KPI积分',
        icon: 'icon-integral',
        bgc: '#deb727',
        to: "/integral",
        id: 1005000,
        show: false,
        child: [
          {
            name: '积分申请',
            icon: 'icon-AccountTable',
            bgc: 'rgb(222, 183, 39)',
            to: "Addsubtraction",
            id: 1005020,
            show: false,
          },
          {
            name: '我的积分',
            icon: 'icon-PersonalIntegral',
            bgc: 'rgb(70, 164, 212)',
            to: "Personalintegral",
            id: 1005030,
            show: false,
          },
          {
            name: '积分统计',
            icon: 'icon-PersonalStatistics',
            bgc: '#45a377',
            to: "Integralstatistics",
            id: 1005040,
            show: false,
          },
          {
            name: '积分设置',
            icon: 'icon-SetUp',
            bgc: 'rgb(76, 190, 215)',
            to: "Integralsetting",
            id: 1005010,
            show: false,
          },
        ]
      },
      {
        name: '请假单',
        icon: 'icon-LeaveApplication',
        bgc: '#46a4d4',
        to: "/EsLeave",
        id: 1006010,
        show: false,
      },
      {
        name: '组织架构',
        icon: 'icon-organizationalStructure',
        bgc: '#45a377',
        to: "/Mines/companyMessage/AddPersonAndDepartment",
        id: 1002000,
        show: false,
      },
      {
        name: '智能工资',
        icon: '',
        bgc: '#eeeeee',
        to: "/",
        show: true,
      },
    ]
  },
  {
    title: "功能权限",
    show: true,
    id: 1001040,
    subIcon: [
      {
        name: '组权限',
        icon: 'icon-GroupPermissions',
        bgc: '#deb727',
        to: "/Mines/companyMessage/Jurisdiction/GroupPermissions",
        show: true,
      },
      // by lwq 注释 2018-06-07
      // 人员权限先去掉，暂时先不支持这个功能
      // {
      //     name:'人员权限',
      //     icon:'icon-HumanRights',
      //     bgc:'#45a377',
      //     to:"/Mines/companyMessage/Jurisdiction/PermissionsPerson",
      //     show:true,
      // },
    ]
  },
  {
    title: "参照管理",
    show: true,
    subIcon: [
      {
        name: '参照信息',
        icon: 'icon-ExpenseReimbursement',
        bgc: '#deb727',
        to: "/commanreference",
        show: true,
      },
      {
        name: 'Input参照',
        icon: 'ion-heart',
        bgc: 'rgb(76, 190, 215)',
        to: "/input",
        show: true,
      },
      {
        name: '上传图片',
        icon: 'icon-ExpenseReimbursement',
        bgc: '#deb727',
        to: "/picfile"
      },
      {
        name: '上传文件',
        icon: 'icon-ExpenseReimbursement',
        bgc: '#deb727',
        to: "/files"
      }
    ]
  },
]

export default worksArr;
