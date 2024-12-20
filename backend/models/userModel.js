import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'You have to provide a username.'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'You have to provide a full name.'],
    },
    password: {
      type: String,
      required: [true, 'You have to provide a password.'],
      minLength: 6,
      select: false,
    },
    email: {
      type: String,
      required: [true, 'You have to provide an email.'],
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
    profileImgFileId: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    coverImgFileId: {
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
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Soft delete
userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const User = mongoose.model('User', userSchema);

export default User;
