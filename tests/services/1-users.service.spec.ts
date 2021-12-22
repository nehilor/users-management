import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { UsersServiceInterface } from '../../src/interfaces/services';
import { UserModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import { UserSchema, UserDocumentInterface } from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('User Unit Test', () => {
  let userInfo: UserModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create user', () => {
    before(async () => {
      await UserSchema.remove({ email: 'test@test.test' });
    });

    it('Should create an user Object', done => {
      ApiContainer.get<UsersServiceInterface>(ApiTypes.usersService)
        .CreateRecord({
          firstName: 'test',
          lastName: 'user',
          email: 'test@test.test',
          genre: 'test',
          birthDate: new Date(),
          description: 'test',
          status: 'test',
          active: true,
          password: '94aaafc08da063f546096510e1b0c020',
          rol: 1,
          news: 1,
          image: 'test',
          settings: {
            currency: 'test',
            language: 'test',
            preferences: 'test',
            languages: ['test'],
            registrationUrl: 'test',
            registrationTimestamp: 'test',
            registrationIp: 'test'
          },
          creationDate: new Date()
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

  describe('Modify user', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      userInfo = dbResult;
      userInfo.firstName = 'first name modified';
      userInfo.lastName = 'last name modified';
    });

    it('Should modify an user Object', done => {
      ApiContainer.get<UsersServiceInterface>(ApiTypes.usersService)
        .ModifyRecord(userInfo)
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

  describe('Get user', () => {
    it('Should get all user', done => {
      ApiContainer.get<UsersServiceInterface>(ApiTypes.usersService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserModelInterface[] = serviceResult.detail as UserModelInterface[];
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

    it("Should get an user by it's id", done => {
      ApiContainer.get<UsersServiceInterface>(ApiTypes.usersService)
        .GetById(userId)
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

    it('Should search user object', done => {
      ApiContainer.get<UsersServiceInterface>(ApiTypes.usersService)
        .Search({ email: 'test@test.test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: UserModelInterface[] = serviceResult.detail as UserModelInterface[];
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
