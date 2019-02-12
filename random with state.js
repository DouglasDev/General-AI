function evaulateExpression(expression){
	if (typeof expression == "function"){
		state=expression()
		return state
	} 
	else {
		state=expression
		return expression
	}
}

//only take expressions
function returnVal(expression,parent){
	expression = evaulateExpression(expression)
	let node = new Node(expression)
	//parent.addChild('val',expression)
	return "return "+ expression
}

function equals(expression1,expression2,parent){
	expression1 = evaulateExpression(expression1)
	expression2 = evaulateExpression(expression2)

	//parent.addChild('equals','==',expression1,expression2)
	return expression1 +' == ' + expression1
}

function greater(expression1,expression2,parent){
	expression1 = evaulateExpression(expression1)
	expression2 = evaulateExpression(expression2)
	//parent.addChild('equals','==',expression1,expression2)
	return evaulateExpression(expression1) +' > ' + evaulateExpression(expression2)
}

function lesser(expression1,expression2,parent){
	return evaulateExpression(expression1) +' < ' + evaulateExpression(expression2)
}

function add(expression1,expression2,parent){
	return evaulateExpression(expression1) + " + " + evaulateExpression(expression2)
}

function subtract(expression1,expression2,parent){
	return evaulateExpression(expression1) + " - " + evaulateExpression(expression2)
}

//take arg other than expression
function declare(variable,expression,parent){
	return "let "+variable+" = "+ evaulateExpression(expression)
}

function assign(variable,expression,parent){
	return variable+" = "+ evaulateExpression(expression)
}

function ternary(condition,trueExpression,elseExpression,parent){
	return evaulateExpression(condition) + " ? " + evaulateExpression(trueExpression) + " : " + evaulateExpression(elseExpression)
}

function callFunction(functionName,expression1,parent){
	return functionName +"("+ evaulateExpression(expression1) + ")"
}

function pushToArray(arr,expression,parent){
	return arr + ".push(" + evaulateExpression(expression) + ")"
}

function doNothing(){
	state='nothing'
	//console.log(state)
	return ""
}

//selector functions
function chooseRandomFromArr(arr){
	state=arr[Math.round(Math.random()*(arr.length-1))]
	//if (typeof state == "function")console.log(state)
	return state
}

function chooseExpression(){
	if (0<opsLeft) {
		opsLeft--
		return chooseRandomFromArr(allRandomExpressions)()
	}
	else return chooseRandomFromArr(randomNonRecursiveExpression)()
}


function chooseRandomVar(){
	let allowedVariables=['a','b','c']
	state=chooseRandomFromArr(allowedVariables)
	//console.log(state)
	return state
}

function chooseRandomNum(){
	let allowedNums=[-1,0,1]
	state=chooseRandomFromArr(allowedNums)
	//console.log(state)
	return state
}

function chooseRandomCondition(){
	return chooseRandomFromArr(conditions)(chooseExpression(),chooseExpression())
}

class Node{
	constructor(type,val){
		this.type=type
		this.val=val
		this.children=[]
	}
	addChild(node){
		this.children.push(node)
	}
	output(){
		console.log(this.type,this.val,this.children)
	}
}

//let allExpressions = [add,subtract,ternary,callFunction,chooseExpression,chooseRandomNum,chooseRandomVar]
//let nonRecursiveExpression = [chooseRandomNum, chooseRandomVar]
//let allActions=[callFunction,assign,declare,pushToArray]

//random seed program
let programActions = [
	()=>declare(chooseRandomVar(),chooseExpression()),
	()=>assign(chooseRandomVar(),chooseExpression()),
	()=>callFunction('fib',chooseExpression()),
	()=>returnVal(chooseExpression()),
	()=>ternary(chooseRandomCondition(),chooseExpression(),chooseExpression()),
	()=>pushToArray('output',chooseExpression()),
	()=>doNothing()
]

let allRandomExpressions = [
	()=>add(chooseExpression,chooseExpression),
	()=>subtract(chooseExpression,chooseExpression),
	()=>ternary(chooseRandomCondition,chooseExpression,chooseExpression),
	()=>callFunction('fib',chooseExpression,chooseExpression),
	()=>chooseRandomNum(),
	()=>chooseRandomVar(),
]

let randomNonRecursiveExpression = [()=>chooseRandomNum(), ()=>chooseRandomVar()]
//



let conditions=[lesser,greater,equals]
let opsLeft, state, genome=[]
let iterations=10000
let rootNode= new Node('topLevel',null,[]);
for(let i=0;i<100;i++){
		try {
			let program='let output = [];\nfunction fib(a){\n'
			opsLeft=30, state=0

			//debugger
			while (0<opsLeft){
				state=chooseRandomFromArr(programActions)
				//let node=state()
				rootNode.addChild(state)
				//console.log(rootNode)
				program+= state()+"\n"
				opsLeft--
			}
			program+='}\n fib(10) \n console.log(output) \n return output'
			//console.log(program)

			  let out = new Function(program)();
			  console.log(program)
			  console.log(rootNode)
			  //console.log('fitness:',fitness([1,1,2,3,5,8,13,21,34,55],out))
			  console.log('fitness:',fitness([1,2,3,4,5,6,7,8,9,10],out))
			  //setTimeout(function(){},500)
		}
		catch(error) {
			//console.log(error)
		  //eval(program)
		  // expected output: ReferenceError: nonExistentFunction is not defined
		  // Note - error messages will vary depending on browser
		}
}
//getSeedGenome()


function fitness(modelArr,actual){
	let fitVal=200 - Math.abs(modelArr.length-actual.length)*10
	for (let i=0;i<modelArr.length;i++){
		if (typeof actual[i] == typeof modelArr[i]){
			fitVal-=Math.abs(modelArr[i]-actual[i])
		}
		else{fitVal-=10}
	}
	return fitVal
}

