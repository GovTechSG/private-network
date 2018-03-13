# Parity POA Network

[![Build Status](https://travis-ci.org/GovTechSG/private-network.svg?branch=master)](https://travis-ci.org/GovTechSG/private-network)

This is an example implementation of
[Proof of Authority](https://paritytech.github.io/wiki/Proof-of-Authority-Chains)
consesus network as implemented by the [Parity](https://github.com/paritytech/parity) Ethereum
client. The validator set is backed by a smart contract.

## Running

```bash
docker-compose up
```

## Generating the Genesis block from the contracts

For example, to generate a new genesis block from the edited source code using the pre-setup accounts,
we can run:

```bash
cd contracts/validator/
yarn --silent generate:genesis \
    --master 0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
    -v 0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
    -v 0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6 \
    -v 0x442290b65483DB5F2520b1E8609Bd3e47fd3F3C4 \
    --stderr \
    2> ../../config/demo_poa.json

```

## Nodes Description

Master node vs Authority node
"Observer" nodes

## Adding a new initial authority node

## Deploy and use new `InnerSet` contracts

## Adding a new authority node after network is setup

First, you would have to setup a new authority node as if it was an initial authority node, except
you don't add its address into the `InnerSetInitial` contract.

Then, make sure you have deployed a new `InnerSet` contract that supports adding new validators.
The example here will demonstrate using the `InnerMajoritySet` contract.

- Unlock the account for a validator (for some reason `truffle console` doesn't work?)
- Using truffle console, do something like

```javascript
InnerMajoritySet.deployed()
    .then(instance => instance.addSupport("0x"))
```

Do this for the number of validators needed for the vote to pass.

## Adding a new observer node
