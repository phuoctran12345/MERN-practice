const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    city: String,
    address: String,
    phone: String,
    email: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", userSchema);

const Customers = new Customer({
  name: "m3p",
  email: "m3p@gmail.com",
  city: "danang",
});
Customer.save();
module.exports = Customer;
