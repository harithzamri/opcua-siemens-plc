const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

//simple listener
// myEmitter
//   .on("event", () => {                    //(event, listener)
//     console.log("an event occurred!");
//   })
//   .on("event", function () {
//     console.log("test");
//   });

//function listener
// function Listener() {
//   console.log("predefined function");
// }
// myEmitter.on("event", Listener);

// myEmitter.on("event", function (a, b) {
//   // can take argument
//   console.log(`test: ${b}, ${a}`);
// });
// myEmitter.emit("event", "hello", "harith");

// myEmitter.on("data", function named(data) {
//   //pass as an object
//   console.log(`named anonmynous: ${data}`);
// });

// myEmitter.emit("data", { data: "here is some data" });

myEmitter.on("data", (a) => {
  console.log(`${a}`);
});

myEmitter.emit("data", { data: "here is some data" });
