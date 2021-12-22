import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { BlogsServiceInterface } from '../../src/interfaces/services';
import { BlogModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  BlogSchema,
  BlogDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Blog Unit Test', () => {
  let blogInfo: BlogModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create blog', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await BlogSchema.remove({ title: 'test updated' });
      userId = dbResult._id;
    });

    it('Should create an blog Object', done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
        .CreateRecord({
          userId: userId,
          title: 'test',
          content: 'test',
          images: [{ location: 'test', key: 'test' }],
          date: new Date(),
          status: 'test',
          approved: true
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

  describe('Modify blog', () => {
    before(async () => {
      let dbResult: BlogDocumentInterface = await BlogSchema.findOne({
        title: 'test'
      });
      if (!dbResult) {
        return false;
      }
      blogInfo = dbResult;
      blogInfo.title = 'test updated';
    });

    it('Should modify an blog Object', done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
        .ModifyRecord(blogInfo)
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

  describe('Get blog', () => {
    it('Should get all blog', done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: BlogModelInterface[] = serviceResult.detail as BlogModelInterface[];
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
      let dbResult: BlogDocumentInterface = await BlogSchema.findOne({
        title: 'test updated'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an blog by it's id", done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
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

    it("Should get an blog by it's userId", done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
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

    it('Should search blog object', done => {
      ApiContainer.get<BlogsServiceInterface>(ApiTypes.blogService)
        .Search({ title: 'test updated' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: BlogModelInterface[] = serviceResult.detail as BlogModelInterface[];
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
