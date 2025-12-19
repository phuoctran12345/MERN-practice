// key-value
module.exports = {
  postCreateCustomer: async (res, req) => {
    let { name, address, phone, email, description } = req.body; // destructering

    /*res.body chỉ lấy được dạng test thôi  */
    console.log(
      `Data user response` + name,
      address,
      phone,
      email,
      description
    );

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.badRequest("No files were uploaded.");
    } else {
      const result = await uploadSingleFile(req.files.image);
      console.log("check result", result);
    }

    return res.send("create a customer");
  },

  postCreateArrayCustomer: async (res, req) => {
    console.log("check req.body", req.body);
    return res.send("create array customer");
  },
};
