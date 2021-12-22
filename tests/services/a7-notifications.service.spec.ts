import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { NotificationsServiceInterface } from '../../src/interfaces/services';
import { NotificationModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  NotificationSchema,
  NotificationDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Notification Unit Test', () => {
  let dataInfo: NotificationModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create Notification', () => {
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
      await NotificationSchema.remove({ eventId });
    });

    it('Should create an Notification Object', done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .CreateRecord({
          eventId: eventId,
          guest: userId,
          host: userId
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

  describe('Modify Notification', () => {
    before(async () => {
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an notification Object', done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
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

  describe('Get Notification', () => {
    it('Should get all Notification', done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: NotificationModelInterface[] = serviceResult.detail as NotificationModelInterface[];
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
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an Notification by it's id", done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
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

    it("Should get an Notification by it's eventId", done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .GetByEvent(eventId)
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

    it("Should get an Notification by it's guest", done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .GetByGuest(userId)
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

    it("Should get an Notification by it's host", done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .GetByHost(userId)
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

    it('Should search Notification object', done => {
      ApiContainer.get<NotificationsServiceInterface>(ApiTypes.notificationsService)
        .Search({ host: userId }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: NotificationModelInterface[] = serviceResult.detail as NotificationModelInterface[];
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
