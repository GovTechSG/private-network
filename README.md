# Parity POA Network

[![Build Status](https://travis-ci.org/GovTechSG/private-network.svg?branch=master)](https://travis-ci.org/GovTechSG/private-network)

This is an example implementation of
[Proof of Authority](https://paritytech.github.io/wiki/Proof-of-Authority-Chains)
consensus network as implemented by the [Parity](https://github.com/paritytech/parity) Ethereum
client. The validator set is backed by a smart contract.

## Contracts

The directory `contracts/validator` contains the contracts used to manage a set of Validator nodes
for the network. This set of contracts was based off the examples provided by
[Parity](https://github.com/paritytech/contracts/blob/master/validator_contracts).

The validator contract uses an upgradeable contract model, where there is an `Outer` contract
facade, or interface, that the Parity client will interact with. The job of the facade is to
redirect calls to an `Inner` contract, or the implementation.

In the future, the `contracts` directory will contain additional contracts to run the other
permissions that are supported by the Parity client. See the "Future Work" section below.

## Running the demo

The demo is set up with some "pre-baked" keys and accounts. _DO NOT_ use them in production. You can
use Docker and Docker Compose to run the network simply with:

```bash
docker-compose up
```

## Setting up a new network

In order to setup a new network, you will need the following:

- A set of initial Ethereum key pairs that will be used as an initial set of validators,
- A [chain specification](https://wiki.parity.io/Chain-specification) defining the parameters of the Proof of Authority chains used, along with the genesis block containing the initial accounts and contracts.
- Parity configuration to make use of the chain specification.

### Automatic setup

The [repository](https://github.com/GovTechSG/private-network-automated) contains the scripts and
instructions on how the process can be automated. We recommend that you use these scripts instead
of doing anything manually.

Some of the manual steps are documented below, but for most other omitted steps, we recommend
that you refer to our automated setup for more information.

### Generating Ethereum key pairs

You should use [geth](https://github.com/ethereum/go-ethereum) to generate new accounts.

For example:

```bash
geth account new --keystore /path/to/output/directory
```

### Generating a chain specification

The chain specification contains the initial contracts bytecode. For the full set of parameters,
run `yarn generate:genesis --help` in the `contracts/validator` directory.

```bash
cd contracts/validator
yarn --silent generate:genesis \
    --master 0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
    -v 0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
    -v 0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6 \
    -v 0x442290b65483DB5F2520b1E8609Bd3e47fd3F3C4 \
    --stderr \
    2> ../../config/demo_poa.json

```

### Writing the Parity configuration files

You should refer to the [documentation](https://wiki.parity.io/Configuring-Parity) for more details.
In particular, you would need to specify a set of initial "boot nodes" that clients will connect to.
To find out more about generating the "enode" IDs, you can refer to
[this section](https://github.com/GovTechSG/private-network-automated/blob/master/setup/README.md#about-enode-id).

## Type of nodes

- Validator/Authority Nodes: Nodes that will validate transactions and mint new blocks. They essentially maintain the security of the network.
- Master Node: A master node is simply a validator node with the additional responsibility of owning the validator contract. Ownership can be transferred to others.
- Observer nodes: Nodes that are not validators. They can join the network to observer transactions or to post transactions of their own.

## Post setup tasks

In the `contracts/validator` directory, there a CLI tool is included to automate some of the post
setup tasks that might encounter.

In order to run the CLI, you might have to configure the Ethereum network the CLI will connect to.
By default, the CLI will try to connect to an Ethereum JSON RPC on the localhost. You can find out
more information on network configuration
[here](http://truffleframework.com/docs/advanced/configuration).

### Upgrade validator `InnerSet` contract

As described above, the validator contracts are setup with an upgradeable facade. The initial
contract deployed with the Genesis block simply takes a fixed list of validators. In order to
support adding new validators or removing validators due to misbehaviour, we will need to upgrade
the contract.

This repository contains a contract implementation that can be used. For example, to upgrade the
initial InnerSet contract, we can do:

```bash
yarn --silent \
    cli inner deploy \
    --outerset 0x0000000000000000000000000000000000000005
```

### Adding a new validator node

Before you can add a new Validator node, you will have to upgrade the `InnerSet` contract as
described above.

Then, you will need to do the following:

- Create an Ethereum keypair (account) for the new validator. Make sure you have setup a new Parity client with the appropriate configuration and to use the same chain specification. The configuration can be the same as the one used for your existing validators.
- Use an existing validator to propose a new validator
- Use the other validators to vote to add support to the new validator. The current implementation requires at least a 50% vote.

You can propose a new validator with

```bash
yarn --silent \
    cli validator propose 0x0 \
    --outerset 0x0000000000000000000000000000000000000005
```

Then, you can add support to the pending validator with

```bash
yarn --silent \
    cli validator addsupport 0x0 \
    --outerset 0x0000000000000000000000000000000000000005
```

You can check current number of support for a validator with

```bash
yarn --silent \
    cli validator getsupport 0x0 \
    --outerset 0x0000000000000000000000000000000000000005
```

### Adding a new observer node

Setting up a new observer node is simply a matter of:

- Configuring and running a new parity client. The same configuration for existing clients can be used.
- Reusing the existing chain specification

## Future Work

[Additional permissions](https://wiki.parity.io/Permissioning) can be
added to the network via the use of additional contracts:

- Joining the network: This will allow a truly private network where only approved nodes will even be able to join the network to receive gossip and transaction details.
- Posting transactions: This will allow white-listing of accounts that will be able to post transactions. This allows the creation of a "read-only" public network. Only privately approved members will be able to post transaction.
- Zero gas price posting: If used with permission-less transaction posting, this allows the network to be rid of the "Ether" currency as a concept.
