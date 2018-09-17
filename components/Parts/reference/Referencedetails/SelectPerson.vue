<template>
    <div class="reference" @click.stop="selectPerson(index)">
        <p v-if="isRed" class="required" :style="mag ? `left:${mag}` : ''">*</p>
        <p :class="mag ? 'setMag' : ''">{{txt ? txt : '请设置您的txt属性'}}</p>
        <input type="text"
               disabled="false"
               :class="clas ? clas : ''"
               :data-test="txt ? txt : ''"
               :placeholder="plehoder ? plehoder:'请选择'"
               :value="user_names"
               :style="inpWidth ? `width:${inpWidth}` : ''
               ,mag ? 'margin-right:1.4rem' : 'margin-right:1.2rem'"
        />
        <i class="icon ion-ios-close" @click.stop="clearPerson(index)" v-if="persons.length !== 0 && !isRed"></i>
        <p class="fuhao" :style="mag ? `right:${mag}` : ''" v-else><i class="ion-chevron-right"></i></p>
    </div>
</template>

<script>
    export default {
        props:{
            isRed:{
                type:Boolean
            },
            inpWidth:{
                type:String
            },
            txt:{
                type:String
            },
            plehoder:{
                type:String
            },
            mag:{
                type:String
            },
            clas:{
                type:String
            },
            index:{
              type:Number
            },
            value:{
                default:[]
            },
        },
        computed:{
            user_ids:{
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    this.$emit('input', val);
                }
            }
        },
        data(){
            return {
                persons:[],                                      //input中显示选中的人
                user_names:"",
            }
        },
        activated(){
            if(sessionStorage.index != this.index){
                return
            }
            if(sessionStorage.selectPerson){
                this.persons = JSON.parse(sessionStorage.selectPerson);
                sessionStorage.removeItem("selectPerson");
                sessionStorage.removeItem("index");
            }
            console.log(this);
        },
        watch:{
            persons(){
                let arr = [];
                let brr = [];
                for(let i in this.persons){
                    arr.push(this.persons[i].user_id);
                    brr.push(this.persons[i].user_name);
                }
                this.user_ids = arr;
                this.user_names = brr.join(',');
                console.log(this.user_ids, this.user_names);
            }
        },
        methods:{
            selectPerson(){
                sessionStorage.index = this.index;
                this.$router.push({
                    path:'/ChooseCharges',
                    name:'chooseCharges',
                    params:{
                        id:1,                                               //1单选，2多选
                        name:"选择负责人",
                        user_id:this.user_ids
                    }
                })
            },
            clearPerson(){
                this.persons = this.user_names = this.user_ids = [];
            },
        },
    }
</script>

<style lang="less" scoped>
    .reference{
        width:100%;
        min-height:2.3rem;
        border-bottom:1px solid #eee;
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-size:0.65rem;
        position:relative;
        background:#ffffff;
        >.icon{
            position:absolute;
            right:.3rem;
            line-height: 2.3rem;
            font-size: 1rem;
            color: #666;
        }
    }
    .reference .required{
        height:2.3rem;
        position:absolute;
        top:0;
        left:0.5rem;
        margin:0;
        color:red;
    }
    .reference .fuhao{
        height:2.3rem;
        position:absolute;
        top:0;
        right:0.5rem;
        line-height:2.3rem;
    }
    .reference_top{
        margin-top:2.5rem;
    }
    .reference p{
        height:2.3rem;
        margin-left:1.15rem;
        /*line-height:2.3rem;*/
        color:#666;
        font-size:0.75rem;
        display: flex;
        align-items: center;
        &.setMag{
            margin-left:1.35rem
        }
    }
    .reference input{
        width:60%;
        height:2.3rem;
        text-align:right;
        font-size:0.75rem;
        margin-right:2.2rem;
        background: transparent;
        padding:0;
        color:#666;
        display: flex;
        align-items: center;
    }
</style>
