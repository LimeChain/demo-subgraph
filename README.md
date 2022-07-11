# Demo Subgraph (The Graph) showcasing unit testing with Matchstick!

❗ This repository reflects the changes made in the latest version of [Matchstick](https://github.com/LimeChain/matchstick/) (a.k.a. it follows the main branch).

## Overview
```sh
Matchstick 🔥 0.4.3
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

For **Matchstick** to recognize your test suites, you need to put them in a `tests/` folder in the root of your project, or you can configure a custom folder via `matchstick.yaml` config.

### Configuration ⚙️
Matchstick can be configured to use a custom tests and libs folder via `matchstick.yaml` config file:

- To change the default tests location (./tests), add `testsFolder: ./custom/path`

- To change the default libs location (./node_modules), add `libsFolder: ./custom/path`

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

***❗ IMPORTANT The following applies for matchstick versions `<0.5.0`. From `>=0.5.0`, every single `.test.ts` file will be compiled as a separate test suite named `<folder_name>/<test_file_name>`, e.g: `gravity/new_gravatar` and `gravity/updated_gravatar`.***

As mentioned, you can group related tests and other files into folders.
For example:
```
tests/
└── gravity
    ├── new_gravatar.test.ts
    └── updated_gravatar.test.ts

1 directory, 2 files
```

Now all files, under the `gravity` folder, ending with `.test.ts` are interpreted as a single test suite named `gravity` (the folder name).

## Caveats

 - **Matchstick** is case-insensitive when it comes to test suite names. Meaning, *Gravity = gravity = gRaVitY*.

## Tests structure (>=0.5.0)

***❗ IMPORTANT: Requires matchstick-as >=0.5.0***

### describe()

`describe(name: String , () => {})` - Defines a test group.

**_Notes:_**

- _Describes are not mandatory. You can still use test() the old way, outside of the describe() blocks_

Example:

```typescript
import { describe, test } from "matchstick-as/assembly/index"
import { handleNewGravatar } from "../../src/gravity"

describe("handleNewGravatar()", () => {
  test("Should create a new Gravatar entity", () => {
    ...
  })
})
```

Nested `describe()` example:

```typescript
import { describe, test } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar } from "../../src/gravity"

describe("handleUpdatedGravatar()", () => {
  describe("When entity exists", () => {
    test("updates the entity", () => {
      ...
    })
  })

  describe("When entity does not exists", () => {
    test("it creates a new entity", () => {
      ...
    })
  })
})
```
__________________________________________________________________

### test()

`test(name: String, () =>, should_fail: bool)` - Defines a test case. You can use test() inside of describe() blocks or independently.

Example:

```typescript
import { describe, test } from "matchstick-as/assembly/index"
import { handleNewGravatar } from "../../src/gravity"

describe("handleNewGravatar()", () => {
  test("Should create a new Entity", () => {
    ...
  })
})
```

or

```typescript
test("handleNewGravatar() should create a new entity", () => {
  ...
})


```
__________________________________________________________________

### beforeAll()

Runs a code block before any of the tests in the file. If `beforeAll` is declared inside of a `describe` block, it runs at the beginning of that `describe` block.

Examples:

Code inside `beforeAll` will execute once before *all* tests in the file.

```typescript
import { describe, test, beforeAll } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"
import { Gravatar } from "../../generated/schema"

beforeAll(() => {
  let gravatar = new Gravatar("0x0")
  gravatar.displayName = “First Gravatar”
  gravatar.save()
  ...
})

describe("When the entity does not exist", () => {
  test("it should create a new Gravatar with id 0x1", () => {
    ...
  })
})

describe("When entity already exists", () => {
  test("it should update the Gravatar with id 0x0", () => {
    ...
  })
})
```

Code inside `beforeAll` will execute once before all tests in the first describe block

```typescript
import { describe, test, beforeAll } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"
import { Gravatar } from "../../generated/schema"

describe("handleUpdatedGravatar()", () => {
  beforeAll(() => {
    let gravatar = new Gravatar("0x0")
    gravatar.displayName = “First Gravatar”
    gravatar.save()
    ...
  })

  test("updates Gravatar with id 0x0", () => {
    ...
  })

  test("creates new Gravatar with id 0x1", () => {
    ...
  })
})
```
__________________________________________________________________

### afterAll()

Runs a code block after all of the tests in the file. If `afterAll` is declared inside of a `describe` block, it runs at the end of that `describe` block.

Example:

Code inside `afterAll` will execute once after *all* tests in the file.

```typescript
import { describe, test, afterAll } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"
import { store } from "@graphprotocol/graph-ts"

afterAll(() => {
  store.remove("Gravatar", "0x0")
  ...
})

describe("handleNewGravatar, () => {
  test("creates Gravatar with id 0x0", () => {
    ...
  })
})

describe("handleUpdatedGravatar", () => {
  test("updates Gravatar with id 0x0", () => {
    ...
  })
})
```

Code inside `afterAll` will execute once after all tests in the first describe block

```typescript
import { describe, test, afterAll, clearStore } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"

describe("handleNewGravatar", () => {
	afterAll(() => {
    store.remove("Gravatar", "0x1")
    ...
	})

  test("It creates a new entity with Id 0x0", () => {
    ...
  })

  test("It creates a new entity with Id 0x1", () => {
    ...
  })
})

describe("handleUpdatedGravatar", () => {
  test("updates Gravatar with id 0x0", () => {
    ...
  })
})
```
__________________________________________________________________

### beforeEach()

Runs a code block before every test. If `beforeEach` is declared inside of a `describe` block, it runs before each test in that `describe` block.

Examples:
Code inside `beforeEach` will execute before each tests.

```typescript
import { describe, test, beforeEach, clearStore } from "matchstick-as/assembly/index"
import { handleNewGravatars } from "./utils"

beforeEach(() => {
  clearStore() // <-- clear the store before each test in the file
})

describe("handleNewGravatars, () => {
  test("A test that requires a clean store", () => {
    ...
  })

  test("Second that requires a clean store", () => {
    ...
  })
})

 ...
```

Code inside `beforeEach` will execute only before each test in the that describe

```typescript
import { describe, test, beforeEach } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"

describe("handleUpdatedGravatars", () => {
  beforeEach(() => {
    let gravatar = new Gravatar("0x0")
    gravatar.displayName = "First Gravatar"
    gravatar.imageUrl = ""
    gravatar.save()
  })

  test("Upates the displayName", () => {
     assert.fieldEqual("Gravatar", "0x0", "displayNamd", "First Gravatar")

    // code that should update the displayName to 1st Gravatar

    assert.fieldEqual("Gravatar", "0x0", "displayName", "1st Gravatar")
    store.remove("Gravatar", "0x0")
  })

  test("Updates the imageUrl", () => {
    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "")

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "https://www.gravatar.com/avatar/0x0")
    store.remove("Gravatar", "0x0")
  })
})


```
__________________________________________________________________

### afterEach()

Runs a code block after every test. If `afterEach` is declared inside of a `describe` block, it runs after each test in that `describe` block.

Examples:

Code inside `afterEach` will execute after every test.

```typescript
import { describe, test, beforeEach, afterEach } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"

beforeEach(() => {
  let gravatar = new Gravatar("0x0")
  gravatar.displayName = “First Gravatar”
  gravatar.save()
})

afterEach(() => {
  store.remove("Gravatar", "0x0")
})

describe("handleNewGravatar", () => {
  ...
})

describe("handleUpdatedGravatar", () => {
  test("Upates the displayName", () => {
     assert.fieldEqual("Gravatar", "0x0", "displayNamd", "First Gravatar")

    // code that should update the displayName to 1st Gravatar

    assert.fieldEqual("Gravatar", "0x0", "displayName", "1st Gravatar")
  })

  test("Updates the imageUrl", () => {
    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "")

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "https://www.gravatar.com/avatar/0x0")
  })
})
```

Code inside `afterEach` will execute after each test in that describe

```typescript
import { describe, test, beforeEach, afterEach } from "matchstick-as/assembly/index"
import { handleUpdatedGravatar, handleNewGravatar } from "../../src/gravity"

describe("handleNewGravatar", () => {
  ...
})

describe("handleUpdatedGravatar", () => {
  beforeEach(() => {
    let gravatar = new Gravatar("0x0")
    gravatar.displayName = "First Gravatar"
    gravatar.imageUrl = ""
    gravatar.save()
  })

  afterEach(() => {
    store.remove("Gravatar", "0x0")
  })

  test("Upates the displayName", () => {
     assert.fieldEqual("Gravatar", "0x0", "displayNamd", "First Gravatar")

    // code that should update the displayName to 1st Gravatar

    assert.fieldEqual("Gravatar", "0x0", "displayName", "1st Gravatar")
  })

  test("Updates the imageUrl", () => {
    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "")

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEqual("Gravatar", "0x0", "imageUrl", "https://www.gravatar.com/avatar/0x0")
  })
})
```

## Asserts

```typescript
fieldEquals(entityType: string, id: string, fieldName: string, expectedVal: string)

equals(expected: ethereum.Value, actual: ethereum.Value)

notInStore(entityType: string, id: string)

addressEquals(address1: Address, address2: Address)

bytesEquals(bytes1: Bytes, bytes2: Bytes)

i32Equals(number1: i32, number2: i32)

bigIntEquals(bigInt1: BigInt, bigInt2: BigInt)

booleanEquals(bool1: boolean, bool2: boolean)

stringEquals(string1: string, string2: string)

arrayEquals(array1: Array<ethereum.Value>, array2: Array<ethereum.Value>)

tupleEquals(tuple1: ethereum.Tuple, tuple2: ethereum.Tuple)

assertTrue(value: boolean)

assertNull<T>(value: T)

assertNotNull<T>(value: T)

entityCount(entityType: string, expectedCount: i32)
```

## Example Usage 📖

***NOTE:*** Since `graph-cli 0.26.1, 0.27.1, 0.28.2 and 0.29.1`, `graph codegen` will not generate default values the required fields on `.save()`, you will need to set all required fields manually. Matchstick will fail the test and print an error message if any required fields are not present.

If you prefer learning through watching, check out the [video tutorials](https://www.youtube.com/watch?v=T-orbT4gRiA)!

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

```typescript
import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { Gravatar } from "../../generated/schema";
import { NewGravatar } from "../../generated/Gravity/Gravity";
import { createNewGravatarEvent, handleNewGravatars } from "../mappings/gravity";

describe("Mocked Events", () => {
  afterEach(() => {
    clearStore()
  })

  test("Can call mappings with custom events", () => {
    // Call mappings
    let newGravatarEvent = createNewGravatarEvent(
      0xdead,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "Gravatar 0xdead",
      "https://example.com/image0xdead.png"
    )

    let anotherGravatarEvent = createNewGravatarEvent(
      0xbeef,
      "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      "Gravatar 0xbeef",
      "https://example.com/image0xbeef.png"
    )

    handleNewGravatars([newGravatarEvent, anotherGravatarEvent])

    assert.entityCount(GRAVATAR_ENTITY_TYPE, 2)
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "0xdead", "displayName", "Gravatar 0xdead")
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "0xbeef", "displayName", "Gravatar 0xbeef")
  })
})

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

`./tests/gravity/gravity.test.ts`
```typescript
import { NewGravatar } from "../../generated/Gravity/Gravity";
import { store } from "matchstick-as/assembly/store";
import { handleNewGravatars, createNewGravatarEvent } from "./mapping";

let newGravatarEvent = createNewGravatarEvent(12345, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "cap", "pac");

let anotherGravatarEvent = createNewGravatarEvent(3546, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "cap", "pac");

handleNewGravatars([newGravatarEvent, anotherGravatarEvent]);
```

`./tests/gravity/utils.ts`
```typescript
import { handleNewGravatar } from "../../src/gravity"

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach(event => {
    handleNewGravatar(event)
  })
}

...
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


### Mocking IPFS (not available in matchstick 0.4.0 or earlier versions)
Users can mock IPFS files using `mockIpfsFile(hash, filePath)` function. The function accepts two arguments, the first one is the IPFS file hash/path and the second one is the path to a local file.

NOTE: When testing `ipfs.map/ipfs.mapJSON`, you need to export the callback function (`export { processGravatar } from "./utils"`) like in the example bellow:

tests/gravity/gravity.test.ts:
```typescript
import { assert, test, mockIpfsFile } from "matchstick-as/assembly/index"
import { ipfs } from "@graphprotocol/graph-ts"
import { gravatarFromIpfs } from "./utils"

export { processGravatar } from "./utils"

describe("IPFS", () => {
  beforeAll(() => {
    mockIpfsFile("ipfsCatFileHash", "tests/ipfs/cat.json")
    mockIpfsFile("ipfsMapFileHash", "tests/ipfs/map.json")
  })

  afterEach(() => {
    clearStore()
  })

  test("ipfs.cat", () => {
    assert.entityCount(GRAVATAR_ENTITY_TYPE, 0)

    gravatarFromIpfs()

    assert.entityCount(GRAVATAR_ENTITY_TYPE, 1)
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "1", "imageUrl", "https://example.com/image1.png")
  })

  test("ipfs.map", () => {
    assert.entityCount(GRAVATAR_ENTITY_TYPE, 0)

    ipfs.map("ipfsMapFileHash", 'processGravatar', Value.fromString('Gravatar'), ['json'])

    assert.entityCount(GRAVATAR_ENTITY_TYPE, 3)
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "1", "displayName", "Gravatar1")
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "2", "displayName", "Gravatar2")
    assert.fieldEquals(GRAVATAR_ENTITY_TYPE, "3", "displayName", "Gravatar3")
  })
})
```

tests/gravity/utils.ts:
```typescript
import { Address, ethereum, JSONValue, Value, ipfs, json, Bytes } from "@graphprotocol/graph-ts"
import { Gravatar } from "../../generated/schema"

...

// ipfs.map callback
export function processGravatar(value: JSONValue, userData: Value): void {
  // See the JSONValue documentation for details on dealing
  // with JSON values
  let obj = value.toObject()
  let id = obj.get('id')

  if (!id) {
    return
  }

  // Callbacks can also created entities
  let gravatar = new Gravatar(id.toString())
  gravatar.displayName = userData.toString() + id.toString()
  gravatar.save()
}

// function that calls ipfs.cat
export function gravatarFromIpfs(): void {
  let rawData = ipfs.cat("ipfsCatfileHash")

  if (!rawData) {
    return
  }

  let jsonData = json.fromBytes(rawData as Bytes).toObject()

  let id = jsonData.get('id')
  let url = jsonData.get("imageUrl")

  if (!id || !url) {
    return
  }

  let gravatar = new Gravatar(id.toString())
  gravatar.imageUrl = url.toString()
  gravatar.save()
}
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
Testing derived fields is a feature which (as the example below shows) allows the user to set a field in a certain entity and have another entity be updated automatically if it derives one of its fields from the first entity.
Important thing to note is that the first entity needs to be reloaded as the automatic update happens in the store in rust of which the AS code is agnostic.

`tests/token-lock-wallet/utils.ts`
```typescript
import { GraphAccount, NameSignalTransaction } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function mockGraphAccount(id: string): void {
  let account = new GraphAccount(id);
  account.createdAt = 0
  account.operators = []
  account.balance = BigInt.fromI32(0)
  account.curationApproval = BigInt.fromI32(0)
  account.stakingApproval = BigInt.fromI32(0)
  account.gnsApproval = BigInt.fromI32(0)
  account.subgraphQueryFees = BigInt.fromI32(0)
  account.tokenLockWallets = []
  account.save()
}

export function mockNameSignalTransaction(id: string, signer: string): void {
  let nst = new NameSignalTransaction(id);
  nst.signer = signer
  nst.blockNumber = 1
  nst.timestamp = 1
  nst.type = "stake"
  nst.nameSignal = BigInt.fromI32(1)
  nst.versionSignal = BigInt.fromI32(1)
  nst.tokens = BigInt.fromI32(1)
  nst.subgraph = "1"
  nst.save()
}
```

`tests/token-lock-wallet/token-lock-wallet.test.ts`
```typescript
describe("@derivedFrom fields", () => {
  beforeAll(() => {
    mockGraphAccount("12")
    mockGraphAccount("1")
  })

  afterAll(() => {
    clearStore()
  })

  test("Derived fields example test", () => {
    let mainAccount = GraphAccount.load("12")!

    assert.assertNull(mainAccount.get("nameSignalTransactions"))
    assert.assertNull(mainAccount.get("operatorOf"))

    let operatedAccount = GraphAccount.load("1")!
    operatedAccount.operators = [mainAccount.id]
    operatedAccount.save()

    mockNameSignalTransaction("1234", mainAccount.id)
    mockNameSignalTransaction("2", mainAccount.id)

    mainAccount = GraphAccount.load("12")!

    assert.assertNotNull(mainAccount.get("nameSignalTransactions"))
    assert.assertNotNull(mainAccount.get("operatorOf"))
    assert.i32Equals(2, mainAccount.nameSignalTransactions.length)
    assert.stringEquals("1", mainAccount.operatorOf[0])

    mockNameSignalTransaction("2345", mainAccount.id)

    let nst = NameSignalTransaction.load("1234")!
    nst.signer = "11"
    nst.save()

    store.remove("NameSignalTransaction", "2")

    mainAccount = GraphAccount.load("12")!
    assert.i32Equals(1, mainAccount.nameSignalTransactions.length)
  })
```

❗ The store is updated on **every** assertion or `entity.load()` function call. When this happens any derived data pointing to a non-existent entity will be deleted.

### Testing dynamic data sources
Testing dynamic data sources can be be done by mocking the return value of the `context()`, `address()` and `network()` functions of the `dataSource` namespace.
These functions currently return the following: context - returns an empty entity (DataSourceContext), address - returns "0x0000000000000000000000000000000000000000", network - returns "mainnet".
The `create(...)` and `createWithContext(...)` functions are mocked to do nothing so they don't need to be called in the tests at all.
Changes to the return values can be done through the functions of the `dataSourceMock` namespace in matchstick-as (version 0.3.0+). Example below:
First we have the following event handler (which has been intentionally repurposed to showcase datasource mocking):

```typescript
export function handleApproveTokenDestinations(event: ApproveTokenDestinations): void {
  let tokenLockWallet = TokenLockWallet.load(dataSource.address().toHexString())!
  if (dataSource.network() == "rinkeby") {
    tokenLockWallet.tokenDestinationsApproved = true
  }
  let context = dataSource.context()
  if (context.get("contextVal")!.toI32() > 0) {
    tokenLockWallet.setBigInt("tokensReleased", BigInt.fromI32(context.get("contextVal")!.toI32()))
  }
  tokenLockWallet.save()
}
```
And then we have the test using one of the methods in the `dataSourceMock` namespace to set a new return value for all of the `dataSource` functions:


```typescript
import { assert, test, newMockEvent, dataSourceMock } from "matchstick-as/assembly/index"
import { BigInt, DataSourceContext, Value } from "@graphprotocol/graph-ts"

import { handleApproveTokenDestinations } from "../../src/token-lock-wallet"
import { ApproveTokenDestinations } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { TokenLockWallet } from "../../generated/schema"

describe("dataSourceMock", () => {
  beforeAll(() => {
    let addressString = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
    let address = Address.fromString(addressString)

    let wallet = new TokenLockWallet(address.toHexString())
    // The following values should be set, because they are required fields,
    // Since graph-cli 0.26.1, 0.27.1, 0.28.2 and 0.29.1, graph codegen will not generate
    // default values for the required fields on .save()
    wallet.manager = Address.zero()
    wallet.initHash = Address.zero() as Bytes
    wallet.beneficiary = Address.zero()
    wallet.tokenDestinationsApproved = false
    wallet.token = Bytes.fromHexString("0xc944e90c64b2c07662a292be6244bdf05cda44a7") // GRT
    wallet.managedAmount = BigInt.fromI32(0)
    wallet.startTime = BigInt.fromI32(0)
    wallet.endTime = BigInt.fromI32(0)
    wallet.periods = BigInt.fromI32(0)
    wallet.releaseStartTime = BigInt.fromI32(0)
    wallet.vestingCliffTime = BigInt.fromI32(0)
    wallet.tokensReleased = BigInt.fromI32(0)
    wallet.tokensWithdrawn = BigInt.fromI32(0)
    wallet.tokensRevoked = BigInt.fromI32(0)
    wallet.blockNumberCreated = BigInt.fromI32(0)
    wallet.txHash = Address.zero() as Bytes
    wallet.save()

    let context = new DataSourceContext()
    context.set("contextVal", Value.fromI32(325))

    dataSourceMock.setReturnValues(addressString, "rinkeby", context)
  })

  afterAll(() => {
    dataSourceMock.resetValues()
  })

  test("Simple dataSource mocking example", () => {
    let addressString = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
    let address = Address.fromString(addressString)

    let event = changetype<ApproveTokenDestinations>(newMockEvent())
    let wallet = TokenLockWallet.load(address.toHexString())!

    assert.assertTrue(!wallet.tokenDestinationsApproved)

    handleApproveTokenDestinations(event)

    wallet = TokenLockWallet.load(address.toHexString())!

    assert.assertTrue(wallet.tokenDestinationsApproved)
    assert.bigIntEquals(wallet.tokensReleased, BigInt.fromI32(325))
  })
})
```
Notice that `dataSourceMock.resetValues()` is called at the end. That's because the values are remembered when they are changed and need to be reset if you want to go back to the default values.

### Test run time duration in the log output
The log output includes the test run duration. Here's an example:

`Jul 09 14:54:42.420 INFO Program execution time: 10.06022ms`

## Test Coverage

Using **Matchstick**, subgraph developers are able to run a script that will calculate the test coverage of the written unit tests. The tool only works on **Linux** and **MacOS**, but when we add support for Docker (see progress on that [here](https://github.com/LimeChain/matchstick/issues/222)) users should be able to use it on any machine and almost any OS.

The test coverage tool is really simple - it takes the compiled test `wasm` binaries and converts them to `wat` files, which can then be easily inspected to see whether or not the handlers defined in `subgraph.yaml` have actually been called. Since code coverage (and testing as whole) is in very early stages in AssemblyScript and WebAssembly, **Matchstick** cannot check for branch coverage. Instead we rely on the assertion that if a given handler has been called, the event/function for it have been properly mocked.

### Prerequisites
To run the test coverage functionality provided in **Matchstick**, there are a few things you need to prepare beforehand:

#### Export your handlers
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
Skipping download/install step because binary already exists at /Users/petko/work/demo-subgraph/node_modules/binary-install-raw/bin/0.4.0

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
