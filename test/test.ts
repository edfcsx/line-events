import * as lvt from '../src/main'

interface Player {
	hp: number
}

(() => {
	const nodeM = lvt.create()

	nodeM.createNode('test', (payload: string) => {
		console.log('linha test:> ', payload)
	})

	nodeM.createNode<Player>('player', (payload) => {
		console.log('linha player:> ', payload)
	})

	lvt.stream('test', 'Hello, World!')
	lvt.stream('player', { hp: 100 })
	lvt.stream('test', 'Hello, World2!')

	nodeM.destroy()
})()
