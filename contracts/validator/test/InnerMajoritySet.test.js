const OuterSet = artifacts.require("OuterSet");
const InnerMajoritySet = artifacts.require("InnerMajoritySet");
// const { BigNumber } = require("web3");

contract("InnerMajoritySet", () => {
  const initialValidators = [
    "0xfc4c1475c4dabfcbb49dc2138337f9db8eedff58",
    "0xa2557ab1f214600a7ad1fa12fcad0c97135eeea6",
    "0x442290b65483db5f2520b1e8609bd3e47fd3f3c4"
  ];

  describe("constructor", () => {
    it("sets the outerSet address", async () => {
      const outer = await OuterSet.deployed();
      const set = await InnerMajoritySet.new(outer.address);
      const outerAddress = await set.outerSet();
      assert.equal(outer.address, outerAddress);
    });

    it("sets the outerSet address to 5 if passed in 0", async () => {
      const set = await InnerMajoritySet.new(0);
      const outerAddress = await set.outerSet();
      const expected = "0x0000000000000000000000000000000000000005";
      assert.equal(expected, outerAddress);
    });
  });

  describe("getValidators", () => {
    it("gets the validators", async () => {
      const set = await InnerMajoritySet.new(0);
      const [validatorSet, length] = await set.getValidators();

      assert.equal(length, 3);
      assert.equal(validatorSet[0], initialValidators[0]);
      assert.equal(validatorSet[1], initialValidators[1]);
      assert.equal(validatorSet[2], initialValidators[2]);
      assert.equal(
        validatorSet[3],
        "0x0000000000000000000000000000000000000000"
      );
    });
  });

  describe("addSupport", () => {
    it("gets support for a validator", async () => {
      const set = await InnerMajoritySet.deployed();
      const toAddr = initialValidators[1];
      const initialSupport = await set.getSupport(toAddr);
      assert.equal(initialSupport.toString(), "3");
    });
  });
});
