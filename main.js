function evaulateExpression(expression){
	if (typeof expression == "function") return expression()
	else return expression
}

//only take expressions
function returnVal(expression){
	return "return "+ evaulateExpression(expression)
}

function equals(expression1,expression2){
	return evaulateExpression(expression1) +' == ' + evaulateExpression(expression2)
}

function greater(expression1,expression2){
	return evaulateExpression(expression1) +' > ' + evaulateExpression(expression2)
}

function lesser(expression1,expression2){
	return evaulateExpression(expression1) +' < ' + evaulateExpression(expression2)
}

function add(expression1,expression2){
	return evaulateExpression(expression1) + " + " + evaulateExpression(expression2)
}

function subtract(expression1,expression2){
	return evaulateExpression(expression1) + " - " + evaulateExpression(expression2)
}

//take arg other than expression
function declare(variable,expression){
	return "let "+variable+" = "+ evaulateExpression(expression)
}

function assign(variable,expression){
	return variable+" = "+ evaulateExpression(expression)
}

function ternary(condition,trueExpression,elseExpression){
	return evaulateExpression(condition) + " ? " + evaulateExpression(trueExpression) + " : " + evaulateExpression(elseExpression)
}

function callFunction(functionName,expression1,expression2){
	return functionName +"("+ evaulateExpression(expression1) + ")"
	// expression2=evaulateExpression(expression2)
	// return functionName +"("+ expression1 + ", " + expression2 + ")"
}

function pushToArray(arr,expression){
	return arr + ".push(" + evaulateExpression(expression) + ")"
}

function doNothing(){
	return ""
}

//selector functions
function chooseRandomFromArr(arr){
	return arr[Math.round(Math.random()*(arr.length-1))]
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
	return chooseRandomFromArr(allowedVariables)
}

function chooseRandomNum(){
	let allowedNums=[-1,0,1]
	return chooseRandomFromArr(allowedNums)
}

function chooseRandomCondition(){
	return chooseRandomFromArr(conditions)(chooseExpression(),chooseExpression())
}


//let allExpressions = [add,subtract,ternary,callFunction,chooseExpression,chooseRandomNum,chooseRandomVar]
//let nonRecursiveExpression = [chooseRandomNum, chooseRandomVar]
//let allActions=[callFunction,assign,declare,pushToArray]



//random program
// let programActions = [
// 	()=>declare(chooseRandomVar(),chooseExpression()),
// 	()=>assign(chooseRandomVar(),chooseExpression()),
// 	()=>callFunction('fib',chooseExpression()),
// 	()=>returnVal(chooseExpression()),
// 	()=>ternary(chooseRandomCondition(),chooseExpression(),chooseExpression()),
// 	()=>pushToArray('output',chooseExpression()),
// 	()=>doNothing()
// ]

// let allRandomExpressions = [
// 	()=>add(chooseExpression,chooseExpression),
// 	()=>subtract(chooseExpression,chooseExpression),
// 	()=>ternary(chooseRandomCondition,chooseExpression,chooseExpression),
// 	()=>callFunction('fib',chooseExpression,chooseExpression),
// 	()=>chooseRandomNum(),
// 	()=>chooseRandomVar(),
// ]

// let randomNonRecursiveExpression = [()=>chooseRandomNum(), ()=>chooseRandomVar()]

// let conditions=[lesser,greater,equals]

// let program='function fib(a){\n'
// let opsLeft=10

// while (0<opsLeft){	
// 		program+= chooseRandomFromArr(programActions)()+"\n"
// 		opsLeft--
// 	}
// program+='}\n return output'
// console.log(program)


//selectable program
let programActions = [
	(expression,variable)=>declare(variable,expression),
	(expression,variable)=>assign(variable,expression),
	(expression)=>callFunction('fib',expression),
	(expression)=>returnVal(expression),
	(expression)=>pushToArray('output',expression),
	()=>doNothing()
]

let allExpressions = [
	(expression1,expression2)=>add(expression1,expression2),
	(expression1,expression2)=>subtract(expression1,expression2),
	(expression1,expression2)=>callFunction('fib',expression1,expression2),
	(expression1,expression2,condition)=>ternary(condition,expression1,expression2),
	"a","b","c",-1,0,1
]

let NonRecursiveExpression = ["a","b","c",-1,0,1]
//////////

let conditions=[lesser,greater,equals]

let program='function fib(a){\n'
let opsLeft=10

while (0<opsLeft){	
		program+= chooseRandomFromArr(programActions)()+"\n"
		opsLeft--
	}
program+='}\n return output'
console.log(program)