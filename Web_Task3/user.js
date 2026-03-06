const mongoose = require('mongoose');

const UserModel = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const newUser = new UserModel({
      username: this.username,
      password: this.password
    });
    await newUser.save();
    return { message: 'User registered successfully' };
  }

  async login() {
    const foundUser = await UserModel.findOne({
      username: this.username,
      password: this.password
    });

    if (!foundUser) {
      throw new Error('Invalid username or password');
    }

    return { message: 'Login successful', username: foundUser.username };
  }
}

module.exports = { User, UserModel };