import { Gravatar, Transaction } from "../generated/schema"
import { NewGravatar, UpdatedGravatar, CreateGravatarCall } from "../generated/Gravity/Gravity"

export function handleNewGravatar(event: NewGravatar): void {
  let gravatar = new Gravatar(event.params.id.toHexString())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  let id = event.params.id.toHexString()
  let gravatar = Gravatar.load(id)
  if (gravatar == null) {
    gravatar = new Gravatar(id)
  }
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleCreateGravatar(call: CreateGravatarCall): void {
  let id = call.transaction.hash.toHex()
  let transaction = new Transaction(id)
  transaction.displayName = call.inputs._displayName
  transaction.imageUrl = call.inputs._imageUrl
  transaction.save()
}
