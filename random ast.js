function evaluateExpression(expression){
	if (typeof expression == "function"){
		state=expression()
		return state
	} 
	else {
		state=expression
		return expression
	}
}

class Node{
	constructor(type,val,children){
		this.type=type
		this.val=val
		if (children) this.children=children
		else this.children=[]
	}
	addChild(node){
		this.children.push(node)
	}
	output(){
		console.log(this.type,this.val,this.children)
	}
}


//only take expressions
function returnVal(expression){
	// expression = evaluateExpression(expression)
	return new Node('returnValNode',null,[evaluateExpression(expression)])
}

function equals(expression1,expression2){
	return new Node('equalsNode',null,[evaluateExpression(expression1),evaluateExpression(expression2)])
}

function greater(expression1,expression2){
	return new Node('greaterNode',null,[evaluateExpression(expression1),evaluateExpression(expression2)])
}

function lesser(expression1,expression2){
	return new Node('lesserNode',null,[evaluateExpression(expression1),evaluateExpression(expression2)])
}

function add(expression1,expression2){
	return new Node('addNode',null,[evaluateExpression(expression1),evaluateExpression(expression2)])
}

function subtract(expression1,expression2){
	return new Node('subtractNode',null,[evaluateExpression(expression1),evaluateExpression(expression2)])
}

//take arg other than expression
function declare(variable,expression){
	return new Node('declareNode',null,[variable,evaluateExpression(expression)])
}

function assign(variable,expression){
	return new Node("assignNode",null,[variable,evaluateExpression(expression)])
}

function ternary(condition,trueExpression,elseExpression){
	//return evaluateExpression(condition) + " ? " + evaluateExpression(trueExpression) + " : " + evaluateExpression(elseExpression)
//condition
	return new Node('ternaryNode',null,
		[evaluateExpression(condition),evaluateExpression(trueExpression),evaluateExpression(elseExpression)])
}

function callFunction(expression){
	//return functionName +"("+ evaluateExpression(expression1) + ")"
	return new Node('callFunctionNode',null,[evaluateExpression(expression)])
}

function pushToArray(arr,expression){
	//return arr + ".push(" + evaluateExpression(expression) + ")"
	return new Node('pushToArrayNode',null,[evaluateExpression(expression)])
}

function doNothing(){
	state='nothing'
	//console.log(state)
	return undefined
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
	return new Node('var',chooseRandomFromArr(allowedVariables))
}

function chooseRandomNum(){
	let allowedNums=[-1,0,1]
	return new Node('num',chooseRandomFromArr(allowedNums))
}

function chooseRandomCondition(){
	//return chooseRandomFromArr(conditions)(chooseExpression(),chooseExpression())
	return new Node(chooseRandomFromArr(conditions),null,[chooseExpression(),chooseExpression()])
}


//let allExpressions = [add,subtract,ternary,callFunction,chooseExpression,chooseRandomNum,chooseRandomVar]
//let nonRecursiveExpression = [chooseRandomNum, chooseRandomVar]
//let allActions=[callFunction,assign,declare,pushToArray]

//random seed program
let programActions = [
	()=>declare(chooseRandomVar(),chooseExpression()),
	()=>assign(chooseRandomVar(),chooseExpression()),
	()=>callFunction(chooseExpression()),
	()=>returnVal(chooseExpression()),
	()=>ternary(chooseRandomCondition(),chooseExpression(),chooseExpression()),
	()=>pushToArray('output',chooseExpression()),
	()=>doNothing()
]

let allRandomExpressions = [
	()=>add(chooseExpression,chooseExpression),
	()=>subtract(chooseExpression,chooseExpression),
	()=>ternary(chooseRandomCondition,chooseExpression,chooseExpression),
	()=>callFunction(chooseExpression),
	()=>chooseRandomNum(),
	()=>chooseRandomVar(),
]

let randomNonRecursiveExpression = [()=>chooseRandomNum(), ()=>chooseRandomVar()]
//

//debugger
let conditions=['lesserNode','greaterNode','equalsNode']
let opsLeft, state
for(let i=0;i<100;i++){
	let rootNode= new Node('topLevel',null,[]);
	let program='let output = [];\nfunction fib(a){\n'
	opsLeft=30, state=0
		try {
			while (0<opsLeft){
			//	debugger
				let child=chooseRandomFromArr(programActions)()
				if (child) rootNode.addChild(child)
				opsLeft--
			}
			  program+=astToText(rootNode)+'}\n return output'
			  console.log(rootNode,program)
		}
		catch(error) {
			console.log(error)
		}
}

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