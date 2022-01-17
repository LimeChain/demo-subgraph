import { assert, test } from "matchstick-as/assembly/index"
import { NameSignalTransaction, GraphAccount } from "../../generated/schema"

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
