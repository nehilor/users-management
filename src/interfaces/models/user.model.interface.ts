import { ImageModelInterface } from './image.model.interface';
import { UserSettingModelInterface } from './user-setting.model.interface';

export interface UserModelInterface {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  registrationToken?: string;
  salt?: string;
  password?: string;
  fbOAuth?: string;
  googleOauth?: string;
  verificationToken?: string;
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
  organize?: number;
  //image?: ImageModelInterface;
  image?: string;
  settings: UserSettingModelInterface;
  creationDate: Date;
  lastModificationDate?: Date;
}
