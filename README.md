# Demo Subgraph (The Graph) showcasing unit testing with Matchstick!

❗ This repository reflects the changes made in the latest version of [Matchstick](https://github.com/LimeChain/matchstick/) (a.k.a. it follows the main branch).

## Overview
```sh
Matchstick 🔥 0.2.1
Limechain <https://limechain.tech>
Unit testing framework for Subgraph development on The Graph protocol.

USAGE:
    graph test [test_suites]...

FLAGS:
    -h, --help                    Prints help information
    -v, --version <tag>           Choose the version of the rust binary that you want to be downloaded/used
    -f, --force                   Overwrite folder + file when downloading
    -l, --logs                    Logs to the console information about the OS, CPU model and download url (debugging purposes)

ARGS:
    <test_suites>...    Please specify the names of the test suites you would like to run.
```

## Conventions

### Directory structure

For **Matchstick** to recognize your test suites, you need to put them in a `tests/` folder in the root of your project or use the `testsFolder` attribute in your subgraph.yaml to specify a different location/name.

***NOTE***: A *Test Suite* is simply a collection of `test(...)` function calls. They can be put into a single file or
many files grouped into a directory.

### Naming

Your test files should start with a name of your chosing (for example the name of the tested data source) and end with `.test.ts`.
For instance:
```
tests/
└── gravity.test.ts

1 file
```

Now, according to Matchstick, there exists a test suite named `gravity`.

---

As mentioned, you can group related tests and other files into folders.
For example:
```
tests/
└── gravity
    ├── gravity.test.ts
    └── utils.ts

1 directory, 2 files
```

Now all files, under the `gravity` folder, ending with `.test.ts` are interpreted as a single test suite named `gravity` (the folder name).

## Caveats

 - **Matchstick** is case-insensitive when it comes to test suite names. Meaning, *Gravity = gravity = gRaVitY*.

## Example Usage 📖

If you prefer learning through watching, here's a [video tutorial](https://www.youtube.com/watch?v=T-orbT4gRiA)!

Let's explore a few common scenarios where we'd want to test our handler functions. We've created a [**demo-subgraph repo**](https://github.com/LimeChain/demo-subgraph "demo-subgraph") to fully demonstrate how to use the framework and all its functionality. For the full examples, feel free to check it out in depth. Let's dive in! We've got the following simple **generated** event:
```typescript
export class NewGravatar extends ethereum.Event {
  get params(): NewGravatar__Params {
    return new NewGravatar__Params(this);
  }
}

export class NewGravatar__Params {
  _event: NewGravatar;

  constructor(event: NewGravatar) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get displayName(): string {
    return this._event.parameters[2].value.toString();
  }

  get imageUrl(): string {
    return this._event.parameters[3].value.toString();
  }
}
```

Along with the following simple **generated** entity:
```typescript
export class Gravatar extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Gravatar entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Gravatar entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Gravatar", id.toString(), this);
  }

  static load(id: string): Gravatar | null {
    return store.get("Gravatar", id) as Gravatar | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get displayName(): string {
    let value = this.get("displayName");
    return value.toString();
  }

  set displayName(value: string) {
    this.set("displayName", Value.fromString(value));
  }

  get imageUrl(): string {
    let value = this.get("imageUrl");
    return value.toString();
  }

  set imageUrl(value: string) {
    this.set("imageUrl", Value.fromString(value));
  }
}
```

And finally, we have a handler function (**that we've written in our** `gravity.ts` **file**) that deals with the events. As well as two little helper functions - one for multiple events of the same type and another for creating a filled instance of ethereum.Event - `newMockEvent` (Although `changetype` is inherently unsafe, most events can be safely upcast to the desired ethereum.Event extending class as shown in the example below):
```typescript
export function handleNewGravatar(event: NewGravatar): void {
  let gravatar = new Gravatar(event.params.id.toHex())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach(event => {
    handleNewGravatar(event);
  });
}

export function createNewGravatarEvent(id: i32, ownerAddress: string, displayName: string, imageUrl: string): NewGravatar {
  let newGravatarEvent = changetype<NewGravatar>(newMockEvent()) 
  newGravatarEvent.parameters = new Array();
  let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(id));
  let addressParam = new ethereum.EventParam("ownderAddress", ethereum.Value.fromAddress(Address.fromString(ownerAddress)));
  let displayNameParam = new ethereum.EventParam("displayName", ethereum.Value.fromString(displayName));
  let imageUrlParam = new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl));

  newGravatarEvent.parameters.push(idParam);
  newGravatarEvent.parameters.push(addressParam);
  newGravatarEvent.parameters.push(displayNameParam);
  newGravatarEvent.parameters.push(imageUrlParam);

  return newGravatarEvent;
}
```
That's all well and good, but what if we had more complex logic in the handler function? We would want to check that the event that gets saved in the store looks the way we want it to look like.

What we need to do is create a test file in the `tests/` subdirectory under the root folder (or specify a different name/location by using the `testsFolder` attribute in the subgraph.yaml).
We can name it however we want as long as it ends with `.test.ts` - let's say `gravity.test.ts`. 

**Tip:** You can also group test files into directories, for example:
```bash
tests/
└── gravity
    ├── foo.test.ts
    └── bar.test.ts
```
Now, your test name would be `gravity` - the name of the directory.

```typescript
import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { Gravatar } from "../../generated/schema";
import { NewGravatar } from "../../generated/Gravity/Gravity";
import { createNewGravatarEvent, handleNewGravatars } from "../mappings/gravity";

test("Can call mappings with custom events", () => {
  // Initialise
  let gravatar = new Gravatar("gravatarId0");
  gravatar.save();

  // Call mappings
  let newGravatarEvent = createNewGravatarEvent(
      12345,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "cap",
      "pac",
  );

  let anotherGravatarEvent = createNewGravatarEvent(
      3546,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "cap",
      "pac",
  );

  handleNewGravatars([newGravatarEvent, anotherGravatarEvent]);

  assert.fieldEquals(
      GRAVATAR_ENTITY_TYPE,
      "gravatarId0",
      "id",
      "gravatarId0",
  );
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "12345", "id", "12345");
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "3546", "id", "3546");
  clearStore();
});

test("Next test", () => {
  //...
});

```

That's a lot to unpack! First off, an important thing to notice is that we're importing things from `matchstick-as`, that's our AssemblyScript helper library (distributed as an npm module), which you can check out [here](https://github.com/LimeChain/matchstick-as "here"). It provides us with useful testing methods and also defines the `test()` function which we will use to build our test blocks. The rest of it is pretty straightforward - here's what happens:
- We're setting up our initial state and adding one custom Gravatar entity;
- We define two `NewGravatar` event objects along with their data, using the `createNewGravatarEvent()` function;
- We're calling out handler methods for those events - `handleNewGravatars()` and passing in the list of our custom events;
- We assert the state of the store. How does that work? - We're passing a unique combination of Entity type and id. Then we check a specific field on that Entity and assert that it has the value we expect it to have. We're doing this both for the initial burger Entity we added and for the one that gets added when the handler function is called;
- And lastly - we're cleaning the store using `clearStore()` so that our next test can start with a fresh and empty store object. We can define as many test blocks as we want.

There we go - we've tested our first event handler! 👏

Now let's recap and take a look at some concise, common **use cases**, which include what we already covered plus more useful things we can use **Matchstick** for.

## Use Cases 🧰
### Hydrating the store with a certain state
Users are able to hydrate the store with a known set of entities. Here's an example to initialise the store with a Gravatar entity:
```typescript
let gravatar = new Gravatar("entryId");
gravatar.save();
```

### Calling a mapping function with an event
A user can create a custom event and pass it to a mapping function that is bound to the store:
```typescript
import { store } from "matchstick-as/assembly/store";
import { NewGravatar } from "../../generated/Gravity/Gravity";
import { handleNewGravatars, createNewGravatarEvent } from "./mapping";

let newGravatarEvent = createNewGravatarEvent(12345, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "cap", "pac");

handleNewGravatar(newGravatarEvent);
```

### Calling all of the mappings with event fixtures
Users can call the mappings with test fixtures.
```typescript
import { NewGravatar } from "../../generated/Gravity/Gravity";
import { store } from "matchstick-as/assembly/store";
import { handleNewGravatars, createNewGravatarEvent } from "./mapping";

let newGravatarEvent = createNewGravatarEvent(12345, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "cap", "pac");

let anotherGravatarEvent = createNewGravatarEvent(3546, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "cap", "pac");

handleNewGravatars([newGravatarEvent, anotherGravatarEvent]);
```

### Mocking contract calls
Users can mock contract calls:
```typescript
import { addMetadata, assert, createMockedFunction, clearStore, test } from "matchstick-as/assembly/index";
import { Gravity } from "../../generated/Gravity/Gravity";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

let contractAddress = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
let expectedResult = Address.fromString("0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947");
let bigIntParam = BigInt.fromString("1234");
createMockedFunction(contractAddress, "gravatarToOwner", "gravatarToOwner(uint256):(address)")
    .withArgs([ethereum.Value.fromSignedBigInt(bigIntParam)])
    .returns([ethereum.Value.fromAddress(Address.fromString("0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947"))]);

let gravity = Gravity.bind(contractAddress);
let result = gravity.gravatarToOwner(bigIntParam);

assert.equals(ethereum.Value.fromAddress(expectedResult), ethereum.Value.fromAddress(result));
```
As demonstrated, in order to mock a contract call and hardcore a return value, the user must provide a contract address, function name, function signature, an array of arguments, and of course - the return value.

Users can also mock function reverts:
```typescript
let contractAddress = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
createMockedFunction(contractAddress, "getGravatar", "getGravatar(address):(string,string)")
    .withArgs([ethereum.Value.fromAddress(contractAddress)])
    .reverts();
```

### Asserting the state of the store
Users are able to assert the final (or midway) state of the store through asserting entities. In order to do this, the user has to supply an Entity type, the specific ID of an Entity, a name of a field on that Entity, and the expected value of the field. Here's a quick example:
```typescript
import { assert } from "matchstick-as/assembly/index";
import { Gravatar } from "../generated/schema";

let gravatar = new Gravatar("gravatarId0");
gravatar.save();

assert.fieldEquals("Gravatar", "gravatarId0", "id", "gravatarId0");

```
Running the assert.fieldEquals() function will check for equality of the given field against the given expected value. The test will fail and an error message will be outputted if the values are **NOT** equal. Otherwise the test will pass successfully.

### Interacting with Event metadata
Users can use default transaction metadata, which could be returned as an ethereum.Event by using the `newMockEvent()` function. The following example shows how you can read/write to those fields on the Event object:

```typescript
let logType = newGravatarEvent.logType;

let UPDATED_ADDRESS = "0xB16081F360e3847006dB660bae1c6d1b2e17eC2A";
newGravatarEvent.address = Address.fromString(UPDATED_ADDRESS);
```

### Asserting variable equality
```typescript
assert.equals(ethereum.Value.fromString("hello"); ethereum.Value.fromString("hello"));

// String
assert.stringEquals(DEFAULT_LOG_TYPE, newGravatarEvent.logType!);

// Address
assert.addressEquals(Address.fromString(DEFAULT_ADDRESS), newGravatarEvent.address);
 
// BigInt
assert.bigIntEquals(BigInt.fromI32(DEFAULT_LOG_INDEX), newGravatarEvent.logIndex);

// Bytes & nested objects
assert.bytesEquals((Bytes.fromHexString(DEFAULT_BLOCK_HASH) as Bytes), newGravatarEvent.block.hash);
```

### Asserting that an Entity is **not** in the store
Users can assert that an entity does not exist in the store. If the entity is in fact in the store, the test will fail with a relevant error message. Here's a quick example of how to use this functionality:

```typescript
assert.notInStore("Gravatar", "23");
```

### Printing the whole store (for debug purposes)
You can print the whole store to the console using this helper function:
```typescript
import { logStore } from "matchstick-as/assembly/store";

logStore();
```

### Expected failure
Users can have expected test failures, using the `shouldFail` flag on the `test()` functions:
```typescript
test("Should throw an error", () => {
  throw new Error();
}, true);
```

If the test is marked with `shouldFail = true` but **DOES NOT** fail, that will show up as an error in the logs and the test block will fail. Also, if it's marked with `shouldFail = false` (the default state), the test executor will crash.

### Logging
Having custom logs in the unit tests is exactly the same as logging in the mappings. The difference is that the log object needs to be imported from `matchstick-as` rather than `graph-ts`. Here's a simple example with all non-critical log types:
```typescript
import { test } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";

test("Success", () => {
    log.success("Success!". []);
});
test("Error", () => {
    log.error("Error :( ", []);
});
test("Debug", () => {
    log.debug("Debugging...", []);
});
test("Info", () => {
    log.info("Info!", []);
});
test("Warning", () => {
    log.warning("Warning!", []);
});
```

Users can also simulate a critical failure, like so:
```typescript
test("Blow everything up", () => {
    log.critical("Boom!");
});
```

Logging critical errors will stop the execution of the tests and blow everything up. After all - we want to make sure you're code doesn't have critical logs in deployment, and you should notice right away if that were to happen.

### Testing derived fields
Testing derived fields is a newly added feature which (as the example below shows) allows the user to set a field in a certain entity and have another entity be updated automatically if it derives one of its fields from the first entity.
Important thing to note is that the first entity needs to be reloaded as the automatic update happens in the store in rust of which the AS code is agnostic.
```typescript
test("Derived fields example test", () => {
    let mainAccount = new GraphAccount("12")
    mainAccount.save()
    let operatedAccount = new GraphAccount("1")
    operatedAccount.operators = ["12"]
    operatedAccount.save()
    let nst = new NameSignalTransaction("1234")
    nst.signer = "12";
    nst.save()

    assert.assertNull(mainAccount.get("nameSignalTransactions"))
    assert.assertNull(mainAccount.get("operatorOf"))

    mainAccount = GraphAccount.load("12")!

    assert.i32Equals(1, mainAccount.nameSignalTransactions.length)
    assert.stringEquals("1", mainAccount.operatorOf[0])
})
```

### Test run time duration in the log output
The log output includes the test run duration. Here's an example:

`Jul 09 14:54:42.420 INFO Program execution time: 10.06022ms`

## Test Coverage (Linux and MacOS)
Using **Matchstick**, subgraph developers are able to run a script that will calculate the test coverage of the written unit tests. The tool only works on **Linux** and **MacOS**, but when we add support for Docker (see progress on that [here](https://github.com/LimeChain/matchstick/issues/222)) users should be able to use it on any machine and almost any OS. 

The test coverage tool is really simple - it takes the compiled test `wasm` binaries and converts them to `wat` files, which can then be easily inspected to see whether or not the handlers defined in `subgraph.yaml` have actually been called. Since code coverage (and testing as whole) is in very early stages in AssemblyScript and WebAssembly, **Matchstick** cannot check for branch coverage. Instead we rely on the assertion that if a given handler has been called, the event/function for it have been properly mocked.

### Prerequisites
To run the test coverage functionality provided in **Matchstick**, there are a few things you need to prepare beforehand:

#### 1. Install CMake
The test coverage tool relies on [wabt](https://github.com/WebAssembly/wabt) under the hood, which in turn relies on [CMake](https://cmake.org/), so you'll need to install CMake locally before you run the coverage tool.

#### 2. Export your handlers
In order for **Matchstick** to check which handlers are being run, those handlers need to be exported from the **test file**. So for instance in our example, in our gravity.test.ts file we have the following handler being imported:
```ts
import  { handleNewGravatar } from "../../src/gravity";
```
In order for that function to be visible (for it to be included in the `wat` file **by name**) we need to also export it, like this:
```ts
export { handleNewGravatar };
```

### Usage
Once that's all set up, to run the test coverage tool, simply run:
```
graph test -- -c
```
You could also add a custom `coverage` command to your `package.json` file, like so:
```ts
 "scripts": {
    /.../
    "coverage": "graph test -- -c"
  },
```

Hopefully that should execute the coverage tool without any issues. You should see something like this in the terminal:
```
$ graph test -- -c
Skipping download/install step because binary already exists at /Users/petko/work/demo-subgraph/node_modules/binary-install-raw/bin/0.2.0

___  ___      _       _         _   _      _
|  \/  |     | |     | |       | | (_)    | |
| .  . | __ _| |_ ___| |__  ___| |_ _  ___| | __
| |\/| |/ _` | __/ __| '_ \/ __| __| |/ __| |/ /
| |  | | (_| | || (__| | | \__ \ |_| | (__|   <
\_|  |_/\__,_|\__\___|_| |_|___/\__|_|\___|_|\_\

If you want to change the default tests folder location (./tests/) you can add 'testsFolder: ./example/path' to the outermost level of your subgraph.yaml
Compiling...

Running in coverage report mode.
 ️
Downloading necessary tools... 🛠️
Building. This might take a while... ⌛️
Reading generated test modules... 🔎️
Generating coverage report 📝

Handlers for source 'cryptopunks':
Handler 'handleAssign' is tested.
Handler 'handlePunkTransfer' is not tested.
Handler 'handlePunkOffered' is not tested.
Handler 'handlePunkBidEntered' is not tested.
Handler 'handlePunkBidWithdrawn' is not tested.
Handler 'handlePunkBought' is not tested.
Handler 'handlePunkNoLongerForSale' is not tested.
Test coverage: 14% (1/7 handlers).

Handlers for source 'WrappedPunks':
Handler 'handleWrappedPunkTransfer' is not tested.
Test coverage: 0% (0/1 handlers).

Handlers for source 'Gravity':
Handler 'handleNewGravatar' is tested.
Handler 'handleUpdatedGravatar' is not tested.
Handler 'handleCreateGravatar' is not tested.
Test coverage: 33% (1/3 handlers).

Global test coverage: 18% (2/11 handlers).

✨  Done in 65.76s.
```
