import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'You have to provide a username.'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'You have to provide a full name."'],
    },
    password: {
      type: String,
      required: [true, 'You have to provide a password."'],
      minLength: 6,
      select: false,
    },
    email: {
      type: String,
      required: [true, 'You have to provide an email."'],
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
