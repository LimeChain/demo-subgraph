import { assert, test, newMockEvent, dataSourceMock, describe, beforeAll, afterAll, logDataSources, clearStore, mockIpfsFile, readFile, logStore } from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, DataSourceContext, ipfs, json, store, Value } from "@graphprotocol/graph-ts"

import { handleApproveTokenDestinations, handleMetadata } from "../../src/token-lock-wallet"
import { ApproveTokenDestinations } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { NameSignalTransaction, TokenLockWallet, GraphAccount, Subgraph, TokenLockMetadata } from "../../generated/schema"
import { mockGraphAccount, mockNameSignalTransaction } from "./utils"
import { GraphTokenLockWallet, GraphTokenLockMetadata } from "../../generated/templates"

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

  test("ethereum/contract dataSource creation example", () => {
    GraphTokenLockWallet.create(Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"));

    assert.dataSourceCount("GraphTokenLockWallet", 1);
    let context = new DataSourceContext()
    context.set("contextVal", Value.fromI32(325))
    GraphTokenLockWallet.createWithContext(Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B"), context);
    assert.dataSourceCount("GraphTokenLockWallet", 2);
    assert.dataSourceExists("GraphTokenLockWallet", "0xA16081F360e3847006dB660bae1c6d1b2e17eC2B".toLowerCase());
    logDataSources("GraphTokenLockWallet");
  })

  test("file/ipfs dataSource creation example", () => {
    const ipfshash = 'QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm'
    GraphTokenLockMetadata.create(ipfshash);

    assert.dataSourceCount("GraphTokenLockMetadata", 1);
    assert.dataSourceExists("GraphTokenLockMetadata", ipfshash);
    logDataSources("GraphTokenLockMetadata");

    const tokenIpfsAddress = `${ipfshash}.json`
    const content = readFile(`tests/ipfs/${tokenIpfsAddress}`)

    dataSourceMock.resetValues()

    let metaContext = new DataSourceContext()
    metaContext.set("address", Value.fromString(tokenIpfsAddress))
    dataSourceMock.setReturnValues(tokenIpfsAddress, "rinkeby", metaContext);

    handleMetadata(content)
    
    const metadata = TokenLockMetadata.load(tokenIpfsAddress);
    
    assert.bigIntEquals(metadata!.endTime, BigInt.fromI32(1))
    assert.bigIntEquals(metadata!.periods, BigInt.fromI32(1))
    assert.bigIntEquals(metadata!.releaseStartTime, BigInt.fromI32(1))
    assert.bigIntEquals(metadata!.startTime, BigInt.fromI32(1))

    logStore()
  })
})

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
})
