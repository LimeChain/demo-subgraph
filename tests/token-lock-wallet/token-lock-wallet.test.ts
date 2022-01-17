import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, log, logStore } from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, dataSource, ethereum, store, typeConversion, Value } from "@graphprotocol/graph-ts"

import { GraphTokenLockWallet } from "../../generated/templates"
import { handleTokensReleased } from "../../src/token-lock-wallet"
import { TokensReleased } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { NameSignalTransaction, TokenLockWallet, GraphAccount } from "../../generated/schema"

let TOKEN_LOCK_WALLET_ENTITY_TYPE = "TokenLockWallet"

test("dynamic", () => {
    let initial = dataSource.address()
    GraphTokenLockWallet.create(Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"))
    log.debug("{}", [(dataSource.address() == initial).toString()])
    let address = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A")
    let wallet = new TokenLockWallet(address.toHexString())
    wallet.save()
    let event = changetype<TokensReleased>(newMockEvent())
    event.parameters.push(new ethereum.EventParam("address", ethereum.Value.fromAddress(address)))
    event.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromI32(15)))
    
    handleTokensReleased(event)
})

test("Derived fields example test", () => {
    let mainAccount = new GraphAccount("12")
    mainAccount.save()
    let operatedAccount = new GraphAccount("1")
    operatedAccount.operators = ["12"]
    operatedAccount.save()
    let nst = new NameSignalTransaction("1234")
    nst.signer = "12";
    nst.save()
    mainAccount = GraphAccount.load("12")!

    assert.i32Equals(1, mainAccount.nameSignalTransactions.length)
    assert.stringEquals("1", mainAccount.operatorOf[0])
})