import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall } from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, ethereum, store, Value } from "@graphprotocol/graph-ts"

import { Gravatar } from "../../generated/schema"
import { Gravity, NewGravatar, CreateGravatarCall } from "../../generated/Gravity/Gravity"
import { handleNewGravatars, saveGravatarFromContract, trySaveGravatarFromContract, handleCreateGravatar } from "../../src/gravity"
import { LendingPair } from "../../generated/templates/LendingPair/LendingPair"

// test("datasource", () => {
//     LendingPair.create(Address.fromString("0xB16081F360e3847006dB660bae1c6d1b2e17eC2A"))
//     handleApproval(changetype<Approval>(newMockEvent()))
// })