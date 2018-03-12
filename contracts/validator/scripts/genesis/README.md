# genesis/generate.js

Generates the Genesis block for Parity development. Requires Truffle.

```
truffle exec generate.js --help
```

## Example

```
truffle exec scripts/genesis/generate.js \
--validator=0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
--validator=0xa2557aB1F214600A7AD1fA12fCad0C97135eeEA6 \
--master=0xfC4C1475C4DaBfcBB49dc2138337F9db8eedfF58 \
--outer=0x0000000000000000000000000000000000000005 \
--inner=0x0000000000000000000000000000000000000006 \
--validatorsContract=0x0000000000000000000000000000000000000005
```
