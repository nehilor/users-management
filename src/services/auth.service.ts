import { injectable, inject } from 'inversify';
import { has } from 'lodash';
import * as md5 from 'md5';

import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { UserDocumentInterface, UserSchema } from '../models';
import { UserModelInterface } from '../interfaces/models';
import { AuthServiceInterface } from '../interfaces/services';
import { ChatsService } from './chats.service';
import { CommonFunctions } from '../common/common-functions';
import { ApiTypes } from '../apiTypes';

@injectable()
export class AuthService implements AuthServiceInterface {
  //#region Public Properties

  public VerifyCredentials = this.verifyCredentials;
  public ModifyPassword = this.modifyPassword;
  public CreateRecoveryPasswordToken = this.createRecoveryPasswordToken;
  public VerifyRegistrationToken = this.verifyRegistrationToken;

  //#endregion

  private dbDocument: UserDocumentInterface;
  private chatsSrv: ChatsService;

  public constructor(@inject(ApiTypes.chatsService) chatsSrv: ChatsService) {
    this.chatsSrv = chatsSrv;
  }

  //#region Private Functions

  private async verifyCredentials(
    email: string,
    password: string
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult: UserModelInterface = await UserSchema.findOne({
        email: email.trim()
      }).select([
        '_id',
        'firstName',
        'lastName',
        'email',
        'password',
        'image',
        'settings',
        'status',
        'active'
      ]);
      if (!dbResult) {
        return {
          code: 'credentialsError',
          detail: 'user data not found'
        };
      }

      if (dbResult.password !== md5(password)) {
        return {
          code: 'credentialsError',
          detail: 'user data not found'
        };
      }
      if (dbResult.status !== 'confirmed') {
        return {
          code: 'emailNotConfirmed',
          detail: 'user account is not confirmed'
        };
      }
      if (!dbResult.active) {
        return {
          code: 'userinactive',
          detail: 'the user is not active'
        };
      }
      const unreadMessagesResult = await this.chatsSrv.GetUnreadMessages(
        dbResult._id
      );
      let unreadMessagesQtt = 0;
      if (unreadMessagesResult.code === 'success') {
        unreadMessagesQtt = (unreadMessagesResult.detail as any[]).length;
      }
      return {
        code: 'success',
        detail: {
          _id: dbResult._id,
          firstName: dbResult.firstName,
          lastName: dbResult.lastName,
          email: dbResult.email,
          unreadMessagesQtt,
          settings: dbResult.settings
        }
      };
    } catch (ex) {
      throw new Error(ex);
    }
  }

  private async modifyPassword(
    _id: string,
    currentPassword: string = null,
    newPassword: string,
    passwordVerification: string
  ): Promise<ServiceResultInterface> {
    try {
      if (newPassword !== passwordVerification) {
        return {
          code: 'passwordError',
          detail: 'password verification do not match'
        };
      }

      let dbResult: UserDocumentInterface = await UserSchema.findById(_id);
      if (!dbResult) {
        return {
          code: 'credentialsError',
          detail: 'user data not found'
        };
      }

      if (currentPassword) {
        if (dbResult.password && dbResult.password !== md5(currentPassword)) {
          return {
            code: 'credentialsError',
            detail: 'user data not found'
          };
        }
      }
      dbResult.password = md5(newPassword);

      dbResult.markModified('ClientUser');

      let updateResult = await dbResult.save();
      if (updateResult._id) {
        return Promise.resolve({
          code: 'success',
          detail: 'password modified'
        });
      } else {
        return Promise.reject({
          code: 'notDataModified',
          detail: 'Data not updated'
        });
      }
    } catch (ex) {
      throw new Error(ex);
    }
  }

  private async createRecoveryPasswordToken(
    email: string
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: email.trim()
      });
      if (!dbResult) {
        return {
          code: 'credentialsError',
          detail: 'user data not found'
        };
      }

      dbResult.registrationToken = CommonFunctions.generateUUID(false);
      dbResult.markModified('User');
      let updateResult = await dbResult.save();
      if (updateResult._id) {
        return Promise.resolve({
          code: 'success',
          detail: dbResult.registrationToken
        });
      } else {
        return Promise.reject({
          code: 'notDataModified',
          detail: 'recovery password token not generated'
        });
      }
    } catch (ex) {
      throw new Error(ex);
    }
  }

  private async verifyRegistrationToken(
    registrationToken: string
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface;
      dbResult = await UserSchema.findOne({
        registrationToken: registrationToken
      }).select(['_id', 'email']);
      if (!dbResult) {
        return {
          code: 'tokenNotValid',
          detail: 'the token is not valid'
        };
      }
      return {
        code: 'success',
        detail: dbResult
      };
    } catch (ex) {
      throw new Error(ex);
    }
  }

  //#endregion
}
