import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { PremiumHostsServiceInterface } from '../../src/interfaces/services';
import { PremiumHostModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  PremiumHostSchema,
  PremiumHostDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('PremiumHostSchema Unit Test', () => {
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create premiumHost', () => {
    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      //await PremiumHostSchema.remove({ accountId: 'test' });
      userId = dbResult._id;
    });

    it('Should create an premiumHost Object', done => {
      ApiContainer.get<PremiumHostsServiceInterface>(ApiTypes.premiumHostsService)
        .CreateRecord({
          userId: userId,
          joined: new Date()
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

  describe('Get premiumHost', () => {
    let accountId = '';
    before(async () => {
      let dbResult: PremiumHostDocumentInterface = await PremiumHostSchema.findOne();
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an premiumHost by it's id", done => {
      ApiContainer.get<PremiumHostsServiceInterface>(ApiTypes.premiumHostsService)
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

    it("Should get an premiumHost by it's userId", done => {
      ApiContainer.get<PremiumHostsServiceInterface>(ApiTypes.premiumHostsService)
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

    it('Should search premiumHost object', done => {
      ApiContainer.get<PremiumHostsServiceInterface>(ApiTypes.premiumHostsService)
        .Search({})
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: PremiumHostModelInterface[] = serviceResult.detail as PremiumHostModelInterface[];
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
