const { seedListings } = require("../data/listings");

const KEYS = {
  listings: "qinqing_listings",
  interests: "qinqing_interests",
  profile: "qinqing_profile"
};

function read(key, fallback) {
  try {
    const value = wx.getStorageSync(key);
    return value || fallback;
  } catch (e) {
    return fallback;
  }
}

function write(key, value) {
  wx.setStorageSync(key, value);
}

function uid(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function ensureListings() {
  const saved = read(KEYS.listings, null);
  if (!saved || !saved.length) {
    write(KEYS.listings, seedListings.slice());
    return seedListings.slice();
  }
  const seedIds = seedListings.map((item) => item.id);
  const extras = saved.filter((item) => seedIds.indexOf(item.id) === -1);
  const merged = seedListings.concat(extras);
  write(KEYS.listings, merged);
  return merged;
}

function profile() {
  return read(KEYS.profile, { id: "me", name: "访客", phone: "" });
}

function saveProfile(data) {
  write(KEYS.profile, data);
}

function listings() {
  return ensureListings();
}

function listingById(id) {
  return listings().filter((item) => item.id === id)[0] || null;
}

function addListing(listing) {
  const list = listings();
  listing.id = listing.id || uid("own");
  listing.source = "owner";
  listing.ownerId = "me";
  listing.createdAt = Date.now();
  list.unshift(listing);
  write(KEYS.listings, list);
  return listing;
}

function removeListing(id) {
  write(KEYS.listings, listings().filter((item) => item.id !== id));
}

function myListings() {
  return listings().filter((item) => item.ownerId === "me");
}

function interests() {
  return read(KEYS.interests, []);
}

function addInterest(interest) {
  const list = interests();
  interest.id = uid("int");
  interest.createdAt = Date.now();
  list.unshift(interest);
  write(KEYS.interests, list);
  return interest;
}

function removeInterest(id) {
  write(KEYS.interests, interests().filter((item) => item.id !== id));
}

module.exports = {
  ensureListings,
  profile,
  saveProfile,
  listings,
  listingById,
  addListing,
  removeListing,
  myListings,
  interests,
  addInterest,
  removeInterest
};
