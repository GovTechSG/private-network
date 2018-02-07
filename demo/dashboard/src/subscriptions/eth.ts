import { updateBlock } from "@src/actions";

// Need function for arguments
const log = tag =>
  // tslint:disable-next-line
  function(err, res) {
    console.log(tag, arguments); // tslint:disable-line
  };

export const subscribeLogs = () => {
  window.w3.eth.subscribe("logs", {}, log("logs"));
};

export const subscribePendingTransactions = () => {
  window.w3.eth.subscribe("pendingTransactions", log("pendingTransactions"));
};

export const subscribeNewBlockHeaders = () => {
  window.w3.eth.subscribe("newBlockHeaders", (err, res) => {
    log("newBlockHeaders")(err, res);
    if (!err) {
      // HACK!
      window.store.dispatch(updateBlock(res));
    }
  });
};

export const subscribeSyncing = () => {
  window.w3.eth.subscribe("syncing", log("syncing"));
};

export const subscribeAll = () => {
  subscribeLogs();
  subscribePendingTransactions();
  subscribeNewBlockHeaders();
  subscribeSyncing();
};
