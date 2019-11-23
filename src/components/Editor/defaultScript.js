/**
 * ************ This is an experimental dev feature ************
 *
 * Ready to use variables:
 * - 'contract' has a web3 Contract instance ready to be used.
 * - web3
 *
 * For More info check:
 * https://web3js.readthedocs.io/en/v1.2.2/web3-eth-contract.html#web3-eth-contract
 *
 * Web3 doc:
 * https://web3js.readthedocs.io/en/v1.2.2/
 *
 * The value returned should be convertible to a JSON string.
 *
 * Feedback is welcome :)
 */

async function main() {
  const name = await contract.methods.name().call()
  return name
}
