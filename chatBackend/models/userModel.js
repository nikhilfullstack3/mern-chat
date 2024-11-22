const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // You may want to add a unique constraint for email
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified
  if (!this.isModified("password")) {
    next();
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Call next to continue saving the document
});

const User = mongoose.model("User", userSchema);

module.exports = User;
