[![codecov](https://codecov.io/gh/edfcsx/line-events/branch/master/graph/badge.svg)](https://codecov.io/gh/edfcsx/line-events)
# Line Events

`line-events` is a library that allows the creation of observables and the transmission of events between different parts of a program.
<br/><br/>The name `line-events` comes from the idea that events are transmitted from one point to another, like a line or an electrical network, where the line is the transmission medium, each event is an electrical pulse, and each observer is a device that receives that pulse.

### Installation

```bash
npm i line-events
```

### Usage
Here is a basic example of how to use the library:

```typescript
import * as lvt from 'line-events'

const lineEvts = lvt.create()

lineEvts.createNode<boolean>('loading', (payload) => {
...
})

lvt.stream('loading', true)
lineEvts.destroy()
```
This code creates a new event called loading and transmits a boolean value true to all observers of that event.
### Creating an Event
To create an event, simply call the **createNode** function and pass the name of the event and a callback function that will be called each time an event is transmitted. The transmission lines are created automatically, so there is no need to worry about that.
### Destroying an Event
It is important to call the **destroy** function to release the resources allocated by the library. This resource should be tied to the lifecycle of the components. If a component is destroyed, such as a menu that no longer exists, it is important to call the destroy function to avoid creating duplicate events, which can lead to undesirable behaviors, such as multiple callback calls.
### API

#### `create`
Returns a new object that contains the functions to create and transmit events.
#### `createNode`
Creates a new event, receives the name of the line and a callback function that will be called when the line receives a transmission.
#### `stream`
Transmits an event to all observers of the line.
#### `destroy`
Releases the nodes created by the event line.

### Examples
Example 1: Transmitting Simple Data
```typescript
import * as lvt from 'line-events'

const lineEvts = lvt.create()

lineEvts.createNode<string>('message', (payload) => {
  console.log('Received message:', payload)
})

lvt.stream('message', 'Hello, World!')
lineEvts.destroy()
```

Example 2: Transmitting Complex Data
```typescript
import * as lvt from 'line-events'

interface Player {
  hp: number
}

const lineEvts = lvt.create()

lineEvts.createNode<Player>('player', (payload) => {
  console.log('Player HP:', payload.hp)
})

lvt.stream('player', { hp: 100 })
lineEvts.destroy()
```

Example 3: Observing Multiple Events
```typescript
import * as lvt from 'line-events'

const lineEvts = lvt.create()

lineEvts.createNode<string>('message', (payload) => {
  console.log('Received message:', payload)
})

lineEvts.createNode<number>('number', (payload) => {
  console.log('Received number:', payload)
})

lvt.stream('message', 'Hello, World!')
lvt.stream('number', 42)
lineEvts.destroy()
```

Example 4: Observing Multiple Events with the Same Callback
```typescript

import * as lvt from 'line-events'

const lineEvts = lvt.create()

const callback = (payload: any) => {
  console.log('Received:', payload)
}

lineEvts.createNode<string>('message', callback)
lineEvts.createNode<number>('number', callback)

lvt.stream('message', 'Hello, World!')
lvt.stream('number', 42)
lineEvts.destroy()
```

The line-events library offers various usage examples and can be integrated in many ways. It is compatible with Node.js, Vue, React, Angular, Svelte, among others. You can use it to:  
- Notify the user interface about changes in the application state.
- Transmit data between components.
- Create APIs for component manipulation.
- Implement design patterns like Observer, Pub/Sub, etc.
- And much more.

One of the most interesting uses is the discovery of dynamically loaded components. In this case, a component can send a message to multiple components that implement a standard interface. Thus, each component, when notified, can identify itself and react accordingly.
### Conclusion
line-events is a simple and efficient library for transmitting events between different parts of a program. It is easy to use and can be easily integrated into any project. With it, you can create observables and transmit events quickly and efficiently, without the need for more complex libraries. If you need a simple way to transmit events in your project, line-events is a good choice, as it is lightweight, fast, and easy to use.

<br/>I have been using this library in my projects, and it has been very helpful. I hope it can assist you as well.