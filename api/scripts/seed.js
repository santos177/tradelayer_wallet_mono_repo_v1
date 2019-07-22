const { Property } = require("../models/index.js");

 (async() => {
  await Property.create({
    name: "litecoin",
    prop_id: 0
  });
  process.exit()
})()
