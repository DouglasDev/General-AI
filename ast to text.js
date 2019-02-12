function evaluateNode(node){
	if (node==undefined) return
	//console.log(node)
	//console.log(node.type)
	if (node.type=='num' || node.type=='var') return node.val
	else return typeToExpression[node.type](node)
}

//only take expressions
function returnValNode(node){
	return 'return '+ evaluateNode(node.children[0])
}

function equalsNode(node){
	return evaluateNode(node.children[0]) + ' == ' + evaluateNode(node.children[1])
}

function greaterNode(node){
	return evaluateNode(node.children[0]) +' > '+ evaluateNode(node.children[1])
}

function lesserNode(node){
	return evaluateNode(node.children[0]) +' < '+ evaluateNode(node.children[1])
}

function addNode(node){
	//console.log('add',node)
	return evaluateNode(node.children[0]) +' + '+ evaluateNode(node.children[1])
}

function subtractNode(node){
	//console.log('subtract',node)
	return evaluateNode(node.children[0]) +' - '+ evaluateNode(node.children[1])
}

//take arg other than expression
function declareNode(node){
	return 'let ' + evaluateNode(node.children[0]) +' = '+ evaluateNode(node.children[1])
}

function assignNode(node){
	return evaluateNode(node.children[0]) +' = '+ evaluateNode(node.children[1])
}

function ternaryNode(node){
	// console.log('ternary node',node)
	// console.log('ternary children',node.children)
	// console.log('ternary children[0] type',node.children[0].type)
	let condition = typeToCondition[node.children[0].type](node.children[0])
	return  condition + " ? " + evaluateNode(node.children[1]) + " : " + evaluateNode(node.children[2])
}

function callFunctionNode(node){
	//console.log('callFunctionNode',node)
	return "fib("+ evaluateNode(node.children[0]) + ")"
}

function pushToArrayNode(node){
	return "output.push(" + evaluateNode(node.children[0]) + ")"
}

let typeToAction = {'declareNode':declareNode,'assignNode':assignNode,
	'ternaryNode':ternaryNode,'callFunctionNode':callFunctionNode,
	'pushToArrayNode':pushToArrayNode,'returnValNode':returnValNode}
let typeToExpression = {'ternaryNode':ternaryNode,'addNode':addNode,'subtractNode':subtractNode,
	'callFunctionNode':callFunctionNode}
let typeToCondition = {'lesserNode':lesserNode,'greaterNode':greaterNode,'equalsNode':equalsNode}

function astToText(ast){
	let text = ""
	ast.children.forEach(child=>{
		//debugger
		//console.log(child.type)
		text += typeToAction[child.type](child) + '\n'
		//console.log(text)
	})
	return text
}