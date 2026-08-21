(function (global) {
  var KEYS = {
    listings: "qinqing_listings",
    interests: "qinqing_interests",
    profile: "qinqing_profile"
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function ensureListings() {
    var saved = read(KEYS.listings, null);
    if (!saved) {
      write(KEYS.listings, global.QINQING_SEED.listings.slice());
      return global.QINQING_SEED.listings.slice();
    }
    var seedIds = global.QINQING_SEED.listings.map(function (item) { return item.id; });
    var extras = saved.filter(function (item) { return seedIds.indexOf(item.id) === -1; });
    var merged = global.QINQING_SEED.listings.concat(extras);
    write(KEYS.listings, merged);
    return merged;
  }

  var Store = {
    profile: function () {
      return read(KEYS.profile, { id: "me", name: "访客", phone: "" });
    },
    saveProfile: function (profile) {
      write(KEYS.profile, profile);
    },
    listings: function () {
      return ensureListings();
    },
    listingById: function (id) {
      return this.listings().filter(function (item) { return item.id === id; })[0] || null;
    },
    addListing: function (listing) {
      var list = this.listings();
      listing.id = listing.id || uid("own");
      listing.source = "owner";
      listing.ownerId = "me";
      listing.createdAt = Date.now();
      list.unshift(listing);
      write(KEYS.listings, list);
      return listing;
    },
    removeListing: function (id) {
      var list = this.listings().filter(function (item) { return item.id !== id; });
      write(KEYS.listings, list);
    },
    myListings: function () {
      return this.listings().filter(function (item) { return item.ownerId === "me"; });
    },
    interests: function () {
      return read(KEYS.interests, []);
    },
    addInterest: function (interest) {
      var list = this.interests();
      interest.id = uid("int");
      interest.createdAt = Date.now();
      list.unshift(interest);
      write(KEYS.interests, list);
      return interest;
    },
    removeInterest: function (id) {
      write(KEYS.interests, this.interests().filter(function (item) { return item.id !== id; }));
    }
  };

  global.QinqingStore = Store;
})(window);
