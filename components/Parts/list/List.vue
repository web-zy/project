<template>
	<div class="bee-list">
        <slot></slot>
    </div>
</template>

<script>
	export default{
		data(){
			return{
				// model:this.value,
				inpShow:false
			}
		},
	    provide() {
			return {
				beeForm: this
			};
		},
		props:{
			"rules":Object
		},
		mounted(){
			// console.log(this.$children)
			// console.log(this.value)
		},
		methods:{
			validate(trigger){
				// console.log(trigger)
				const blur = this.getFilteredRule()
				trigger ? trigger(blur) : (() => {
					console.log('未传入回掉函数，这里是默认函数')
				})()
			},
			getFilteredRule(){
                let _this = this;
				let a = 0;
                for(let j in this.$children){
                    if(!this.$children[j].beeForm) continue
                    this.$children[j].validate() ? "" : a++ ;
                    if(a>0){
                        $dialog.alert({
                        	theme: 'ios',
                        	title: '警告',
                        	content: _this.rules[_this.$children[j].prop].message,
                        	okText: '确定'
                        })
                        break
                        // return false
                    }
                }
                
                
                
                
				/*for(let j in this.$children){
					let val = this.$children[j].childData;
					for(let i in this.rules){
						let rules = this.rules[i];
						if(this.$children[j].prop == i){
							let reg = eval("/" + rules.regular + "/");
							if(!reg.test(val)){
								a += 1;
								$dialog.alert({
									theme: 'ios',
									title: '警告',
									content: rules.message,
									okText: '确定'
								})
								return
							}
						}
					}
				}*/
				return a > 0 ? false : true
			}
		},
	}
</script>

<style rel="stylesheet/less" scoped>

</style>