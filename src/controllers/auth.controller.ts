import { Request, Response } from 'express';
import * as express from 'express';
import { controller, interfaces, httpPost, httpPut } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import * as Validator from 'params-verifier';

import { AuthService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ConstantValues } from '../constantValues';
import { ApiTypes } from '../apiTypes';
import { CommonFunctions } from '../common/common-functions';

@controller(ConstantValues.auth)
export class AuthController implements interfaces.Controller {
  private dataSrv: AuthService;

  public constructor(
    @inject(ApiTypes.authService)
    dataSrv: AuthService
  ) {
    this.dataSrv = dataSrv;
  }

  @httpPost('/verifycredentials')
  public async VerifyCredentials(req: Request, res: Response): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true
      });
      paramValidator
        .field('email', 'string', {
          required: true,
          validatorErrMsg: "email it's required",
          typeErrMsg: 'wrong value type on field email'
        })
        .field('password', 'string', {
          required: true,
          validatorErrMsg: "password it's required",
          typeErrMsg: 'wrong value type on field password'
        });

      let serviceResult: ServiceResultInterface = await this.dataSrv.VerifyCredentials(
        req.body.email,
        req.body.password
      );
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
      res.status(500).send({
        code: 'error',
        detail: ex.detail || ex.message || ex
      });
    }
  }

  @httpPut('/changepassword')
  public async ModifyPassword(req: Request, res: Response): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true
      });
      paramValidator
        .field('_id', 'string', {
          required: true,
          validatorErrMsg: "_id it's required",
          typeErrMsg: 'wrong value type on field _id'
        })
        .field('currentPassword', 'string', {
          required: true,
          validatorErrMsg: "currentPassword it's required",
          typeErrMsg: 'wrong value type on field currentPassword'
        })
        .field('newPassword', 'string', {
          required: true,
          validatorErrMsg: "newPassword it's required",
          typeErrMsg: 'wrong value type on field newPassword'
        })
        .field('passwordVerification', 'string', {
          required: true,
          validatorErrMsg: "passwordVerification it's required",
          typeErrMsg: 'wrong value type on field passwordVerification'
        });

      let serviceResult: ServiceResultInterface = await this.dataSrv.ModifyPassword(
        req.body._id,
        req.body.currentPassword,
        req.body.newPassword,
        req.body.passwordVerification
      );
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
      res.status(500).send({
        code: 'error',
        detail: ex.detail || ex.message || ex
      });
    }
  }

  @httpPost('/createrecoverypasswordtoken')
  public async CreateRecoveryPasswordToken(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true
      });
      paramValidator.field('email', 'string', {
        required: true,
        validatorErrMsg: "email it's required",
        typeErrMsg: 'wrong value type on field email'
      });

      let serviceResult: ServiceResultInterface = await this.dataSrv.CreateRecoveryPasswordToken(
        req.body.email
      );
      let statusNumber = 200;
      if (serviceResult.code === 'error') {
        statusNumber = 500;
      }
      res.status(statusNumber).send(serviceResult);
    } catch (ex) {
      res.status(500).json(ex);
    }
  }

  @httpPost('/verifyregistrationtoken')
  public async VerifyRegistrationToken(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true
      });
      paramValidator.field('token', 'string', {
        required: true,
        validatorErrMsg: "token it's required",
        typeErrMsg: 'wrong value type on field token'
      });

      let serviceResult: ServiceResultInterface = await this.dataSrv.VerifyRegistrationToken(
        req.body.token
      );
      let statusNumber = 200;
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
}
