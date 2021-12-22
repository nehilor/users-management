import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { UserPaypalAccountsServiceInterface } from '../../src/interfaces/services';
import { UserPaypalAccountModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  UserPaypalAccountSchema,
  UserPaypalAccountDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('User PaypalAccount Unit Test', () => {
  let accountInfo: UserPaypalAccountModelInterface;
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userPaypalAccountsServiceAccount', () => {
    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserPaypalAccountSchema.remove({ paypalEmail: 'test@test.test' });
      userId = dbResult._id;
    });

    it('Should create an userPaypalAccount Object', done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
      )
        .CreateRecord({
          userId: userId,
          paypalEmail: 'test@test.test',
          active: true
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

  describe('Modify userPaypalAccount', () => {
    before(async () => {
      let dbResult: UserPaypalAccountDocumentInterface = await UserPaypalAccountSchema.findOne(
        {
          paypalEmail: 'test@test.test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.active = false;
    });

    it('Should modify an userPaypalAccount Object', done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
      )
        .ModifyRecord(accountInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let userId = serviceResult.detail;
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

  describe('Get userPaypalAccount', () => {
    it('Should get all userPaypalAccount', done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
      )
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserPaypalAccountModelInterface[] = serviceResult.detail as UserPaypalAccountModelInterface[];
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

    let accountId = '';
    before(async () => {
      let dbResult: UserPaypalAccountDocumentInterface = await UserPaypalAccountSchema.findOne(
        {
          paypalEmail: 'test@test.test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userPaypalAccount by it's id", done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
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

    it("Should get an userPaypalAccount by it's userId", done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
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

    it('Should search userPaypalAccount object', done => {
      ApiContainer.get<UserPaypalAccountsServiceInterface>(
        ApiTypes.userPaypalAccountsService
      )
        .Search({ paypalEmail: 'test@test.test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserPaypalAccountModelInterface[] = serviceResult.detail as UserPaypalAccountModelInterface[];
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
