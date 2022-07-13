import { GraphAccount, NameSignalTransaction } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function mockGraphAccount(id: string): void {
  let account = new GraphAccount(id);
  account.createdAt = 0
  account.operators = []
  account.balance = BigInt.fromI32(0)
  account.curationApproval = BigInt.fromI32(0)
  account.stakingApproval = BigInt.fromI32(0)
  account.gnsApproval = BigInt.fromI32(0)
  account.subgraphQueryFees = BigInt.fromI32(0)
  account.tokenLockWallets = []
  account.save()
}

export function mockNameSignalTransaction(id: string, signer: string): void {
  let nst = new NameSignalTransaction(id);
  nst.signer = signer
  nst.blockNumber = 1
  nst.timestamp = 1
  nst.type = "stake"
  nst.nameSignal = BigInt.fromI32(1)
  nst.versionSignal = BigInt.fromI32(1)
  nst.tokens = BigInt.fromI32(1)
  nst.subgraph = "1"
  nst.save()
}
