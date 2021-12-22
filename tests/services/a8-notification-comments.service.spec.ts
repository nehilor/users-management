import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { NotificationCommentsServiceInterface } from '../../src/interfaces/services';
import { NotificationCommentModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  NotificationSchema,
  NotificationDocumentInterface,
  NotificationCommentSchema,
  NotificationCommentDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Notification Comment Unit Test', () => {
  let dataInfo: NotificationCommentModelInterface;
  let notificationId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create Notification', () => {
    before(async () => {
      //get userId
      const userResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!userResult) {
        return false;
      }
      userId = userResult._id;
      //get notificationId
      const evenResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!evenResult) {
        return false;
      }
      notificationId = evenResult._id;
      await NotificationCommentSchema.remove({ comment: 'test' });
    });

    it('Should create an Notification Object', done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .CreateRecord({
          notificationId: notificationId,
          comment: 'test',
          date: new Date(),
          userId: userId,
          read: false
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

  describe('Modify Notification Comment', () => {
    before(async () => {
      let dbResult: NotificationCommentDocumentInterface = await NotificationCommentSchema.findOne(
        {
          comment: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
      dataInfo.read = true;
    });

    it('Should modify an eventGuest Object', done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .ModifyRecord(dataInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let notificationId = serviceResult.detail;
            expect(notificationId).is.not.null;
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

  describe('Get Notification', () => {
    it('Should get all Notification Comment', done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: NotificationCommentModelInterface[] = serviceResult.detail as NotificationCommentModelInterface[];
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

    let dataId = '';
    before(async () => {
      let dbResult: NotificationCommentDocumentInterface = await NotificationCommentSchema.findOne(
        {
          comment: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      dataId = dbResult._id;
    });

    it("Should get an Notification Comment by it's id", done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .GetById(dataId)
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

    it("Should get an Notification Comment by it's notificationId", done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .GetByNotificationId(notificationId)
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

    it("Should get an Notification Comment by it's userId", done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
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

    it("Should get an Notification Comment by it's id", done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .GetById(dataId)
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

    let notificationId = '';
    before(async () => {
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!dbResult) {
        return false;
      }
      notificationId = dbResult._id;
    });

    it("Should get an Notification Comment by it's notificationId", done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .GetByNotificationId(notificationId)
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

    it('Should search Notification Comment object', done => {
      ApiContainer.get<NotificationCommentsServiceInterface>(
        ApiTypes.notificationCommentsService
      )
        .Search({ comment: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: NotificationCommentModelInterface[] = serviceResult.detail as NotificationCommentModelInterface[];
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
