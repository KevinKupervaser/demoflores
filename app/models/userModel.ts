import { Document, model, Schema, models, Model } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
}

interface Method {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Method>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);

    next();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const UserModel = models.User || model("User", userSchema);

export default UserModel as Model<UserDocument, {}, Method>;
