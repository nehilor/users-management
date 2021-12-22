import { Request, Response } from 'express';
import * as express from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPost,
  httpPut
} from 'inversify-express-utils';
import { inject } from 'inversify';
import * as Validator from 'params-verifier';
import { ObjectID } from 'mongodb';

import { UsersService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ConstantValues } from '../constantValues';
import { ApiTypes } from '../apiTypes';
import { UserModelInterface, ImageModelInterface } from '../interfaces/models';
import { errors } from '@elastic/elasticsearch';

@controller(ConstantValues.users)
export class UsersController implements interfaces.Controller {
  private userSrv: UsersService;

  public constructor(@inject(ApiTypes.usersService) userSrv: UsersService) {
    this.userSrv = userSrv;
  }

  @httpPost('/')
  public async CreateRecord(req: Request, res: Response): Promise<void> {
    try {
      this.validateWorkingObject(req.body, false);

      let serviceResult: ServiceResultInterface = await this.userSrv.CreateRecord({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        genre: req.body.genre,
        fbOAuth: req.body.fbOAuth,
        googleOauth: req.body.googleOauth,
        birthDate: req.body.birthDate,
        countryCode: req.body.countryCode,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        status: req.body.status,
        active: req.body.active,
        address: req.body.address,
        school: req.body.school,
        work: req.body.work,
        timeZone: req.body.timeZone,
        rol: req.body.rol,
        news: req.body.news,
        organize: req.body.organize,
        image: req.body.image,
        settings: req.body.settings,
        creationDate: new Date()
      } as UserModelInterface);
      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved'
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      let errorCode = 500,
        processedError: Error = ex;
      const errorType: string = JSON.stringify(processedError.stack)
        .split(':')[1]
        .toLowerCase()
        .trim();
      if (errorType === 'validationerror') {
        errorCode = 400;
      }
      res.status(errorCode).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  @httpPut('/')
  public async Modify(req: Request, res: Response): Promise<void> {
    try {
      this.validateWorkingObject(req.body, false);

      let serviceResult: ServiceResultInterface = await this.userSrv.ModifyRecord({
        _id: req.body._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        genre: req.body.genre,
        birthDate: req.body.birthDate,
        countryCode: req.body.countryCode,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        status: req.body.status,
        active: req.body.active,
        address: req.body.address,
        school: req.body.school,
        work: req.body.work,
        timeZone: req.body.timeZone,
        rol: req.body.rol,
        news: req.body.news,
        organize: req.body.organize,
        image: req.body.image,
        creationDate: new Date()
      } as UserModelInterface);

      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved'
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      let errorCode = 500,
        processedError: Error = ex;
      const errorType: string = JSON.stringify(processedError.stack)
        .split(':')[1]
        .toLowerCase()
        .trim();
      if (errorType === 'validationerror') {
        errorCode = 400;
      }
      res.status(errorCode).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  @httpPost('/changestatus')
  public async ChangeStatus(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      //validate body properties
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true
      });
      paramValidator
        .field('email', 'string', {
          required: true,
          validatorErrMsg: "email it's required",
          typeErrMsg: 'wrong value type on field email'
        })
        .field('status', 'string', {
          required: true,
          validatorErrMsg: "status it's required",
          typeErrMsg: 'wrong value type on field status'
        });

      let serviceResult: ServiceResultInterface = await this.userSrv.ChangeStatus(
        req.body.email,
        req.body.status
      );
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      res.status(500).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  @httpGet('/')
  public async GetAll(req: express.Request, res: express.Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.userSrv.GetAll();
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      res.status(500).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  @httpGet('/:id')
  public async GetById(req: express.Request, res: express.Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.userSrv.GetById(
        req.params.id
      );
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      res.status(500).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  @httpPost('/search')
  public async Search(req: express.Request, res: express.Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.userSrv.Search(
        req.body.workingObject,
        req.body.populateAll
      );
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      res.status(500).send({
        code: 'error',
        detail: ex.message
      });
    }
  }

  private validateWorkingObject(workingObj: any, forUpdate: boolean) {
    try {
      const paramValidator = new Validator(workingObj, 'object', {
        stringNoEmpty: true
      });
      if (forUpdate) {
        paramValidator.field('_id', 'string', {
          required: true,
          validatorErrMsg: "_id it's required",
          typeErrMsg: 'wrong value type on field _id'
        });
        if (!ObjectID.isValid(workingObj._id)) {
          throw new Error('field _id is not a valid  ObjecId');
        }
      }
      paramValidator
        .field('firstName', 'string', {
          required: true,
          validatorErrMsg: "firstName it's required",
          typeErrMsg: 'wrong value type on field firstName'
        })
        .field('lastName', 'string', {
          required: true,
          validatorErrMsg: "lastName it's required",
          typeErrMsg: 'wrong value type on field lastName'
        })
        .field('email', 'string', {
          required: true,
          validatorErrMsg: "email it's required",
          typeErrMsg: 'wrong value type on field email'
        })
        .field('genre', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field genre'
        })
        .field('birthDate', 'date', {
          required: false,
          typeErrMsg: 'wrong value type on field birthDate'
        })
        .field('countryCode', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field countryCode'
        })
        .field('phoneNumber', 'string', {
          validatorErrMsg: "phoneNumber it's required",
          typeErrMsg: 'wrong value type on field phoneNumber'
        })
        .field('description', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field description'
        })
        .field('status', 'string', {
          required: true,
          validatorErrMsg: "status it's required",
          typeErrMsg: 'wrong value type on field status'
        })
        .field('active', 'boolean', {
          required: true,
          validatorErrMsg: "active it's required",
          typeErrMsg: 'wrong value type on field active'
        })
        .field('address', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field address'
        })
        .field('school', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field school'
        })
        .field('image', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field image'
        })
        .field('work', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field work'
        })
        .field('timeZone', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field timeZone'
        })
        .field('rol', 'number', {
          required: true,
          validatorErrMsg: "timeZone it's required",
          typeErrMsg: 'wrong value type on field timeZone'
        })
        .field('news', 'number', {
          required: false,
          validatorErrMsg: "news it's required",
          typeErrMsg: 'wrong value type on field news'
        })
        .field('organize', 'number', {
          required: false,
          validatorErrMsg: "organize it's required",
          typeErrMsg: 'wrong value type on field organize'
        });
      //validate user settins
      this.validateUserSettings(workingObj.settings);
    } catch (ex) {
      throw ex;
    }
  }

  private validateUserSettings(workingObj: any) {
    try {
      const paramValidator = new Validator(workingObj, 'object', {
        stringNoEmpty: false
      });
      if (workingObj.languages !== undefined && workingObj.languages !== null) {
        if (!Array.isArray(workingObj.languages)) {
          throw new Error('languages is not an array');
        }
      }
      paramValidator
        .field('currency', 'string', {
          required: true,
          validatorErrMsg: "currency it's required",
          typeErrMsg: 'wrong value type on field currency'
        })
        .field('language', 'string', {
          required: true,
          validatorErrMsg: "language it's required",
          typeErrMsg: 'wrong value type on field language'
        })
        .field('preferences', 'string', {
          required: true,
          validatorErrMsg: "preferences it's required",
          typeErrMsg: 'wrong value type on field preferences'
        })
        /*.field('languages', 'string', {
          required: false,
          typeErrMsg: 'wrong value type on field languages'
        })*/
        .field('registrationUrl', 'string', {
          required: false,
          validatorErrMsg: "registrationUrl it's required"
        })
        .field('registrationTimestamp', 'string', {
          required: false,
          validatorErrMsg: "registrationTimestamp it's required"
        })
        .field('registrationIp', 'string', {
          required: false,
          validatorErrMsg: "registrationIp it's required"
        });
    } catch (ex) {
      throw ex;
    }
  }

  private validateImage(image: ImageModelInterface) {
    try {
      const paramValidator = new Validator(image, 'object', {
        stringNoEmpty: true
      });
      paramValidator
        .field('key', 'string', {
          required: true,
          validatorErrMsg: "image[key] it's required",
          typeErrMsg: 'wrong value type on field image[key]'
        })
        .field('location', 'string', {
          required: true,
          validatorErrMsg: "image[location] it's required",
          typeErrMsg: 'wrong value type on field image[location]'
        });
    } catch (ex) {
      throw ex;
    }
  }
}
