import { handleCreateUser } from "../services/user.service";
import User from "../models/user.model";

const getHomePage = (req, res) => {
  return res.render("home");
};

const getCreateUserPage = (req, res) => {
  res.render("create-user.ejs");
};

const postDeleteUser = async (req, res) => {
  const userId = req.body.userId;
  let user = await User.findById(userId).exec();
};

const postUpdateOne = async (req, res) => {
  const email = req.body.email;
  const passoword = req.body.password;
  const fullName = req.body.fullName;

  console.log(">>> check data: ", email, passoword, fullName);
  try {
    await User.updateOne(
      { email: email },
      { fullName: fullName, password: passoword }
    );

    res.redirect("/");
  } catch (error) {
    console.log("Lỗi khi  update ");
  }
};

const postCreateUser = async (req, res) => {
  let fullName = req.body.fullName;
  let email = req.body.email;
  let password = req.body.password;

  console.log(">>> check data: ", req.body);
  // const { fullName, email, password } = req.body;

  // handleCreateUser(fullName, email, password);
  // console.log(">>> check data: ", fullName, email, password);

  await User.create({
    fullName: fullName,
    email: email,
    password: password,
  });

  res.send("Created user succed");
};

export { getHomePage, getCreateUserPage, postCreateUser };
