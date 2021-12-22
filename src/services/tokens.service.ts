import { injectable, inject } from 'inversify';
import * as bcrypt from 'bcryptjs';

import { CommonFunctions } from '../common/common-functions';
import { TokenDocumentInterface, TokenSchema } from '../models';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { TokenModelInterface } from '../interfaces/models';
import { TokensServiceInterface } from '../interfaces/services';

import { ApiTypes } from '../apiTypes';

@injectable()
export class TokensService implements TokensServiceInterface {
  //#region Public Properties

  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetById = this.getById;
  public Search = this.search;

  //#endregion

  protected dbDocument: TokenDocumentInterface;
  private selectableFields = ['_id', 'token'];

  public constructor() {}

  //#region Private Functions

  private async createRecord(
    workingObj: TokenModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const tokenData: TokenDocumentInterface[] = await TokenSchema.find({
        token: workingObj.token
      }).select(['_id']);
      if (tokenData) {
        return {
          code: 'recordAlreadyCreated',
          detail: `the token with token value "${workingObj.token}" is already created`
        };
      }
      let result = await this.insert(workingObj);
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
      return Promise.reject({
        code: 'error',
        detail: ex.message
      });
    }
  }

  private async modifyRecord(
    workingObj: TokenModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: TokenDocumentInterface = await TokenSchema.findById(
        workingObj._id
      );
      let result: any;
      if (!dbResult) {
        return {
          code: 'dataNotFound',
          detail: `the token with id "${workingObj._id}" was not found`
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
      return Promise.reject({
        code: 'error',
        detail: ex.message
      });
    }
  }

  private async getAll(): Promise<ServiceResultInterface> {
    try {
      let dbResult: TokenDocumentInterface[] = await TokenSchema.find().select(
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
      let dbResult: TokenDocumentInterface = await TokenSchema.findById(id).select(
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

  private async search(params: any): Promise<ServiceResultInterface> {
    try {
      let dbResult: TokenDocumentInterface[] = await TokenSchema.find(
        params
      ).select(this.selectableFields);
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

  private async insert(workingObj: TokenModelInterface): Promise<any> {
    try {
      this.dbDocument = new TokenSchema({
        ...workingObj
      });
      const result = await this.dbDocument.save({
        validateBeforeSave: true
      });
      return {
        actionPerformed: 'dataCreation',
        result: {
          _id: result._id
        }
      };
    } catch (ex) {
      throw new Error(ex);
    }
  }

  private async update(
    workingObject: TokenDocumentInterface,
    newObject: TokenModelInterface
  ): Promise<any> {
    try {
      workingObject._id = newObject._id;
      workingObject.token = newObject.token;
      workingObject.markModified('TokenSchema');
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
