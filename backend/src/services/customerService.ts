const Customer = require("../models/customer.model");

const createCustomer = async(customerData)=> {
    try {
        await Customer.create({
            name: customerData.name,
            address: customerData.address,
            phone: customerData.phone,
            email: customerData.email,
            description:  customerData.description,
            image: customerData.imageUrl
        })
    } catch (error) {
        console.log(error);
        return null;
    }
  },

module.exports = {
  createCustomer
};
