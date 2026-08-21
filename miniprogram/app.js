App({
  onLaunch() {
    const store = require("./utils/store");
    store.ensureListings();
    store.cms.ensureSeed();
  }
});
