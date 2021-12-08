import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, log } from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, dataSource, ethereum, store, typeConversion, Value } from "@graphprotocol/graph-ts"

import { GraphTokenLockWallet } from "../../generated/templates"
import { handleTokensReleased } from "../../src/token-lock-wallet"
import { TokensReleased } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { TokenLockWallet } from "../../generated/schema"

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