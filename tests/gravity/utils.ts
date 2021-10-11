import { NewGravatar } from "../../generated/Gravity/Gravity"

import { newMockEvent } from "matchstick-as/assembly/index"
import { Address, ethereum } from "@graphprotocol/graph-ts"

export function createNewGravatarEvent(id: i32, ownerAddress: string, displayName: string, imageUrl: string): NewGravatar {
    let mockEvent = newMockEvent()
    let newGravatarEvent = new NewGravatar(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
        mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)
    newGravatarEvent.parameters = new Array()
    let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(id))
    let addressParam = new ethereum.EventParam("ownderAddress", ethereum.Value.fromAddress(Address.fromString(ownerAddress)))
    let displayNameParam = new ethereum.EventParam("displayName", ethereum.Value.fromString(displayName))
    let imageUrlParam = new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl))

    newGravatarEvent.parameters.push(idParam)
    newGravatarEvent.parameters.push(addressParam)
    newGravatarEvent.parameters.push(displayNameParam)
    newGravatarEvent.parameters.push(imageUrlParam)

    return newGravatarEvent
}
