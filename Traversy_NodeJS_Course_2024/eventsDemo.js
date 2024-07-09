import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

function greetHandler(name) {
  console.log('Hello World! ', name);
}

function goodByeHandler(name) {
  console.log('Goodbye World! ', name);
}


//Register event listeners
myEmitter.on('greet', greetHandler)
myEmitter.on('goodbye', goodByeHandler)

//Emit events
myEmitter.emit('greet', 'Burak')
myEmitter.emit('goodbye', 'Burak')

//Error handling
myEmitter.on('error', (err) => {
  console.log('An error Occured:', err);
})

//Simulate error
myEmitter.emit('error', new Error('Something went wrong'))