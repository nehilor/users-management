import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { UserStripeAccountsServiceInterface } from '../../src/interfaces/services';
import { UserStripeAccountModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  UserStripeAccountSchema,
  UserStripeAccountDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('UserStripeAccount Unit Test', () => {
  let accountInfo: UserStripeAccountModelInterface;
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userStripeAccountAccount', () => {
    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserStripeAccountSchema.remove({ accountId: 'test' });
      userId = dbResult._id;
    });

    it('Should create an userStripeAccount Object', done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
      )
        .CreateRecord({
          userId: userId,
          accountId: 'test',
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

  describe('Modify userStripeAccount', () => {
    before(async () => {
      let dbResult: UserStripeAccountDocumentInterface = await UserStripeAccountSchema.findOne(
        {
          accountId: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.active = false;
    });

    it('Should modify an userStripeAccountlAccount Object', done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
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

  describe('Get userStripeAccount', () => {
    it('Should get all userStripeAccount', done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
      )
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserStripeAccountModelInterface[] = serviceResult.detail as UserStripeAccountModelInterface[];
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
      let dbResult: UserStripeAccountDocumentInterface = await UserStripeAccountSchema.findOne(
        {
          accountId: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userStripeAccount by it's id", done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
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

    it("Should get an userStripeAccount by it's userId", done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
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

    it('Should search userStripeAccount object', done => {
      ApiContainer.get<UserStripeAccountsServiceInterface>(
        ApiTypes.userStripeAccountsService
      )
        .Search({ accountId: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserStripeAccountModelInterface[] = serviceResult.detail as UserStripeAccountModelInterface[];
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
