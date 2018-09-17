<template>
	<div class="bee-form-item">
		<!--<i v-if="verify.must" class="ion-asterisk"></i>-->
		<slot :ref="aaa"></slot>
	    <transition name="el-zoom-in-top">
			<!--<div class="bee-form-item__error" v-if="validateState === 'error'">
				{{validateMessage}}
			</div>-->
		</transition>
	</div>
</template>

<script>
	export default{
    name:"beeItem",
		data(){
			return{
				modelData:'',
				inpShow:false,
				validateState:'',
				childData:null
			}
		},
		computed:{
			verify(){
				let obj = {}
				let thisIndex = this.prop;
				for(let i in this.beeForm.rules){
					if(thisIndex == i){
						obj = this.beeForm.rules[i]
					}
				}
				return obj
			},
			validateMessage(){
				// console.log(this.verify.trigger)
				return this.verify.message ? this.verify.message : ''
			},
			// childData: {
	  //           // model
	  //           get:function() {
	  //               return this.value;
	  //           }
	  //       }
		},
		provide(){
			return{
				beeFormItem:this,
				modelData:this.modelData
			}
		},
	 	inject: ['beeForm'],
		props:['value','model','prop'],
		mounted(){
            if(this.verify.must){
                let must = document.createElement("i");
                must.className = 'ion-asterisk'
                console.log(887)
                console.log( this.$children)
                this.$children[0].$el.getElementsByTagName('label')[0].appendChild(must)
            }
		},
		watch:{
			// childData(val){
			// 	// console.log(val)
			// }
		},
		methods:{
			change(){
				// console.log(1)
			},
			validate(){ //val
        if(!this.prop) return true
        let val = this.childData
        if(val){
          if(!this.verify.regular){
            return true
          }
          let reg = eval("/" + this.verify.regular + "/");
          return reg.test(val) ? true : false
        }else{
          let a = 0;
          this.verify.must ? a++ : ""
          return a > 0 ? false : true
        }
			}
		},
	}
</script>

<style lang="less" scoped>
	.bee-form-item{
		position: relative;
		width:100%;
		background:#fff;
		// padding-left:0.5rem;
		.ion-asterisk{
			position:absolute;
			color:red;
			left:0.25rem;
			top:50%;
			font-size:1rem;
			transform: translate(0,-50%) scale(0.4);
            z-index: 2;
		}
		.bee-form-item__error{
			display:block;
			width:60%;
			height:1.5rem;
			background:rgba(6,6,6,0.2);
			text-align:center;
			line-height:1.5rem;
			border-radius:0.5rem;
			color: red;
			font-size: 0.6rem;
			position: absolute;
			top: -30%;
			left: 50%;
			transform: translate(-50%,0);
			&:after{
				content:"";
				position:absolute;
				top:100%;
				left:50%;
				width:0rem;
				height:0rem;
				border:0.3rem solid rgba(0,0,0,0.2);
				border-left-color:transparent;
				border-top-color:transparent;
				transform:rotate(45deg) translate(-50%,-20%);
			}
		}
	}
</style>