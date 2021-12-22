import { injectable, inject } from 'inversify';
import * as bcrypt from 'bcryptjs';

import { CommonFunctions } from '../common/common-functions';
import { UserDocumentInterface, UserSchema } from '../models';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { UserModelInterface } from '../interfaces/models';
import { UsersServiceInterface } from '../interfaces/services';

import { ApiTypes } from '../apiTypes';

@injectable()
export class UsersService implements UsersServiceInterface {
  //#region Public Properties

  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public ChangeStatus = this.changeStatus;
  public GetAll = this.getAll;
  public GetById = this.getById;
  public Search = this.search;

  //#endregion

  protected dbDocument: UserDocumentInterface;
  private selectableFields = [
    '_id',
    'firstName',
    'lastName',
    'email',
    'genre',
    'birthDate',
    'countryCode',
    'phoneNumber',
    'description',
    'status',
    'countryCode',
    'phoneNumber',
    'active',
    'address',
    'school',
    'work',
    'timeZone',
    'rol',
    'news',
    'organize',
    'image',
    'settings',
    'createDate',
    'lastModificationDate'
  ];

  public constructor() {}

  //#region Private Functions

  private async createRecord(
    workingObj: UserModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let result: any;
      const dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: workingObj.email.trim()
      });
      if (dbResult) {
        return {
          code: 'recordAlreadyCreated',
          detail: `the user with email "${workingObj.email}" is already created`
        };
      } else {
        result = await this.insert(workingObj);
      }
      if (!result) {
        return {
          code: 'noActionPerformed',
          detail: 'no action performed'
        };
      }
      return {
        code: 'success',
        detail: result
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async modifyRecord(
    workingObj: UserModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findById(
        workingObj._id
      );
      let result: any;
      if (!dbResult) {
        return {
          code: 'dataNotFound',
          detail: `the user with email "${workingObj.email}" was not found`
        };
      } else {
        result = await this.update(dbResult, workingObj);
      }
      if (!result) {
        return {
          code: 'noActionPerformed',
          detail: 'no action performed'
        };
      }
      return {
        code: 'success',
        detail: result
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async changeStatus(
    email: string,
    status: string
  ): Promise<ServiceResultInterface> {
    try {
      let userData: UserDocumentInterface = await UserSchema.findOne({ email });
      if (!userData) {
        return {
          code: 'dataNotFound',
          detail: 'email not found'
        };
      }
      userData.status = status;
      await userData.save();
      return {
        code: 'success'
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getAll(): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface[] = await UserSchema.find().select(
        this.selectableFields
      );
      if (!dbResult) {
        return {
          code: 'notDataFound',
          detail: 'Data not found'
        };
      }
      return {
        code: 'success',
        detail: dbResult
      };
    } catch (ex) {
      return {
        code: 'error',
        detail: ex.message
      };
    }
  }

  private async getById(id: string): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findById(id).select(
        this.selectableFields
      );
      if (!dbResult) {
        return {
          code: 'notDataFound',
          detail: 'Data not found'
        };
      }
      return {
        code: 'success',
        detail: dbResult
      };
    } catch (ex) {
      return {
        code: 'error',
        detail: ex.message
      };
    }
  }

  private async search(
    params: any,
    populateAll: boolean
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface[] = [];
      if (populateAll) {
        dbResult = await UserSchema.find(params).select(this.selectableFields);
      } else {
        dbResult = await UserSchema.find(params).select(this.selectableFields);
      }
      if (!dbResult) {
        return {
          code: 'notDataFound',
          detail: 'Data not found'
        };
      }
      return {
        code: 'success',
        detail: dbResult
      };
    } catch (ex) {
      return {
        code: 'error',
        detail: ex.message
      };
    }
  }

  private async insert(workingObj: UserModelInterface): Promise<any> {
    try {
      //Creates the registrationToken based on a salt and encripting the users
      //emai in base64
      const registrationTokenSalt = bcrypt.genSaltSync().replace('/', '');
      let registrationToken = CommonFunctions.generateUUID(false);
      this.dbDocument = new UserSchema({
        ...workingObj,
        registrationToken
      });
      const result = await this.dbDocument.save({
        validateBeforeSave: true
      });
      return {
        actionPerformed: 'dataCreation',
        result: {
          _id: result._id,
          registrationToken
        }
      };
    } catch (ex) {
      throw new Error(ex);
    }
  }

  private async update(
    workingObject: UserDocumentInterface,
    newObject: UserModelInterface
  ): Promise<any> {
    try {
      workingObject.firstName = newObject.firstName;
      workingObject.lastName = newObject.lastName;
      workingObject.email = newObject.email;
      workingObject.genre = newObject.genre;
      workingObject.birthDate = newObject.birthDate;
      workingObject.countryCode = newObject.countryCode;
      workingObject.phoneNumber = newObject.phoneNumber;
      workingObject.description = newObject.description;
      workingObject.status = newObject.status;
      workingObject.active = newObject.active;
      workingObject.address = newObject.address;
      workingObject.school = newObject.school;
      workingObject.work = newObject.work;
      workingObject.timeZone = newObject.timeZone;
      workingObject.rol = newObject.rol;
      workingObject.news = newObject.news;
      workingObject.organize = newObject.organize;
      workingObject.image = newObject.image;
      workingObject.lastModificationDate = newObject.lastModificationDate;
      workingObject.markModified('UserSchema');
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id
      };
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
