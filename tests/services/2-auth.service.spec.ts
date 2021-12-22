import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { AuthServiceInterface } from '../../src/interfaces/services';
import { UserModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import { UserSchema, UserDocumentInterface } from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Auth Unit Test', () => {
  let userInfo: UserModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('authenticate user', () => {
    before(async () => {
      userInfo = await UserSchema.findOne({ email: 'test@test.test' });
      if (!userInfo) {
        return false;
      }
    });

    it('Should verify the user credential', done => {
      ApiContainer.get<AuthServiceInterface>(ApiTypes.authService)
        .VerifyCredentials(userInfo.email, 'aGVsbG8gd29ybGQ')
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

  describe('Modify password', () => {
    it('Should modify an user password', done => {
      ApiContainer.get<AuthServiceInterface>(ApiTypes.authService)
        .ModifyPassword(userInfo._id, 'aGVsbG8gd29ybGQ', '1234', '1234')
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });

  describe('Create Recovery password token', () => {
    it('Should create a recovery password token', done => {
      ApiContainer.get<AuthServiceInterface>(ApiTypes.authService)
        .CreateRecoveryPasswordToken(userInfo.email)
        .then((serviceResult: ServiceResultInterface) => {
          console.log(serviceResult)
          if (serviceResult.code === 'success') {
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
  describe('Verify recovery password token', () => {
    let registrationToken = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      }).select(['registrationToken']);
      if (!dbResult) {
        return false;
      }
      console.log(dbResult)
      registrationToken = dbResult.registrationToken;
    });

    it("Should verify registrationToken", done => {
      ApiContainer.get<AuthServiceInterface>(ApiTypes.authService)
        .VerifyRegistrationToken(registrationToken)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let userId = serviceResult.detail._id;
            expect(userId).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
