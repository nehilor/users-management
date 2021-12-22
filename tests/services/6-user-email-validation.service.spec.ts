import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { UserEmailValidationsServiceInterface } from '../../src/interfaces/services';
import { UserEmailValidationModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  UserEmailValidationSchema,
  UserEmailValidationDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('UserEmailValidation Unit Test', () => {
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userEmailValidation', () => {
    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserEmailValidationSchema.remove({ accountId: 'test' });
      userId = dbResult._id;
    });

    it('Should create an userEmailValidation Object', done => {
      ApiContainer.get<UserEmailValidationsServiceInterface>(
        ApiTypes.userEmailValidationsService
      )
        .CreateRecord({
          userId: userId,
          token: 'test'
        })
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch((reason: any) => {
          done(reason);
        });
    });
  });

  describe('Get userEmailValidation', () => {
    let accountId = '';
    before(async () => {
      let dbResult: UserEmailValidationDocumentInterface = await UserEmailValidationSchema.findOne(
        {
          token: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userEmailValidation by it's id", done => {
      ApiContainer.get<UserEmailValidationsServiceInterface>(
        ApiTypes.userEmailValidationsService
      )
        .GetById(accountId)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let id = serviceResult.detail._id;
            expect(id).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      userId = dbResult._id;
    });

    it("Should get an userEmailValidation by it's userId", done => {
      ApiContainer.get<UserEmailValidationsServiceInterface>(
        ApiTypes.userEmailValidationsService
      )
        .GetByUserId(userId)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let id = serviceResult.detail._id;
            expect(id).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search userEmailValidation object', done => {
      ApiContainer.get<UserEmailValidationsServiceInterface>(
        ApiTypes.userEmailValidationsService
      )
        .Search({ token: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserEmailValidationModelInterface[] = serviceResult.detail as UserEmailValidationModelInterface[];
            expect(usersArray.length).greaterThan(0);
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch(reason => {
          return done(reason);
        });
    });
  });
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
