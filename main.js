class Node{
	constructor(category,type,val,children){
		this.category = category
		this.type=type
		this.val=val
		if (children) this.children=children
		else this.children=[]
	}
	addChild(node){
		this.children.push(node)
	}
	addChildInRandomPosition(node){
		if (this.children.length === 0) {
			this.children = [node]
		} else {
			let randIndex = nSidedDie(this.children.length + 1)
			this.children= this.children
				.slice(0,randIndex)
				.concat([node])
				.concat(this.children.slice(randIndex))
		}
	}
	output(){
		console.log(this.type,this.val,this.children)
	}
}

let opsLeft
let currentGeneration=[]

function startEvolving(numberOfGenerations){
	for(let i=0;i<500;i++){
		let treeRoot = generateSeedTree(20,MAX_NUMBER_OF_INITIAL_ACTIONS)
		let program = generateProgram(treeRoot)
		let output = evaluateProgram(program)
		if (output) {
			//console.log(treeRoot)
			//console.log(program)
			//console.log('output: ',output)
			let fitVal = fitness([1,1,2,3,5,8,13,21,34,55],output)
			currentGeneration.push(
				{"tree":treeRoot,
				"fitness":fitVal
				}
			)
		}
	}

	for (let gen=0;gen<numberOfGenerations;gen++){
		console.log('genNumber ',gen)
		currentGeneration= evolveNextGeneration(currentGeneration)
	}
}

const MAX_NUMBER_OF_INITIAL_ACTIONS = 10
//GREATER value = higher mutation rate, minimum val=2
const MUTATE_LOWER_LEVEL_EXPRESSION_RATE = 4 
//LOWER value = higher mutation rate, minimum val=2
const TOP_LEVEL_MUTATION_RATE = 20
const MAX_DESCENT_DEPTH=4
const MAX_ADDITION_DEPTH=4
const NUM_OF_GENERATIONS=400
let highestFitness=0;
startEvolving(NUM_OF_GENERATIONS)


function evolveNextGeneration(prevGeneration){
	let totalFitness = 0
	prevGeneration.forEach(program=>{
		if (program.fitness) totalFitness+=program.fitness
	})
	let avgFitness = totalFitness/prevGeneration.length
	console.log('avgFitness ',avgFitness)

	let sortedGen = prevGeneration.sort((a,b)=>{return b.fitness - a.fitness})

	//console.log(sortedGen)
	let nextGen=[],index=0
	for (let i=0;i<400;i++){
		if (i%40==0)index+=1
		if (!sortedGen[index]) {
			index+=1
			continue
		}
		nextGen.push(sortedGen[index])
		let mutatedSurvivorTree = selectMutationType(sortedGen[index].tree,MAX_DESCENT_DEPTH,MAX_ADDITION_DEPTH)
		// if (mutatedSurvivorTree){
			let program = generateProgram(mutatedSurvivorTree)
			let output = evaluateProgram(program)
			if (output) {
				//console.log(treeRoot)
				//console.log(program)
				//console.log('output: ',output)
				let fitVal = fitness([1,1,2,3,5,8,13,21,34,55],output)
				if (fitVal>highestFitness){
					highestFitness=fitVal
					console.log(program)
					console.log('output: ',output)
					console.log("current fittest program: ",fitVal)
				}
				nextGen.push(
					{"tree":mutatedSurvivorTree,
					"fitness":fitVal
					}
				)
			}
		// }
	}
	//nextGen.push(selectMutationType(sortedGen[index].tree,10,5))
	//console.log(nextGen)
	return nextGen
}





function evaluateProgram(program){
	try{
		let output= new Function(program)
		return output()
	}
	catch(error){
		return undefined
	}
}

function generateSeedTree(maxDepth,maxNumberOfActions){
	let numberOfActions = nSidedDie(maxNumberOfActions)+1
	let rootNode= new Node('topLevel',null,[]);
	while (0<numberOfActions){
		opsLeft=maxDepth
		let child=chooseRandomFromArr(programActions)()
		if (child) rootNode.addChild(child)
		numberOfActions--
	}
	return rootNode
}

function generateProgram(rootNode){
	let program='let output = [];\nfunction fib(a){\n'
	program+=astToText(rootNode)+'}\nfib(10)\n return output'
	return program
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

function nSidedDie(n){
	if (n === 0 || n === 1) return 0;
	return Math.round(Math.random()*(n-1))
}


// let treeRoot = generateSeedTree(20)
// let program = generateProgram(treeRoot)
// console.log(treeRoot)
// console.log(program)
// let mutated = selectMutationType(treeRoot,10,10)
// console.log(mutated)
// console.log(generateProgram(mutated))


function selectMutationType(rootNode,maxDescentDepth,maxAdditionDepth){
	let choice = nSidedDie(MUTATE_LOWER_LEVEL_EXPRESSION_RATE)
	if (choice==1) rootNode = MutateTopLevelAction(rootNode,maxDescentDepth)
	else if (choice>=2) {
		rootNode = MutateLowerLevelExpression(rootNode,maxDescentDepth,maxAdditionDepth)
	}

	return rootNode
}

//action mutations
function MutateTopLevelAction(rootNode,maxDepth){
	let choice = nSidedDie(TOP_LEVEL_MUTATION_RATE)
	if (choice==2 && rootNode.children.length>1) rootNode = deleteRandomAction(rootNode)
	else if (choice==1) rootNode = replaceRandomAction(rootNode,maxDepth)
	else if (choice==0) rootNode = addRandomAction(rootNode,maxDepth)
	return rootNode
}

function deleteRandomAction(rootNode){
	let choice = nSidedDie(rootNode.children.length)
	//console.log("deleteRandomAction choice",choice)
	//console.log("before",rootNode)
	rootNode.children.splice(choice,1)
	//console.log("after",rootNode)
	return rootNode
}

function addRandomAction(rootNode,maxDepth){
	opsLeft=maxDepth
	let child=chooseRandomFromArr(programActions)()
	if (child) {
		rootNode.addChildInRandomPosition(child)
	}
	return rootNode
}

function replaceRandomAction(rootNode,maxDepth){
	opsLeft=maxDepth
	let child=chooseRandomFromArr(programActions)()
	let choice = nSidedDie(rootNode.children.length)
	rootNode.children[choice]=child
	return rootNode
}

///expression and conditional mutations
function MutateLowerLevelExpression(rootNode,maxDescentDepth,maxAdditionDepth){
	if (!rootNode) return
	let roll = nSidedDie(rootNode.children.length)
	let child = rootNode.children[roll]
	let randomDescentDepth=Math.max(1, nSidedDie(maxDescentDepth))
	let randomAdditionDepth=nSidedDie(maxAdditionDepth)
	let newNode = descendToDepthAndMutate(child,randomDescentDepth,randomAdditionDepth)
	rootNode.children[roll] = newNode
	return rootNode
}

function descendToDepthAndMutate(node,descentDepth,AdditionDepth){
		if (descentDepth>0 && node.children!=null && node.children.length !== 0){

			let roll = nSidedDie(node.children.length)
			let child = node.children[roll]
			// console.log('node.children',node.children,'roll',roll)
			// console.log('node.children[roll]',node.children[roll])
			if (node.children.length == 0) debugger
			roll
			let deepResult = descendToDepthAndMutate(
				child,
				descentDepth-1,
				AdditionDepth
			)

			node.children[roll] = deepResult
			return node
		}
		else return mutate(node,AdditionDepth)
}

function mutate(node,maxExtraDepth){
	opsLeft = maxExtraDepth
	if (node.category=="expression") return chooseExpression()
	else if (node.category=="condition") return chooseRandomFromArr(conditions)
	else if (node.category=="conditionParent") return chooseRandomCondition()
}