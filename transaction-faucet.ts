import BigNum from '@liskhq/bignum';
import { BaseTransaction, StateStore, StateStorePrepare } from '@liskhq/lisk-transactions';
import * as transactions from '@liskhq/lisk-transactions';

export type FaucetTransactionAsset = {
    recipientId: string;
    amount: string;
}

export class FaucetTransaction extends BaseTransaction {

    public readonly asset: Readonly<FaucetTransactionAsset>;

    static TYPE = 777;

    validateAsset(): ReadonlyArray<transactions.TransactionError> {
        return [];
    }

    async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([ { address: this.asset.recipientId } ]);
    }

    applyAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {

        const recipient = store.account.get(this.asset.recipientId);

        store.account.set(this.asset.recipientId, {
            ...recipient,
            balance: new BigNum(recipient.balance).add(this.asset.amount).toString(),
        });

        return [];
    }

    undoAsset(store: StateStore): ReadonlyArray<transactions.TransactionError> {

        const recipient = store.account.get(this.asset.recipientId);

        store.account.set(this.asset.recipientId, {
            ...recipient,
            balance: new BigNum(recipient.balance).sub(this.asset.amount).toString(),
        });

        return [];
    }
}
