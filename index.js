import utrl from "./controller/utrl.js"

if(localStorage.pass){
	let res = utrl.signIn({
        uid:localStorage.user,
        password:localStorage.pass
    })
}