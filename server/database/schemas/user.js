const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, sparse: true, index: true },
  githubId: { type: String, sparse: true, index: true },

  displayName: String,
  username: String,
  firstName: String,
  lastName: String,
  fullName: String,
  emails: Array,
  photos: Array,

  provider: String,
  status: {
    type: String,
    enum: ["logged_in", "logged_out"],
    default: "logged_out",
  },

  currentSession: {
    accessToken: String,
    refreshToken: String,
    loggedInAt: Date,
    lastActive: Date,
    expiresAt: Date,
  },

  loginHistory: [
    {
      loginTime: Date,
      logoutTime: Date,
      provider: String,
      status: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema, "users");
