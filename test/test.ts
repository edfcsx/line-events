import * as lvt from '../src/main'

interface Player {
	hp: number
}

(() => {
	const lineEvts = lvt.create()

	lineEvts.createNode('test', (payload: string) => {
		console.log('linha test:> ', payload)
	})

	lineEvts.createNode<Player>('player', (payload) => {
		console.log('linha player:> ', payload)
	})

	lvt.stream('test', 'Hello, World!')
	lvt.stream('player', { hp: 100 })
	lvt.stream('test', 'Hello, World2!')

	lineEvts.destroy()
})()
