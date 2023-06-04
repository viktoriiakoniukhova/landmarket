const mongoose = require("mongoose");

const db1 = mongoose.createConnection(process.env.MONGODB_URL_TEST);

db1.model("User", require("../schemas/User"));
db1.model("Announcment", require("../schemas/Announcment"));

module.exports = db1;
