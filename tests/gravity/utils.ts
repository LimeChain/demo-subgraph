import { Address, ethereum, JSONValue, Value, ipfs, json, Bytes } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as/assembly/index"

import { Gravatar } from "../../generated/schema"
import { NewGravatar, Gravity } from "../../generated/Gravity/Gravity"
import { handleNewGravatar } from "../../src/gravity"

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach(event => {
    handleNewGravatar(event)
  })
}

let contractAddress = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
let contract = Gravity.bind(contractAddress)

export function saveGravatarFromContract(gravatarId: string): void {
  let contractGravatar = contract.getGravatar(contractAddress)

  let gravatar = new Gravatar(gravatarId)
  gravatar.displayName = contractGravatar.value0
  gravatar.imageUrl = contractGravatar.value1
  gravatar.owner = contractAddress
  gravatar.save()
}

export function trySaveGravatarFromContract(gravatarId: string): void {
  let contractGravatar = contract.try_getGravatar(contractAddress)

  if (!contractGravatar.reverted) {
    let gravatar = new Gravatar(gravatarId)
    gravatar.displayName = "Gravatar 48 new"
    gravatar.imageUrl = "https://example.com/image48_new.png"
    gravatar.owner = contractAddress
    gravatar.save()
  }
}

export function createNewGravatarEvent(id: i32, ownerAddress: string, displayName: string, imageUrl: string): NewGravatar {
  let newGravatarEvent = changetype<NewGravatar>(newMockEvent())
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

export function processGravatar(value: JSONValue, userData: Value): void {
  // See the JSONValue documentation for details on dealing
  // with JSON values
  let obj = value.toObject()
  let id = obj.get('id')
  let owner = obj.get('owner')
  let imageUrl = obj.get('imageUrl')

  if (!id || !imageUrl || !owner) {
    return
  }

  // Callbacks can also created entities
  let gravatar = new Gravatar(id.toString())
  gravatar.displayName = userData.toString() + id.toString()
  gravatar.imageUrl = imageUrl.toString()
  gravatar.owner = Address.fromString(owner.toString())
  gravatar.save()
}

export function gravatarFromIpfs(): void {
  let rawData = ipfs.cat("ipfsCatFileHash")

  if (!rawData) {
    return
  }

  let jsonData = json.fromBytes(rawData as Bytes).toObject()

  let id = jsonData.get('id')
  let imageUrl = jsonData.get("imageUrl")
  let owner = jsonData.get("owner")

  if (!id || !imageUrl || !owner) {
    return
  }

  let gravatar = new Gravatar(id.toString())
  gravatar.imageUrl = imageUrl.toString()
  gravatar.owner = Address.fromString(owner.toString())
  gravatar.displayName = "Gravatar " + id.toString()
  gravatar.save()
}
