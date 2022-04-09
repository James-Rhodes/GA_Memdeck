const { fork } = require("child_process");
const { v4: uuidv4 } = require("uuid");

// TODO: ADD this to the main server as well as adding the ability for the client side to check for their uuid and whether it is available

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

class GAThreadManager {
  constructor() {
    this.inputDataQueue = new Queue();
    this.processIsRunning = false;
    this.results = {}; // contains dictionary with uuid being key and result being value
    this.currentUUID = null; // uuid of current running process
    this.childProcess;

    this.resultTimeout = 10000;
    const CHECK_RESULTS_TIMEOUT_TIME = 2000;
    this.timoutId = setInterval(
      this.ClearResultsTimeout.bind(this),
      CHECK_RESULTS_TIMEOUT_TIME
    );
  }

  AddGaRequest(input) {
    const uuid = uuidv4();
    if (!this.processIsRunning) {
      this.currentUUID = uuid;
      this.processIsRunning = true;

      this.childProcess = fork("./ga_child_process.js");
      this.childProcess.send(input);

      this.childProcess.on("message", (message) => {
        this.results[this.currentUUID] = {
          data: message,
          timeCalculated: Date.now(),
        };

        if (!this.inputDataQueue.isEmpty) {
          const next = this.inputDataQueue.dequeue();
          this.currentUUID = next.uuid;
          this.childProcess.send(next.data);
        } else {
          this.processIsRunning = false;
          this.childProcess.kill();
        }
      });
    } else {
      this.inputDataQueue.enqueue({
        data: input,
        uuid: uuid,
      });
    }
    return uuid;
  }

  GetResult(uuid) {
    if (this.results.hasOwnProperty(uuid)) {
      const data = this.results[uuid].data;
      delete this.results[uuid];
      return data;
    }
    return false;
  }

  ClearResultsTimeout() {
    for (const result in this.results) {
      if (
        Date.now() - this.results[result].timeCalculated >
        this.resultTimeout
      ) {
        delete this.results[result];
      }
    }
  }
}

// const testInput = {
//   iterations: 1,
//   numFaros: -1,
//   numCutDeck: 1,
//   numPokerHands: 1,
//   numOverhandShuffles: 1,
//   numDealClumps: 1,
//   minNumShuffles: 1,
//   maxNumShuffles: 5,
// };
