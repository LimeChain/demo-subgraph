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

## Tests structure

_**IMPORTANT: The test structure described below depens on `matchstick-as` version >=0.5.0**_

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

---

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

---

### beforeAll()

Runs a code block before any of the tests in the file. If `beforeAll` is declared inside of a `describe` block, it runs at the beginning of that `describe` block.

Examples:

Code inside `beforeAll` will execute once before _all_ tests in the file.

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

---

### afterAll()

Runs a code block after all of the tests in the file. If `afterAll` is declared inside of a `describe` block, it runs at the end of that `describe` block.

Example:

Code inside `afterAll` will execute once after _all_ tests in the file.

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

---

### beforeEach()

Runs a code block before every test. If `beforeEach` is declared inside of a `describe` block, it runs before each test in that `describe` block.

Examples: Code inside `beforeEach` will execute before each tests.

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
import { describe, test, beforeEach } from 'matchstick-as/assembly/index'
import { handleUpdatedGravatar, handleNewGravatar } from '../../src/gravity'

describe('handleUpdatedGravatars', () => {
  beforeEach(() => {
    let gravatar = new Gravatar('0x0')
    gravatar.displayName = 'First Gravatar'
    gravatar.imageUrl = ''
    gravatar.save()
  })

  test('Upates the displayName', () => {
    assert.fieldEquals('Gravatar', '0x0', 'displayName', 'First Gravatar')

    // code that should update the displayName to 1st Gravatar

    assert.fieldEquals('Gravatar', '0x0', 'displayName', '1st Gravatar')
    store.remove('Gravatar', '0x0')
  })

  test('Updates the imageUrl', () => {
    assert.fieldEquals('Gravatar', '0x0', 'imageUrl', '')

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEquals('Gravatar', '0x0', 'imageUrl', 'https://www.gravatar.com/avatar/0x0')
    store.remove('Gravatar', '0x0')
  })
})
```

---

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
     assert.fieldEquals("Gravatar", "0x0", "displayName", "First Gravatar")

    // code that should update the displayName to 1st Gravatar

    assert.fieldEquals("Gravatar", "0x0", "displayName", "1st Gravatar")
  })

  test("Updates the imageUrl", () => {
    assert.fieldEquals("Gravatar", "0x0", "imageUrl", "")

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEquals("Gravatar", "0x0", "imageUrl", "https://www.gravatar.com/avatar/0x0")
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
     assert.fieldEquals("Gravatar", "0x0", "displayName", "First Gravatar")

    // code that should update the displayName to 1st Gravatar

    assert.fieldEquals("Gravatar", "0x0", "displayName", "1st Gravatar")
  })

  test("Updates the imageUrl", () => {
    assert.fieldEquals("Gravatar", "0x0", "imageUrl", "")

    // code that should changes the imageUrl to https://www.gravatar.com/avatar/0x0

    assert.fieldEquals("Gravatar", "0x0", "imageUrl", "https://www.gravatar.com/avatar/0x0")
  })
})
```

## Asserts

```typescript
fieldEquals(entityType: string, id: string, fieldName: string, expectedVal: string, message: string | null = null)

equals(expected: ethereum.Value, actual: ethereum.Value, message: string | null = null)

notInStore(entityType: string, id: string, message: string | null = null)

addressEquals(address1: Address, address2: Address, message: string | null = null)

bytesEquals(bytes1: Bytes, bytes2: Bytes, message: string | null = null)

i32Equals(number1: i32, number2: i32, message: string | null = null)

bigIntEquals(bigInt1: BigInt, bigInt2: BigInt, message: string | null = null)

booleanEquals(bool1: boolean, bool2: boolean, message: string | null = null)

stringEquals(string1: string, string2: string, message: string | null = null)

arrayEquals(array1: Array<ethereum.Value>, array2: Array<ethereum.Value>, message: string | null = null)

tupleEquals(tuple1: ethereum.Tuple, tuple2: ethereum.Tuple, message: string | null = null)

assertTrue(value: boolean, message: string | null = null)

assertNull<T>(value: T, message: string | null = null)

assertNotNull<T>(value: T, message: string | null = null)

entityCount(entityType: string, expectedCount: i32, message: string | null = null)

dataSourceCount(template: string, expectedCount: i32, message: string | null = null);

dataSourceExists(template: string, address: string, message: string | null = null);
```

As of version 0.6.0, asserts support custom error messages as well

```typescript
assert.fieldEquals("Gravatar", "0x123", "id", "0x123", "Id should be 0x123");
assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(1), "Value should equal 1");
assert.notInStore("Gravatar", "0x124", "Gravatar should not be in store");
assert.addressEquals(Address.zero(), Address.zero(), "Address should be zero");
assert.bytesEquals(Bytes.fromUTF8("0x123"), Bytes.fromUTF8("0x123"), "Bytes should be equal");
assert.i32Equals(2, 2, "I32 should equal 2");
assert.bigIntEquals(BigInt.fromI32(1), BigInt.fromI32(1), "BigInt should equal 1");
assert.booleanEquals(true, true, "Boolean should be true");
assert.stringEquals("1", "1", "String should equal 1");
assert.arrayEquals([ethereum.Value.fromI32(1)], [ethereum.Value.fromI32(1)], "Arrays should be equal");
assert.tupleEquals(changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]), changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]), "Tuples should be equal");
assert.assertTrue(true, "Should be true");
assert.assertNull(null, "Should be null");
assert.assertNotNull("not null", "Should be not null");
assert.entityCount("Gravatar", 1, "There should be 2 gravatars");
assert.dataSourceCount("GraphTokenLockWallet", 1, "GraphTokenLockWallet template should have one data source");
assert.dataSourceExists("GraphTokenLockWallet", Address.zero().toHexString(), "GraphTokenLockWallet should have a data source for zero address");
```

## Write a Unit Test

Let's see how a simple unit test would look like using the Gravatar examples in the [Demo Subgraph](https://github.com/LimeChain/demo-subgraph/blob/main/src/gravity.ts).

Assuming we have the following handler function (along with two helper functions to make our life easier):

```typescript
export function handleNewGravatar(event: NewGravatar): void {
  let gravatar = new Gravatar(event.params.id.toHex())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach((event) => {
    handleNewGravatar(event)
  })
}

export function createNewGravatarEvent(
  id: i32,
  ownerAddress: string,
  displayName: string,
  imageUrl: string,
): NewGravatar {
  let mockEvent = newMockEvent()
  let newGravatarEvent = new NewGravatar(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
  )
  newGravatarEvent.parameters = new Array()
  let idParam = new ethereum.EventParam('id', ethereum.Value.fromI32(id))
  let addressParam = new ethereum.EventParam(
    'ownderAddress',
    ethereum.Value.fromAddress(Address.fromString(ownerAddress)),
  )
  let displayNameParam = new ethereum.EventParam('displayName', ethereum.Value.fromString(displayName))
  let imageUrlParam = new ethereum.EventParam('imageUrl', ethereum.Value.fromString(imageUrl))

  newGravatarEvent.parameters.push(idParam)
  newGravatarEvent.parameters.push(addressParam)
  newGravatarEvent.parameters.push(displayNameParam)
  newGravatarEvent.parameters.push(imageUrlParam)

  return newGravatarEvent
}
```

We first have to create a test file in our project. This is an example of how that might look like:

```typescript
import { clearStore, test, assert } from 'matchstick-as/assembly/index'
import { Gravatar } from '../../generated/schema'
import { NewGravatar } from '../../generated/Gravity/Gravity'
import { createNewGravatarEvent, handleNewGravatars } from '../mappings/gravity'

test('Can call mappings with custom events', () => {
  // Create a test entity and save it in the store as initial state (optional)
  let gravatar = new Gravatar('gravatarId0')
  gravatar.save()

  // Create mock events
  let newGravatarEvent = createNewGravatarEvent(12345, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')
  let anotherGravatarEvent = createNewGravatarEvent(3546, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')

  // Call mapping functions passing the events we just created
  handleNewGravatars([newGravatarEvent, anotherGravatarEvent])

  // Assert the state of the store
  assert.fieldEquals('Gravatar', 'gravatarId0', 'id', 'gravatarId0')
  assert.fieldEquals('Gravatar', '12345', 'owner', '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
  assert.fieldEquals('Gravatar', '3546', 'displayName', 'cap')

  // Clear the store in order to start the next test off on a clean slate
  clearStore()
})

test('Next test', () => {
  //...
})
```

That's a lot to unpack! First off, an important thing to notice is that we're importing things from `matchstick-as`, our AssemblyScript helper library (distributed as an npm module). You can find the repository [here](https://github.com/LimeChain/matchstick-as). `matchstick-as` provides us with useful testing methods and also defines the `test()` function which we will use to build our test blocks. The rest of it is pretty straightforward - here's what happens:

- We're setting up our initial state and adding one custom Gravatar entity;
- We define two `NewGravatar` event objects along with their data, using the `createNewGravatarEvent()` function;
- We're calling out handler methods for those events - `handleNewGravatars()` and passing in the list of our custom events;
- We assert the state of the store. How does that work? - We're passing a unique combination of Entity type and id. Then we check a specific field on that Entity and assert that it has the value we expect it to have. We're doing this both for the initial Gravatar Entity we added to the store, as well as the two Gravatar entities that gets added when the handler function is called;
- And lastly - we're cleaning the store using `clearStore()` so that our next test can start with a fresh and empty store object. We can define as many test blocks as we want.

There we go - we've created our first test! 👏

Now in order to run our tests you simply need to run the following in your subgraph root folder:

`graph test Gravity`

And if all goes well you should be greeted with the following:

![Matchstick saying “All tests passed!”](/img/matchstick-tests-passed.png)

## Common test scenarios

### Hydrating the store with a certain state

Users are able to hydrate the store with a known set of entities. Here's an example to initialise the store with a Gravatar entity:

```typescript
let gravatar = new Gravatar('entryId')
gravatar.save()
```

### Calling a mapping function with an event

A user can create a custom event and pass it to a mapping function that is bound to the store:

```typescript
import { store } from 'matchstick-as/assembly/store'
import { NewGravatar } from '../../generated/Gravity/Gravity'
import { handleNewGravatars, createNewGravatarEvent } from './mapping'

let newGravatarEvent = createNewGravatarEvent(12345, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')

handleNewGravatar(newGravatarEvent)
```

### Calling all of the mappings with event fixtures

Users can call the mappings with test fixtures.

```typescript
import { NewGravatar } from '../../generated/Gravity/Gravity'
import { store } from 'matchstick-as/assembly/store'
import { handleNewGravatars, createNewGravatarEvent } from './mapping'

let newGravatarEvent = createNewGravatarEvent(12345, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')

let anotherGravatarEvent = createNewGravatarEvent(3546, '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 'cap', 'pac')

handleNewGravatars([newGravatarEvent, anotherGravatarEvent])
```

```
export function handleNewGravatars(events: NewGravatar[]): void {
    events.forEach(event => {
        handleNewGravatar(event);
    });
}
```

### Mocking contract calls

Users can mock contract calls:

```typescript
import { addMetadata, assert, createMockedFunction, clearStore, test } from 'matchstick-as/assembly/index'
import { Gravity } from '../../generated/Gravity/Gravity'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'

let contractAddress = Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
let expectedResult = Address.fromString('0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947')
let bigIntParam = BigInt.fromString('1234')
createMockedFunction(contractAddress, 'gravatarToOwner', 'gravatarToOwner(uint256):(address)')
  .withArgs([ethereum.Value.fromSignedBigInt(bigIntParam)])
  .returns([ethereum.Value.fromAddress(Address.fromString('0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947'))])

let gravity = Gravity.bind(contractAddress)
let result = gravity.gravatarToOwner(bigIntParam)

assert.equals(ethereum.Value.fromAddress(expectedResult), ethereum.Value.fromAddress(result))
```

As demonstrated, in order to mock a contract call and hardcore a return value, the user must provide a contract address, function name, function signature, an array of arguments, and of course - the return value.

Users can also mock function reverts:

```typescript
let contractAddress = Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
createMockedFunction(contractAddress, 'getGravatar', 'getGravatar(address):(string,string)')
  .withArgs([ethereum.Value.fromAddress(contractAddress)])
  .reverts()
```

### Mocking IPFS files (old/deprecated)

!Note: For testing `file/ipfs` templates see [here](#testing-fileipfs-templates)

Users can mock IPFS files by using `mockIpfsFile(hash, filePath)` function. The function accepts two arguments, the first one is the IPFS file hash/path and the second one is the path to a local file.

NOTE: When testing `ipfs.map/ipfs.mapJSON`, the callback function must be exported from the test file in order for matchstck to detect it, like the `processGravatar()` function in the test example bellow:

`.test.ts` file:

```typescript
import { assert, test, mockIpfsFile } from 'matchstick-as/assembly/index'
import { ipfs } from '@graphprotocol/graph-ts'
import { gravatarFromIpfs } from './utils'

// Export ipfs.map() callback in order for matchstck to detect it
export { processGravatar } from './utils'

test('ipfs.cat', () => {
  mockIpfsFile('ipfsCatfileHash', 'tests/ipfs/cat.json')

  assert.entityCount(GRAVATAR_ENTITY_TYPE, 0)

  gravatarFromIpfs()

  assert.entityCount(GRAVATAR_ENTITY_TYPE, 1)
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, '1', 'imageUrl', 'https://i.ytimg.com/vi/MELP46s8Cic/maxresdefault.jpg')

  clearStore()
})

test('ipfs.map', () => {
  mockIpfsFile('ipfsMapfileHash', 'tests/ipfs/map.json')

  assert.entityCount(GRAVATAR_ENTITY_TYPE, 0)

  ipfs.map('ipfsMapfileHash', 'processGravatar', Value.fromString('Gravatar'), ['json'])

  assert.entityCount(GRAVATAR_ENTITY_TYPE, 3)
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, '1', 'displayName', 'Gravatar1')
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, '2', 'displayName', 'Gravatar2')
  assert.fieldEquals(GRAVATAR_ENTITY_TYPE, '3', 'displayName', 'Gravatar3')
})
```

`utils.ts` file:

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
import { assert } from 'matchstick-as/assembly/index'
import { Gravatar } from '../generated/schema'

let gravatar = new Gravatar('gravatarId0')
gravatar.save()

assert.fieldEquals('Gravatar', 'gravatarId0', 'id', 'gravatarId0')
```

Running the assert.fieldEquals() function will check for equality of the given field against the given expected value. The test will fail and an error message will be outputted if the values are **NOT** equal. Otherwise the test will pass successfully.

### Interacting with Event metadata

Users can use default transaction metadata, which could be returned as an ethereum.Event by using the `newMockEvent()` function. The following example shows how you can read/write to those fields on the Event object:

```typescript
// Read
let logType = newGravatarEvent.logType

// Write
let UPDATED_ADDRESS = '0xB16081F360e3847006dB660bae1c6d1b2e17eC2A'
newGravatarEvent.address = Address.fromString(UPDATED_ADDRESS)
```

### Asserting variable equality

```typescript
assert.equals(ethereum.Value.fromString("hello"); ethereum.Value.fromString("hello"));
```

### Asserting that an Entity is **not** in the store

Users can assert that an entity does not exist in the store. The function takes an entity type and an id. If the entity is in fact in the store, the test will fail with a relevant error message. Here's a quick example of how to use this functionality:

```typescript
assert.notInStore('Gravatar', '23')
```

### Printing the whole store, or single entities from it (for debug purposes)

You can print the whole store to the console using this helper function:

```typescript
import { logStore } from 'matchstick-as/assembly/store'

logStore()
```

As of version 0.6.0, `logStore` no longer prints derived fields, instead users can use the new `logEntity` function. Of course `logEntity` can be used to print any entity, not just ones that have derived fields.
`logEntity` takes the entity type, entity id and a `showRelated` flag to indicate if users want to print the related derived entities.

```
import { logEntity } from 'matchstick-as/assembly/store'


logEntity("Gravatar", 23, true)
```

### Expected failure

Users can have expected test failures, using the shouldFail flag on the test() functions:

```typescript
test(
  'Should throw an error',
  () => {
    throw new Error()
  },
  true,
)
```

If the test is marked with shouldFail = true but DOES NOT fail, that will show up as an error in the logs and the test block will fail. Also, if it's marked with shouldFail = false (the default state), the test executor will crash.

### Logging

Having custom logs in the unit tests is exactly the same as logging in the mappings. The difference is that the log object needs to be imported from matchstick-as rather than graph-ts. Here's a simple example with all non-critical log types:

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
test('Blow everything up', () => {
  log.critical('Boom!')
})
```

Logging critical errors will stop the execution of the tests and blow everything up. After all - we want to make sure you're code doesn't have critical logs in deployment, and you should notice right away if that were to happen.

### Testing derived fields

Testing derived fields is a feature which allows users to set a field on a certain entity and have another entity be updated automatically if it derives one of its fields from the first entity.

Before version `0.6.0` it was possible to get the derived entities by accessing them as entity fields/properties, like so:
```typescript
let entity = ExampleEntity.load("id")
let derivedEntity = entity.derived_entity
```

As of version `0.6.0`, this is done by using the `loadRelated` function of graph-node, the derived entities can be accessed the same way as in the handlers.

```typescript
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

  assert.assertNull(mainAccount.get("nameSignalTransactions"))
  assert.assertNull(mainAccount.get("operatorOf"))

  const nameSignalTransactions = mainAccount.nameSignalTransactions.load();
  const operatorsOfMainAccount = mainAccount.operatorOf.load();
  
  assert.i32Equals(2, nameSignalTransactions.length)
  assert.i32Equals(1, operatorsOfMainAccount.length)

  assert.stringEquals("1", operatorsOfMainAccount[0].id)

  mockNameSignalTransaction("2345", mainAccount.id)

  let nst = NameSignalTransaction.load("1234")!
  nst.signer = "11"
  nst.save()

  store.remove("NameSignalTransaction", "2")

  mainAccount = GraphAccount.load("12")!
  assert.i32Equals(1, mainAccount.nameSignalTransactions.load().length)
})
```

### Testing `loadInBlock`

As of version `0.6.0`, users can test `loadInBlock` by using the `mockInBlockStore`, it allows mocking entities in the block cache.

```typescript
import { afterAll, beforeAll, describe, mockInBlockStore, test } from "matchstick-as"
import { Gravatar } from "../../generated/schema"

describe("loadInBlock", () => {
  beforeAll(() => {
    mockInBlockStore("Gravatar", "gravatarId0", gravatar);
  })

  afterAll(() => {
    clearInBlockStore()
  })

  test("Can use entity.loadInBlock() to retrieve entity from cache store in the current block", () => {
    let retrievedGravatar = Gravatar.loadInBlock("gravatarId0")
    assert.stringEquals("gravatarId0", retrievedGravatar!.get("id")!.toString())
  })

  test("Returns null when calling entity.loadInBlock() if an entity doesn't exist in the current block", () => {
    let retrievedGravatar = Gravatar.loadInBlock("IDoNotExist")
    assert.assertNull(retrievedGravatar)
  })
})
```

### Testing dynamic data sources

Testing dynamic data sources can be be done by mocking the return value of the `context()`, `address()` and `network()` functions of the dataSource namespace. These functions currently return the following: `context()` - returns an empty entity (DataSourceContext), `address()` - returns `0x0000000000000000000000000000000000000000`, `network()` - returns `mainnet`. The `create(...)` and `createWithContext(...)` functions are mocked to do nothing so they don't need to be called in the tests at all. Changes to the return values can be done through the functions of the `dataSourceMock` namespace in `matchstick-as` (version 0.3.0+).

Example below:

First we have the following event handler (which has been intentionally repurposed to showcase datasource mocking):

```typescript
export function handleApproveTokenDestinations(event: ApproveTokenDestinations): void {
  let tokenLockWallet = TokenLockWallet.load(dataSource.address().toHexString())!
  if (dataSource.network() == 'rinkeby') {
    tokenLockWallet.tokenDestinationsApproved = true
  }
  let context = dataSource.context()
  if (context.get('contextVal')!.toI32() > 0) {
    tokenLockWallet.setBigInt('tokensReleased', BigInt.fromI32(context.get('contextVal')!.toI32()))
  }
  tokenLockWallet.save()
}
```

And then we have the test using one of the methods in the dataSourceMock namespace to set a new return value for all of the dataSource functions:

```typescript
import { assert, test, newMockEvent, dataSourceMock } from 'matchstick-as/assembly/index'
import { BigInt, DataSourceContext, Value } from '@graphprotocol/graph-ts'

import { handleApproveTokenDestinations } from '../../src/token-lock-wallet'
import { ApproveTokenDestinations } from '../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { TokenLockWallet } from '../../generated/schema'

test('Data source simple mocking example', () => {
  let addressString = '0xA16081F360e3847006dB660bae1c6d1b2e17eC2A'
  let address = Address.fromString(addressString)

  let wallet = new TokenLockWallet(address.toHexString())
  wallet.save()
  let context = new DataSourceContext()
  context.set('contextVal', Value.fromI32(325))
  dataSourceMock.setReturnValues(addressString, 'rinkeby', context)
  let event = changetype<ApproveTokenDestinations>(newMockEvent())

  assert.assertTrue(!wallet.tokenDestinationsApproved)

  handleApproveTokenDestinations(event)

  wallet = TokenLockWallet.load(address.toHexString())!
  assert.assertTrue(wallet.tokenDestinationsApproved)
  assert.bigIntEquals(wallet.tokensReleased, BigInt.fromI32(325))

  dataSourceMock.resetValues()
})
```

Notice that dataSourceMock.resetValues() is called at the end. That's because the values are remembered when they are changed and need to be reset if you want to go back to the default values.

### Testing dynamic data source creation

As of version `0.6.0`, it is possible to test if a new data source has been created from a template. This feature supports both ethereum/contract and file/ipfs templates. There are four functions for this:
- `assert.dataSourceCount(templateName, expectedCount)` can be used to assert the expected count of data sources from the specified template
- `assert.dataSourceExists(templateName, address/ipfsHash)` asserts that a data source with the specified identifier (could be a contract address or IPFS file hash) from a specified template was created
- `logDataSources(templateName)` prints all data sources from the specified template to the console for debugging purposes
- `readFile(path)` reads a JSON file that represents an IPFS file and returns the content as Bytes

#### Testing `ethereum/contract` templates
```typescript
test("ethereum/contract dataSource creation example", () => {
    // Assert there are no dataSources created from GraphTokenLockWallet template
    assert.dataSourceCount("GraphTokenLockWallet", 0);

    // Create a new GraphTokenLockWallet datasource with address 0xA16081F360e3847006dB660bae1c6d1b2e17eC2A
    GraphTokenLockWallet.create(Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"));
    
    // Assert the dataSource has been created
    assert.dataSourceCount("GraphTokenLockWallet", 1);
    
    // Add a second dataSource with context
    let context = new DataSourceContext()
    context.set("contextVal", Value.fromI32(325))
    
    GraphTokenLockWallet.createWithContext(Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B"), context);
    
    // Assert there are now 2 dataSources 
    assert.dataSourceCount("GraphTokenLockWallet", 2);

    // Assert that a dataSource with address "0xA16081F360e3847006dB660bae1c6d1b2e17eC2B" was created
    // Keep in mind that `Address` type is transformed to lower case when decoded, so you have to pass the address as all lower case when asserting if it exists
    assert.dataSourceExists("GraphTokenLockWallet", "0xA16081F360e3847006dB660bae1c6d1b2e17eC2B".toLowerCase());
    
    logDataSources("GraphTokenLockWallet");
  })
```

##### Example `logDataSource` output

```bash
🛠  {
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a": {
    "kind": "ethereum/contract",
    "name": "GraphTokenLockWallet",
    "address": "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
    "context": null
  },
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2b": {
    "kind": "ethereum/contract",
    "name": "GraphTokenLockWallet",
    "address": "0xa16081f360e3847006db660bae1c6d1b2e17ec2b",
    "context": {
      "contextVal": {
        "type": "Int",
        "data": 325
      }
    }
  }
}
```

#### Testing `file/ipfs` templates
Similarly to contract dynamic data sources, users can test test file datas sources and their handlers

##### Example `subgraph.yaml`:
```yaml
...
templates:
 - kind: file/ipfs
    name: GraphTokenLockMetadata
    network: mainnet
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      file: ./src/token-lock-wallet.ts
      handler: handleMetadata
      entities:
        - TokenLockMetadata
      abis:
        - name: GraphTokenLockWallet
          file: ./abis/GraphTokenLockWallet.json
```

##### Example `schema.graphql`:

```graphql
"""
Token Lock Wallets which hold locked GRT
"""
type TokenLockMetadata @entity {
  "The address of the token lock wallet"
  id: ID!
  "Start time of the release schedule"
  startTime: BigInt!
  "End time of the release schedule"
  endTime: BigInt!
  "Number of periods between start time and end time"
  periods: BigInt!
  "Time when the releases start"
  releaseStartTime: BigInt!
}
```

##### Example `metadata.json`:

```json
{
    "startTime": 1,
    "endTime": 1,
    "periods": 1,
    "releaseStartTime": 1
}
```

##### Example handler:

```typescript
export function handleMetadata(content: Bytes): void {
  // dataSource.stringParams() returns the File DataSource CID
  // stringParam() will be mocked in the handler test
  // for more info https://thegraph.com/docs/en/developing/creating-a-subgraph/#create-a-new-handler-to-process-files
  let tokenMetadata = new TokenLockMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject()
  
  if (value) {
    const startTime = value.get('startTime')
    const endTime = value.get('endTime')
    const periods = value.get('periods')
    const releaseStartTime = value.get('releaseStartTime')

    if (startTime && endTime && periods && releaseStartTime) {
      tokenMetadata.startTime = startTime.toBigInt()
      tokenMetadata.endTime = endTime.toBigInt()
      tokenMetadata.periods = periods.toBigInt()
      tokenMetadata.releaseStartTime = releaseStartTime.toBigInt()
    }

    tokenMetadata.save()
  }
}
```


##### Example test:
```typescript
import { assert, test,  dataSourceMock, readFile } from "matchstick-as"
import { Address, BigInt, Bytes, DataSourceContext, ipfs, json, store, Value } from "@graphprotocol/graph-ts"

import { handleMetadata } from "../../src/token-lock-wallet"
import { TokenLockMetadata } from "../../generated/schema"
import { GraphTokenLockMetadata } from "../../generated/templates"

test("file/ipfs dataSource creation example", () => {
  // Generate the dataSource CID from the ipfsHash + ipfs path file
  // For example QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm/example.json
  const ipfshash = 'QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm'
  const CID = `${ipfshash}/example.json`
    
  // Create a new dataSource using the generated CID
  GraphTokenLockMetadata.create(CID);

  // Assert the dataSource has been created
  assert.dataSourceCount("GraphTokenLockMetadata", 1);
  assert.dataSourceExists("GraphTokenLockMetadata", CID);
  logDataSources("GraphTokenLockMetadata");

  // Now we have to mock the dataSource metadata and specifically dataSource.stringParam()
  // dataSource.stringParams actually uses the value of dataSource.address(), so we will mock the address using dataSourceMock from  matchstick-as 
 // First we will reset the values and then use dataSourceMock.setAddress() to set the CID
  dataSourceMock.resetValues()
  dataSourceMock.setAddress(CID);

  // Now we need to generate the Bytes to pass to the dataSource handler
  // For this case we introduced a new function readFile, that reads a local json and returns the content as Bytes
  const content = readFile(`path/to/metadata.json`)
  handleMetadata(content)
    
 // Now we will test if a TokenLockMetadata was created
 const metadata = TokenLockMetadata.load(CID);
    
  assert.bigIntEquals(metadata!.endTime, BigInt.fromI32(1))
  assert.bigIntEquals(metadata!.periods, BigInt.fromI32(1))
  assert.bigIntEquals(metadata!.releaseStartTime, BigInt.fromI32(1))
  assert.bigIntEquals(metadata!.startTime, BigInt.fromI32(1))
})
```


## Test Coverage

Using **Matchstick**, subgraph developers are able to run a script that will calculate the test coverage of the written unit tests.

The test coverage tool takes the compiled test `wasm` binaries and converts them to `wat` files, which can then be easily inspected to see whether or not the handlers defined in `subgraph.yaml` have been called. Since code coverage (and testing as whole) is in very early stages in AssemblyScript and WebAssembly, **Matchstick** cannot check for branch coverage. Instead we rely on the assertion that if a given handler has been called, the event/function for it have been properly mocked.

### Prerequisites

To run the test coverage functionality provided in **Matchstick**, there are a few things you need to prepare beforehand:

#### Export your handlers

In order for **Matchstick** to check which handlers are being run, those handlers need to be exported from the **test file**. So for instance in our example, in our gravity.test.ts file we have the following handler being imported:

```typescript
import { handleNewGravatar } from '../../src/gravity'
```

In order for that function to be visible (for it to be included in the `wat` file **by name**) we need to also export it, like this:

```typescript
export { handleNewGravatar }
```

### Usage

Once that's all set up, to run the test coverage tool, simply run:

```sh
graph test -- -c
```

You could also add a custom `coverage` command to your `package.json` file, like so:

```typescript
 "scripts": {
    /.../
    "coverage": "graph test -- -c"
  },
```

That will execute the coverage tool and you should see something like this in the terminal:

```sh
$ graph test -c
Skipping download/install step because binary already exists at /Users/petko/work/demo-subgraph/node_modules/binary-install-raw/bin/0.4.0

___  ___      _       _         _   _      _
|  \/  |     | |     | |       | | (_)    | |
| .  . | __ _| |_ ___| |__  ___| |_ _  ___| | __
| |\/| |/ _` | __/ __| '_ \/ __| __| |/ __| |/ /
| |  | | (_| | || (__| | | \__ \ |_| | (__|   <
\_|  |_/\__,_|\__\___|_| |_|___/\__|_|\___|_|\_\

Compiling...

Running in coverage report mode.
 ️
Reading generated test modules... 🔎️

Generating coverage report 📝

Handlers for source 'Gravity':
Handler 'handleNewGravatar' is tested.
Handler 'handleUpdatedGravatar' is not tested.
Handler 'handleCreateGravatar' is tested.
Test coverage: 66.7% (2/3 handlers).

Handlers for source 'GraphTokenLockWallet':
Handler 'handleTokensReleased' is not tested.
Handler 'handleTokensWithdrawn' is not tested.
Handler 'handleTokensRevoked' is not tested.
Handler 'handleManagerUpdated' is not tested.
Handler 'handleApproveTokenDestinations' is not tested.
Handler 'handleRevokeTokenDestinations' is not tested.
Test coverage: 0.0% (0/6 handlers).

Global test coverage: 22.2% (2/9 handlers).
```

### Test run time duration in the log output

The log output includes the test run duration. Here's an example:

`[Thu, 31 Mar 2022 13:54:54 +0300] Program executed in: 42.270ms.`

## Common compiler errors

> Critical: Could not create WasmInstance from valid module with context: unknown import: wasi_snapshot_preview1::fd_write has not been defined

This means you have used `console.log` in your code, which is not supported by AssemblyScript. Please consider using the [Logging API](/developing/assemblyscript-api/#logging-api)

> ERROR TS2554: Expected ? arguments, but got ?.
>
> return new ethereum.Block(defaultAddressBytes, defaultAddressBytes, defaultAddressBytes, defaultAddress, defaultAddressBytes, defaultAddressBytes, defaultAddressBytes, defaultBigInt, defaultBigInt, defaultBigInt, defaultBigInt, defaultBigInt, defaultBigInt, defaultBigInt, defaultBigInt);
>
> in ~lib/matchstick-as/assembly/defaults.ts(18,12)
>
> ERROR TS2554: Expected ? arguments, but got ?.
>
> return new ethereum.Transaction(defaultAddressBytes, defaultBigInt, defaultAddress, defaultAddress, defaultBigInt, defaultBigInt, defaultBigInt, defaultAddressBytes, defaultBigInt);
>
> in ~lib/matchstick-as/assembly/defaults.ts(24,12)

The mismatch in arguments is caused by mismatch in `graph-ts` and `matchstick-as`. The best way to fix issues like this one is to update everything to the latest released version.

## Feedback

If you have any questions, feedback, feature requests or just want to reach out, the best place would be The Graph Discord where we have a dedicated channel for Matchstick, called 🔥| unit-testing.