import { v4 as uuid } from 'uuid'

interface Node {
	id: string
	handler: Function
}

interface Unsubscribe {
	id: string
	name: string
}

class Events {
	private static _instance: Events
	private _events: { [id: string]: Node[] } = {}

	private constructor() {}

	public static getInstance() {
		if (!Events._instance) Events._instance = new Events()
		return Events._instance
	}

	public create<T = any>(name: string, fn: (payload: T) => void): Unsubscribe {
		const id = uuid()

		if (!this._events[name]) this._events[name] = []
		this._events[name].push({ id, handler: fn })

		return { id, name }
	}

	public remove(name: string, id: string): void {
		this._events[name] = this._events[name].filter((line) => line.id !== id)
	}

	public clearAll(): void {
		this._events = {}
	}

	public stream<T = any>(line: string, payload?: T): void {
		if (!this._events[line]) return
		this._events[line].forEach((line) => line.handler(payload))
	}
}

class LineEvents {
	private _evt = Events.getInstance()
	private _events: Unsubscribe[] = []

	/**
	 * Creates a new node in line to listen for events with the given `line` name. The `fn` function will be called when the
	 * line receives a message.
	 */
	public createNode<T = any>(line: string, fn: (payload: T) => void): void {
		const node = this._evt.create(line, fn)
		this._events.push(node)
	}

	/**
	 * Destroys all created nodes. It is extremely important to always destroy the created nodes if the component has its
	 * life cycle ended, as the instantiation of identical nodes if your component is rendered and destroyed several times
	 * can lead to behaviors such as receiving duplicate messages.
	 */
	public destroy(): void {
		this._events.forEach((stream) => this._evt.remove(stream.name, stream.id))
		this._events = []
	}
}

/**
 * returns a singleton `LineEvents` instance.
 */
export function create(): LineEvents {
	return new LineEvents()
}

/**
 * Transmit data along a line where all nodes receive the data stream.
 */
export function stream<T = any>(line: string, payload?: T): void {
	Events.getInstance().stream(line, payload)
}

/**
 * Clear all nodes and lines.
 */
export function clearAll(): void {
	Events.getInstance().clearAll()
}
