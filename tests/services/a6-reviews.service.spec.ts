import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { ReviewsServiceInterface } from '../../src/interfaces/services';
import { ReviewModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  ReviewSchema,
  ReviewDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Review Unit Test', () => {
  let dataInfo: ReviewModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create Review', () => {
    before(async () => {
      //get eventId
      const evenResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test updated'
      });
      if (!evenResult) {
        return false;
      }
      eventId = evenResult._id;
      //get userId
      const userResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!userResult) {
        return false;
      }
      userId = userResult._id;
      await ReviewSchema.remove({ comment: 'test' });
    });

    it('Should create an Review Object', done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .CreateRecord({
          eventId: eventId,
          reviewTo: userId,
          reviewFrom: userId,
          stars: 1,
          comment: 'test',
          date: new Date()
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

  describe('Modify Review', () => {
    before(async () => {
      let dbResult: ReviewDocumentInterface = await ReviewSchema.findOne({
        comment: 'test'
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
      dataInfo.stars = 2;
    });

    it('Should modify an eventGuest Object', done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .ModifyRecord(dataInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let eventId = serviceResult.detail;
            expect(eventId).is.not.null;
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

  describe('Get Review', () => {
    it('Should get all Review', done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: ReviewModelInterface[] = serviceResult.detail as ReviewModelInterface[];
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
      let dbResult: ReviewDocumentInterface = await ReviewSchema.findOne({
        comment: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an Review by it's id", done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
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

    let eventId = '';
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test updated'
      });
      if (!dbResult) {
        return false;
      }
      eventId = dbResult._id;
    });

    it("Should get an Review by it's eventId", done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .GetByEventId(eventId)
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

    it("Should get an Review by it's reviewFrom", done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .GetByReviewerId(userId)
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

    it("Should get an Review by it's reviewTo", done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .GetByReviewedId(userId)
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

    it('Should search Review object', done => {
      ApiContainer.get<ReviewsServiceInterface>(ApiTypes.reviewsService)
        .Search({ comment: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: ReviewModelInterface[] = serviceResult.detail as ReviewModelInterface[];
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
