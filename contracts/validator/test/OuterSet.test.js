const OuterSet = artifacts.require("OuterSet");

contract("OuterSet", accounts => {
  let set;

  beforeEach(async () => {
    set = await OuterSet.new();
  });

  it("should set the owner", async () => {
    const owner = await set.owner.call();
    assert.equal(owner, accounts[0]);
  });
});
