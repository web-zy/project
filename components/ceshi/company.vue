<template>
    <div class="prcontent">
        <div class="popup">
            <div class="procont">
                <ul>
                    <li v-for="(val,index) in lists"  :class="{ss:val.istrue}"  @click.stop="get(val,index)">
                        <p>{{val.name}}</p>
                        <p class="deletes" @click.stop="deletes(val,index)" v-if="isedit">×</p>
                    </li>
                </ul>
                <div class="buttons">
                    <button class="btn" @click.stop="edit" v-if="!isedit">编辑</button>
                    <button class="btn" v-if="isedit" @click.stop="add">添加</button>
                    <button class="btn" v-if="isedit" @click.stop="completes">完成</button>
                </div>

            </div>
        </div>

    </div>

</template>

<script>
    import Vue from 'vue'
    import api from '../../asset/api.js'
    import utrl from '../../controller/utrl.js'
    export default{
        data(){
            return {
                lists:[

                ],
                index:"",
                isedit:false,
                company_id:"",
                company_name:"",
                user_id:""
            }
        },
        props:["parameter"],
        mounted(){
            console.log(this.parameter)
            this.getuser()
            this.getcommpy()
            this.isedit=false
        },
        methods:{
            //获取userid
            async getuser(){
                var url = "users/current?token=" + api.token
                let res = await api.get(url);
                this.user_id=res.data.id
            },
            //获取公司id
            async getcommpy(){
                let url="users/current/mycompanies?token="+api.token
                let res=await api.get(url)
                if(res.status >= 200 && res.status < 300){
                    var data=res.data[0]
                }else{
                    $toast.show(res.data.errmsg + "，请重试！", 3000).then(() => {})
                    return
                }
                console.log(res)
                this.company_id=data.company_id
                this.company_name=data.company_name
                //获取借款类型数据
                let loanurl="loantypes?token="+api.token+"&company_id="+this.company_id;
                let loanres=await api.get(loanurl)
                console.log(loanres)
                if(loanres.status >= 200 && loanres.status < 300){
                    this.lists=loanres.data
                }else{
                    $toast.show(loanres.data.errmsg + "，请重试！", 3000).then(() => {})
                    return
                }
                for(var i=0;i<this.lists.length;i++){
                    this.lists[i].istrue=false
                    //Vue.set(this.lists[i],'istrue',true)
                }
            },



            /*	pick(index){
                    if(this.isedit==false){
                        for(var i=0;i<this.lists.length;i++){
                            this.lists[i].istrue=false
                            if(index==i){
                                //Vue.set(this.lists[i],istrue,true);
                                this.lists[i].istrue=true
                            }
                        }
                    }
                },*/
            get(val,index){
                this.index=index
                if(this.isedit==false){
                    for(var i=0;i<this.lists.length;i++){
                        this.lists[i].istrue=false
                        if(index==i){
                            //Vue.set(this.lists[i],'istrue',true)
                            this.lists[i].istrue=true
                            this.$emit('my-event',val,this.parameter)
                        }
                    }
                }else{
                    for(var i=0;i<this.lists.length;i++){
                        this.lists[i].istrue=false
                        if(index==i){

                            Vue.set(this.lists[i],'istrue','true')
                            //this.lists[i].istrue=true
                            this.$router.push({name:"xiugailoan",params:{obj:val}})
                        }
                    }
                }

            },
            edit(){
                this.isedit=true
            },
            async deletes(val,index){
                $dialog.confirm({
                    // 设置为ios样式
                    theme: 'ios',
                    // 标题
                    title: '确定删除吗?',
                    // 取消按钮文本
                    cancelText: '取消',
                    // 确定按钮文本
                    okText: '确定'
                }).then(async (res) => {
                    //console.log('confirm result: ', res)
                    if(res==true){
                        //this.lists.splice(index,1)
                        console.log(val)
                        let bizid=utrl.setbizid();
                        let url="loantypes/"+val.id+"?bizid="+bizid+"&token="+api.token+"&company_id="+this.company_id;
                        let res=await api.delete(url);
                        for(var i=0;i<this.lists.length;i++){
                            if(i==index){
                                this.lists.splice(index,1)
                            }
                        }
                    }
                })
            },
            add(){
                this.$router.push({name:"addLoan",params:{company_id:this.company_id,company_name:this.company_name,user_id:this.user_id}})
            },
            completes(){
                console.log(11)
                this.isedit=false
                this.getcommpy()
                //this.$router.push({name:"commanreference",params:{istrue:true}})
            }
        }
    }
</script>

<style lang="less" scoped>
    .prcontent{
        position:fixed;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,.2);
        top:0;
        left:0;
    }
    .procont{
        position:absolute;
        right:1%;
        top:20%;
        width:9rem;
        background:white;
        padding-bottom:0.1rem;
        margin-bottom:0.5rem;
    }
    .popup ul li{
        padding:0 0.75rem;
        list-style:none;
        line-height:2rem;
        font-size:0.8rem;
        position:relative;
    }
    .popup ul li p{
        text-indent:0.1rem;
        box-sizing: border-box;
        border-bottom:1px solid #eee;
    }

    .deletes{
        position:absolute;
        right:0.9rem;
        top:0;
    }
    .buttons{
        width:100%;
        display:flex;
        justify-content: space-around;
        margin-bottom:0.2rem;
        margin-top:0.5rem;
    }
    .buttons .btn{
        display:block;
        border:0;
        text-align:center;
        line-height:1rem;
        height:1.4rem;
        padding:0 0.9rem;
        border-radius:0.7rem 0.7rem;
        border:1px solid #f2ad06;
        background:transparent;
    }
    .ss{
        background:pink;
    }
    .fade-enter-active, .fade-leave-active {
        left:0;
        top:0%;
        opacity: 1;
        transition: all 0.7s;
    }
    .fade-enter, .fade-leave-to {
        top:0%;
        left:100%;
        opacity: 0;
    }
</style>