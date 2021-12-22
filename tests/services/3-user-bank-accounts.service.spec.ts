import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { UserBankAccountsServiceInterface } from '../../src/interfaces/services';
import { UserBankAccountModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  UserBankAccountSchema,
  UserBankAccountDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('User BankAccount Unit Test', () => {
  let accountInfo: UserBankAccountModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userBankAccount', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserBankAccountSchema.remove({ bankSwift: 'test' });
      userId = dbResult._id;
    });

    it('Should create an userBankAccount Object', done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
      )
        .CreateRecord({
          userId: userId,
          currency: 'crc',
          userName: 'test',
          bankName: 'test',
          bankNumber: 'test',
          bankSwift: 'test',
          bankAddress: 'test',
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

  describe('Modify userBankAccount', () => {
    before(async () => {
      let dbResult: UserBankAccountDocumentInterface = await UserBankAccountSchema.findOne(
        {
          bankName: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.bankName = 'test updated';
    });

    it('Should modify an user Object', done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
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

  describe('Get userBankAccount', () => {
    it('Should get all userBankAccount', done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
      )
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserBankAccountModelInterface[] = serviceResult.detail as UserBankAccountModelInterface[];
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
      let dbResult: UserBankAccountDocumentInterface = await UserBankAccountSchema.findOne(
        {
          bankSwift: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userBankAccount by it's id", done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
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

    it("Should get an userBankAccount by it's userId", done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
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

    it('Should search userBankAccount object', done => {
      ApiContainer.get<UserBankAccountsServiceInterface>(
        ApiTypes.userBankAccountsService
      )
        .Search({ bankSwift: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserBankAccountModelInterface[] = serviceResult.detail as UserBankAccountModelInterface[];
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
