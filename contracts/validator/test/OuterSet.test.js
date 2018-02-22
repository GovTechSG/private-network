const assertRevert = require("./helpers/assertRevert").default;

const OuterSet = artifacts.require("OuterSet");
const InnerMajoritySet = artifacts.require("InnerMajoritySet");

contract("OuterSet", accounts => {
  let set;

  describe("constructor", () => {
    beforeEach(async () => {
      set = await OuterSet.new();
    });

    it("sets the owner", async () => {
      const owner = await set.owner.call();
      assert.equal(owner, accounts[0]);
    });

    it("has a default initial InnerSet in the genesis block", async () => {
      const expected = "0x0000000000000000000000000000000000000006";
      const actual = await set.innerSet.call();
      assert.equal(actual, expected);
    });

    it("sets the innerSet when passed in as a parameter", async () => {
      const expected = "0x0000000000000000000000000000000000001337";
      const testOuterSet = await OuterSet.new(expected);
      const actual = await testOuterSet.innerSet.call();
      assert.equal(actual, expected);
    });

    it("emits an OwnershipTransferred event", done => {
      const eventsFilter = set.allEvents({ fromBlock: 0, toBlock: "latest" });
      eventsFilter.get((err, logs) => {
        const expectedPreviousOwner =
          "0x0000000000000000000000000000000000000000";
        assert.equal(logs.length, 1);
        assert.equal(logs[0].args.previousOwner, expectedPreviousOwner);
        assert.equal(logs[0].args.newOwner, accounts[0]);
        done();
      });
    });
  });

  describe("transferOwnership", () => {
    beforeEach(async () => {
      set = await OuterSet.new();
    });

    it("can transfer ownership", async () => {
      const newOwner = "0x0000000000000000000000000000000000001337";
      const currentOwner = await set.owner.call();
      await set.transferOwnership.sendTransaction(newOwner, {
        from: currentOwner
      });
      const actual = await set.owner.call();
      assert.equal(actual, newOwner);
    });

    it("should prevent transferOwnership from non-owners", async () => {
      const notOwner = accounts[2];
      const owner = await set.owner();
      assert.notEqual(notOwner, owner);
      await assertRevert(set.transferOwnership(notOwner, { from: notOwner }));
    });
  });

  describe("setInner", () => {
    beforeEach(async () => {
      set = await OuterSet.deployed();
    });

    it("sets a new innerSet", async () => {
      const newInnerSet = await InnerMajoritySet.new(set.address);
      const newAddr = newInnerSet.address;

      await set.setInner(newAddr);

      const newInner = await set.innerSet();
      assert.equal(newInner, newAddr);
    });
  });

  describe("getValidators", () => {
    beforeEach(async () => {
      set = await OuterSet.deployed();
    });

    it("gets the list of validators", async () => {
      await OuterSet.deployed()
        .then(i => i.getValidators())
        .then(vs => {
          assert.equal(vs.length, 3);
        });
    });
  });
});
