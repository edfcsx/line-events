import * as lvt from './main'

beforeEach(() => {
	lvt.clearAll()
})

it('should create a new node and ensure create new line and node', () => {
	const lineEvts = lvt.create()
	lineEvts.createNode('any_line', (p) => {})

	expect(lineEvts["_rep"]["_events"]).toHaveProperty('any_line')
	const lineSize = Object.keys(lineEvts["_rep"]["_events"]["any_line"]).length
	expect(lineSize).toBe(1)
})

it('should create a new node and on destroy ensure remove all created nodes', () => {
	const lineEvts = lvt.create()
	lineEvts.createNode('any_line', (p) => {})

	expect(lineEvts["_rep"]["_events"]).toHaveProperty('any_line')

	lineEvts.destroy()

	expect(lineEvts["_rep"]["_events"]["any_line"]).toEqual({})
})

it('should create multiple nodes in the same line and ensure destroy dont remove other nodes', () => {
	const lineEvts = lvt.create()
	lineEvts.createNode('any_line', (p) => {})
	
	const lineEvts1 = lvt.create()
	lineEvts1.createNode('any_line', (p) => {})

	let nodesSize = Object.keys(lineEvts["_rep"]["_events"]["any_line"]).length
	expect(nodesSize).toBe(2)

	lineEvts1.destroy()

	nodesSize = Object.keys(lineEvts["_rep"]["_events"]["any_line"]).length
	expect(nodesSize).toBe(1)
})

it('should create a line and stream a message to the line', () => {
	const lineEvts = lvt.create()

	lineEvts.createNode<string>('test', (p) => {
		expect(p).toBe('Hello, World!')
	})

	lvt.stream('test', 'Hello, World!')
})

it('should create a line and stream message for multiples nodes', () => {
	const lineEvts = lvt.create()
	const spy = jest.fn()

	lineEvts.createNode<string>('test', (p) => {
		spy(p)
	})

	lineEvts.createNode<string>('test', (p) => {
		spy(p)
		expect(p).toBe('Hello, World!')
	})

	lvt.stream('test', 'Hello, World!')
	expect(spy).toHaveBeenCalledTimes(2)
})

it('should remove a dont exists node and ensure nothing breaks', () => {
	const lineEvts = lvt.create()
	lineEvts.createNode('any_line', (p) => {})
	lineEvts["_events"].push({ id: 'any_id', name: 'any_line' })


	expect(() => {
		lineEvts.destroy()
	}).not.toThrow()
})

it('should stream a message to a line that dont exists and ensure nothing breaks', () => {
	expect(() => {
		lvt.stream('any_line', 'Hello, World!')
	}).not.toThrow()
})


it('should call clearAll and ensure all nodes and line are removed', () => {
	const lineEvts = lvt.create()
	lineEvts.createNode('any_line', (p) => {})
	lineEvts.createNode('any_line', (p) => {})
	lineEvts.createNode('any_line_1', (p) => {})
	lineEvts.createNode('any_line_2', (p) => {})

	lvt.clearAll()

	expect(lineEvts["_rep"]["_events"]).toEqual({})
})