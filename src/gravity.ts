import { Address } from '@graphprotocol/graph-ts'

import { Gravatar, Transaction } from '../generated/schema'
import { Gravity, NewGravatar, UpdatedGravatar, CreateGravatarCall } from '../generated/Gravity/Gravity'

export function handleNewGravatar(event: NewGravatar): void {
  let gravatar = new Gravatar(event.params.id.toString())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleNewGravatars(events: NewGravatar[]): void {
  events.forEach(event => {
      handleNewGravatar(event)
  })
}

export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  let id = event.params.id.toHex()
  let gravatar = Gravatar.load(id)
  if (gravatar == null) {
    gravatar = new Gravatar(id)
  }
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

let contractAddress = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
let contract = Gravity.bind(contractAddress)

export function saveGravatarFromContract(gravatarId: string): void {
  let contractGravatar = contract.getGravatar(contractAddress)

  let gravatar = new Gravatar(gravatarId)
  gravatar.setString("value0", contractGravatar.value0)
  gravatar.setString("value1", contractGravatar.value1)
  gravatar.save()
}

export function trySaveGravatarFromContract(gravatarId: string): void {
  let contractGravatar = contract.try_getGravatar(contractAddress)

  if (!contractGravatar.reverted) {
      let contractGravatarValue = contractGravatar.value
      let gravatar = new Gravatar(gravatarId)
      gravatar.setString("value0", contractGravatarValue.value0)
      gravatar.setString("value1", contractGravatarValue.value1)
      gravatar.save()
  }
}

export function handleCreateGravatar(call: CreateGravatarCall): void {
  let id = call.transaction.hash.toHex()
  let transaction = new Transaction(id)
  transaction.displayName = call.inputs._displayName
  transaction.imageUrl = call.inputs._imageUrl
  transaction.save()
}
