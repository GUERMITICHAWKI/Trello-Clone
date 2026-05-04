const userModel = require("../Models/userModel");
const { createRandomHexColor } = require("./helperMethods");

// No bcrypt here — controller already hashes before calling this
const register = async (user, callback) => {
  try {
    const newUser = userModel({ ...user, color: createRandomHexColor() });
    await newUser.save();
    return callback(false, { message: "User created successfuly!" });
  } catch (err) {
    return callback({ errMessage: "Email already in use!", details: err });
  }
};

// No password param — controller handles bcrypt.compareSync after this returns
const login = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return callback({ errMessage: "Your email/password is wrong!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUser = async (id, callback) => {
  try {
    let user = await userModel.findById(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUserWithMail = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return callback({
        errMessage: "There is no registered user with this e-mail.",
      });
    return callback(false, { ...user.toJSON() });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserWithMail,
};