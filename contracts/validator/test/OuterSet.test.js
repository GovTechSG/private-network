const OuterSet = artifacts.require("OuterSet");

contract("OuterSet", accounts => {
  let set;

  beforeEach(async () => {
    set = await OuterSet.new();
  });

  describe("constructor", () => {
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
});
