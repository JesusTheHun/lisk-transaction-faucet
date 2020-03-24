# Lisk Faucet Transaction

#### Blockchain side

Import the transaction into your project

```js
const { FaucetTransaction } = require('lisk-transaction-faucet');

app.registerTransaction(FaucetTransaction);
```

Of course you should **only** activate it in a **development** environment.

#### Client Side

```js
const { FaucetTransaction } = require('lisk-transaction-faucet');

const tx =  new FaucetTransaction({
    senderPublicKey: somePublicKey, // the sender doesn't matter since nobody pay anything, but it sill needs to be valid
    timestamp: txTimestamp,
    asset: {
        amount: 42,
        recipientId: recipientAddress, // Faucet receiver
    }
});

tx.sign(senderAccountPassphrase);
```

