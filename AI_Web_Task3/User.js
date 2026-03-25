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
    const existing = await UserModel.findOne({ username: this.username });
    if (existing) throw new Error('Username already exists');
    await new UserModel({ username: this.username, password: this.password }).save();
    return { message: 'User registered successfully' };
  }

  async login() {
    const user = await UserModel.findOne({ username: this.username, password: this.password });
    if (!user) throw new Error('Invalid username or password');
    return { message: 'Login successful', username: user.username };
  }
}

module.exports = { User };
