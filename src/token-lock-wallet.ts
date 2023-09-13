import { BigInt, Bytes, dataSource, json } from '@graphprotocol/graph-ts'
import {
  TokensReleased,
  TokensWithdrawn,
  TokensRevoked,
  ManagerUpdated,
  ApproveTokenDestinations,
  RevokeTokenDestinations,
} from '../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { TokenLockWallet, TokenLockMetadata } from '../generated/schema'

export function handleTokensReleased(event: TokensReleased): void {
  let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
  tokenLockWallet.tokensReleased = tokenLockWallet.tokensReleased.plus(event.params.amount)
  tokenLockWallet.save()
}

export function handleTokensWithdrawn(event: TokensWithdrawn): void {
  let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
  tokenLockWallet.tokensWithdrawn = tokenLockWallet.tokensWithdrawn.plus(event.params.amount)
  tokenLockWallet.save()
}

export function handleTokensRevoked(event: TokensRevoked): void {
  let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
  tokenLockWallet.tokensRevoked = tokenLockWallet.tokensRevoked.plus(event.params.amount)
  tokenLockWallet.save()
}

export function handleManagerUpdated(event: ManagerUpdated): void {
  let id = event.address.toHexString()
  let tokenLockWallet = TokenLockWallet.load(id)!
  tokenLockWallet.manager = event.params._newManager
  tokenLockWallet.save()
}

export function handleApproveTokenDestinations(event: ApproveTokenDestinations): void {
  let tokenLockWallet = TokenLockWallet.load(dataSource.address().toHexString())!
  if (dataSource.network() == "rinkeby") {
    tokenLockWallet.tokenDestinationsApproved = true
  }
  let context = dataSource.context()
  if (context.get("contextVal")!.toI32() > 0) {
    tokenLockWallet.setBigInt("tokensReleased", BigInt.fromI32(context.get("contextVal")!.toI32()))
  }
  tokenLockWallet.save()
}

export function handleRevokeTokenDestinations(event: RevokeTokenDestinations): void {
  let tokenLockWallet = TokenLockWallet.load(event.address.toHexString())!
  tokenLockWallet.tokenDestinationsApproved = false
  tokenLockWallet.save()
}

export function handleMetadata(content: Bytes): void {
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