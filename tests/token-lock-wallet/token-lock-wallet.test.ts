import { assert, test, newMockEvent, dataSourceMock } from "matchstick-as/assembly/index"
import { Address, BigInt, DataSourceContext, store, Value } from "@graphprotocol/graph-ts"

import { handleApproveTokenDestinations } from "../../src/token-lock-wallet"
import { ApproveTokenDestinations } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { NameSignalTransaction, TokenLockWallet, GraphAccount } from "../../generated/schema"

test("Data source simple mocking example", () => {
    let addressString = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
    let address = Address.fromString(addressString)

    let wallet = new TokenLockWallet(address.toHexString())
    // This value should be set, because it is a required field, 
    // and from graph-cli 0.30.0 codegen does not generate default values for required fields anymore
    wallet.tokenDestinationsApproved = false
    wallet.save()
    let context = new DataSourceContext()
    context.set("contextVal", Value.fromI32(325))
    dataSourceMock.setReturnValues(addressString, "rinkeby", context)
    let event = changetype<ApproveTokenDestinations>(newMockEvent())

    assert.assertTrue(!wallet.tokenDestinationsApproved)

    handleApproveTokenDestinations(event)

    wallet = TokenLockWallet.load(address.toHexString())!
    assert.assertTrue(wallet.tokenDestinationsApproved)
    assert.bigIntEquals(wallet.tokensReleased, BigInt.fromI32(325))

    dataSourceMock.resetValues()
})

test("Derived fields example test", () => {
    let mainAccount = new GraphAccount("12")
    mainAccount.save()
    let operatedAccount = new GraphAccount("1")
    operatedAccount.operators = ["12"]
    operatedAccount.save()
    let nst = new NameSignalTransaction("1234")
    nst.signer = "12"
    nst.save()
    let nst2 = new NameSignalTransaction("2")
    nst2.signer = "12"
    nst2.save()

    assert.assertNull(mainAccount.get("nameSignalTransactions"))
    assert.assertNull(mainAccount.get("operatorOf"))

    mainAccount = GraphAccount.load("12")!

    assert.assertNotNull(mainAccount.get("nameSignalTransactions"))
    assert.assertNotNull(mainAccount.get("operatorOf"))
    assert.i32Equals(2, mainAccount.nameSignalTransactions.length)
    assert.stringEquals("1", mainAccount.operatorOf[0])

    let newNst = new NameSignalTransaction("2345");
    newNst.signer = "12"
    newNst.save()
    nst.signer = "11"
    nst.save()
    store.remove("NameSignalTransaction", "2")

    mainAccount = GraphAccount.load("12")!
    assert.i32Equals(1, mainAccount.nameSignalTransactions.length)
})
