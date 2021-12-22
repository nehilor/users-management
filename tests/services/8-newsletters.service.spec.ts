import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { NewslettersServiceInterface } from '../../src/interfaces/services';
import { NewsletterModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import { NewsletterSchema, NewsletterDocumentInterface } from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Newsletter Unit Test', () => {
  let newsletterInfo: NewsletterModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create newsletter', () => {
    before(async () => {
      await NewsletterSchema.remove({ email: 'test@test.test' });
    });

    it('Should create an newsletter Object', done => {
      ApiContainer.get<NewslettersServiceInterface>(ApiTypes.newslettersService)
        .CreateRecord({
          email: 'test@test.test',
          createdAt: new Date()
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

  describe('Modify newsletter', () => {
    before(async () => {
      let dbResult: NewsletterDocumentInterface = await NewsletterSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      newsletterInfo = dbResult;
      newsletterInfo.createdAt = new Date();
    });

    it('Should modify an newsletter Object', done => {
      ApiContainer.get<NewslettersServiceInterface>(ApiTypes.newslettersService)
        .ModifyRecord(newsletterInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let newsletterId = serviceResult.detail;
            expect(newsletterId).is.not.null;
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

  describe('Get newsletter', () => {
    it('Should get all newsletter', done => {
      ApiContainer.get<NewslettersServiceInterface>(ApiTypes.newslettersService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let newslettersArray: NewsletterModelInterface[] = serviceResult.detail as NewsletterModelInterface[];
            expect(newslettersArray.length).greaterThan(0);
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch(reason => {
          return done(reason);
        });
    });

    let newsletterId = '';
    before(async () => {
      let dbResult: NewsletterDocumentInterface = await NewsletterSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      newsletterId = dbResult._id;
    });

    it("Should get an newsletter by it's id", done => {
      ApiContainer.get<NewslettersServiceInterface>(ApiTypes.newslettersService)
        .GetById(newsletterId)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let newsletterId = serviceResult.detail._id;
            expect(newsletterId).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search newsletter object', done => {
      ApiContainer.get<NewslettersServiceInterface>(ApiTypes.newslettersService)
        .Search({ email: 'test@test.test' })
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let newslettersArray: NewsletterModelInterface[] = serviceResult.detail as NewsletterModelInterface[];
            expect(newslettersArray.length).greaterThan(0);
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
