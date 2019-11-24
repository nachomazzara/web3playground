# Web3 Playground

Test your contracts by creating your custom code snippets. Web3 1.X.X ready to be used.

### [Try it](https://web3playground.io)

_Examples:_

- Get the name of a contract:

  ```typescript
  async function main() {
    const name = await contract.methods.name().call()
    return name
  }
  ```

- Get owners of NFT:

  ```typescript
  async function main() {
    const tokenIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const owners = []

    for (let i = 0; i < tokenIds.length; i++) {
      const owner = await contract.methods.ownerOf(i).call()
      owners.push(owner)
    }

    return owners
  }
  ```

- Transfer tokens:

  ```typescript
  async function main() {
    const to = '0x...'
    const value = 1e18

    const txHash = await contract.methods.transfer(to, value).send()

    return txHash
  }
  ```

- Get ETH balance:

  ```typescript
  async function main() {
    const user = '0x..'
    const ethBalance = await web3.eth.getBalance(user)
    return ethBalance
  }
  ```

## Methods are typed!!

<img width="518" alt="Screen Shot 2019-11-24 at 19 42 47" src="https://user-images.githubusercontent.com/7549152/69502861-9a310600-0ef2-11ea-99f8-dc2aa11f37c0.png">

## How to use it

- Paste the address of the contract you want to try.
- Choose a name for the variable.
- If the contract is upgradeable by using the proxy pattern, select the checkbox.
- Code.

<img width="1028" alt="Screen Shot 2019-11-24 at 19 48 21" src="https://user-images.githubusercontent.com/7549152/69502939-61ddf780-0ef3-11ea-9dc3-8ec3e5cded25.png">

## FAQ

- **Is only javascript available?**

  Yes, the snippet runs in the browser.

- **Which proxy implementations are supported?**

  So far, the ones detected by topics as:

  - Event _`Upgrade(address,bytes)`_ = `0xe74baeef5988edac1159d9177ca52f0f3d68f624a1996f77467eb3ebfb316537`.

  - Event _`Upgraded(address)`_: `0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b`.

  - Implementation made by [OpenZeppelin](https://docs.openzeppelin.com/sdk/2.5/writing-contracts.html). Searching for the storage slot `0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3`

- **Which chains are supported?**

  Every RCP call is made to the network selected in your provider.

- **Which wallets are supported?**

  I 've tested it with a few. Also mobile. If you have a wallet and it is not supported, please let me know and I will add it.

- **Can I refresh the browser?**

  Yes! Contracts and code are stored at localstorage if any.

- **Can I contribute?**

  Yes! please, It will be awesome.

## Next

- Share code snippets by hosting them on IPFS
