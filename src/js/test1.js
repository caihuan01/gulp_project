let a =1;
let b= 3;
const index =2;

function log(num){
	for(let i=0; i<num; i++){
		setTimeout(function(){
			console.log(i);
		},1000)
	}
}

