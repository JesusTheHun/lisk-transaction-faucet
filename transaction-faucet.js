const {
    transactions: { BaseTransaction },
    BigNum
} = require('lisk-sdk');

class FaucetTransaction extends BaseTransaction {
    static get TYPE () {
        return 777;
    }

    /**
     * Set the `CashbackTransaction` transaction FEE to 0.1 LSK.
     * Every time a user posts a transaction to the network, the transaction fee is paid to the delegate who includes the transaction into a block that the delegate forges.
     */
    static get FEE () {
        return 0;
    };

    validateAsset() {
        return [];
    }

    async prepare(store) {
        await store.account.cache([ { address: this.recipientId } ]);
    }

    /**
     * The CashbackTransaction adds an inflationary 10% to senders account.
     * Invoked as part of the apply() step of the BaseTransaction and block processing.
     */
    applyAsset(store) {

        const recipient = store.account.get(this.recipientId);

        store.account.set(this.recipientId, {
            ...recipient,
            balance: new BigNum(recipient.balance).add(this.amount).toString(),
        });

        return [];
    }

    /**
     * Inverse of applyAsset().
     * Undoes the changes made in `applyAsset` step: It sends the transaction amount back to the sender and substracts 10% of the transaction amount from the senders account balance.
     */
    undoAsset(store) {

        const recipient = store.account.get(this.recipientId);

        store.account.set(this.recipientId, {
            ...recipient,
            balance: new BigNum(recipient.balance).sub(this.amount).toString(),
        });

        return [];
    }
}

module.exports = FaucetTransaction;
