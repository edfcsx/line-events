import { v4 as uuid } from 'uuid'

interface Node {
	id: string
	handler: Function
}

interface Unsubscribe {
	id: string
	name: string
}

class Repository {
	private static _instance: Repository
	private _events: { [id: string]: { [nodeId: string]: Node } } = {}

	private constructor() {}

	public static getInstance() {
		if (!Repository._instance) Repository._instance = new Repository()
		return Repository._instance
	}

	public create<T = any>(name: string, fn: (payload: T) => void): Unsubscribe {
		const id = uuid()

		if (!this._events[name]) this._events[name] = {}
		this._events[name][id] = { id, handler: fn }

		return { id, name }
	}

	public remove(name: string, id: string): void {
		if (!this._events[name] || !this._events[name][id]) return
		delete this._events[name][id]
	}

	public clearAll(): void {
		this._events = {}
	}

	public stream<T = any>(line: string, payload?: T): void {
		if (!this._events[line]) return

		for (const [_, node] of Object.entries(this._events[line])) {
			node.handler(payload)
		}
	}
}

class LineEvents {
	private _rep = Repository.getInstance()
	private _events: Unsubscribe[] = []

	/**
	 * Creates a new node in line to listen for events with the given `line` name. The `fn` function will be called when the
	 * line receives a message.
	 */
	public createNode<T = any>(line: string, fn: (payload: T) => void): void {
		const node = this._rep.create(line, fn)
		this._events.push(node)
	}

	/**
	 * Destroys all created nodes. It is extremely important to always destroy the created nodes if the component has its
	 * life cycle ended, as the instantiation of identical nodes if your component is rendered and destroyed several times
	 * can lead to behaviors such as receiving duplicate messages.
	 */
	public destroy(): void {
		this._events.forEach((stream) => this._rep.remove(stream.name, stream.id))
		this._events = []
	}
}

/**
 * returns an object to manager nodes.
 */
export function create(): LineEvents {
	return new LineEvents()
}

/**
 * Transmit data along a line where all nodes receive the data stream.
 */
export function stream<T = any>(line: string, payload?: T): void {
	Repository.getInstance().stream(line, payload)
}

/**
 * Clear all nodes and lines.
 */
export function clearAll(): void {
	Repository.getInstance().clearAll()
}
