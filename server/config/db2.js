const mongoose = require("mongoose");

const db2 = mongoose.createConnection(process.env.MONGODB_URL_CADASTR);

db2.model("Land", require("../schemas/Land"));

module.exports = db2;
