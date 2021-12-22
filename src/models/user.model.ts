import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import {
  UserModelInterface,
  UserSettingModelInterface,
  ImageModelInterface
} from '../interfaces/models';

export interface UserDocumentInterface extends UserModelInterface, Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationToken?: string;
  salt?: string;
  password?: string;
  verificationToken?: string;
  fbOAuth?: string;
  googleOauth?: string;
  genre: string;
  birthDate: Date;
  countryCode?: string;
  phoneNumber?: string;
  description: string;
  status: string;
  active: Boolean;
  address?: string;
  school?: string;
  work?: string;
  timeZone?: string;
  rol: number;
  news: number;
  organize: number;
  //image?: ImageModelInterface;
  image?: string;
  settings: UserSettingModelInterface;
  creationDate: Date;
  lastModificationDate?: Date;
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  registrationToken: {
    type: String,
    required: false
  },
  salt: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  verificationToken: {
    type: String,
    required: false
  },
  fbOAuth: {
    type: String,
    required: false
  },
  googleOAuth: {
    type: String,
    required: false
  },
  genre: {
    type: String,
    required: false
  },
  birthDate: {
    type: Date,
    required: false
  },
  countryCode: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  school: {
    type: String,
    required: false
  },
  work: {
    type: String
  },
  timeZone: {
    type: String
  },
  rol: {
    type: Number,
    required: true
  },
  news: {
    type: Number,
    required: true
  },
  organize: {
    type: Number
  },
  image: {
    //type: {},
    type: String,
    required: false
  },
  settings: {
    type: {},
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  lastModificationDate: {
    required: false
  }
});
userSchema.set('autoIndex', false);

export const UserSchema: Model<UserDocumentInterface> = mongoose.model<UserDocumentInterface>(
  'User',
  userSchema
);

export default UserSchema;
