import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { EventGuestsServiceInterface } from '../../src/interfaces/services';
import { EventGuestModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  EventGuestSchema,
  EventGuestDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('EventGuest Unit Test', () => {
  let dataInfo: EventGuestModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create EventGuest', () => {
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
      await EventGuestSchema.remove({ reservationToken: 'test' });
    });

    it('Should create an EventGuest Object', done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
        .CreateRecord({
          eventId: eventId,
          eventDate: new Date(),
          userId: userId,
          guestEmail: 'test@test.test',
          reservationToken: 'test',
          reservationStatus: 'test'
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

  describe('Modify EventGuest', () => {
    before(async () => {
      let dbResult: EventGuestDocumentInterface = await EventGuestSchema.findOne({
        guestEmail: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
      dataInfo.eventDate = new Date();
    });

    it('Should modify an eventGuest Object', done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
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

  describe('Get EventGuest', () => {
    it('Should get all EventGuest', done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventGuestModelInterface[] = serviceResult.detail as EventGuestModelInterface[];
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
      let dbResult: EventGuestDocumentInterface = await EventGuestSchema.findOne({
        guestEmail: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an EventGuest by it's id", done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
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

    it("Should get an EventGuest by it's eventId", done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
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

    it("Should get an EventGuest by it's userId", done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
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

    it('Should search EventGuest object', done => {
      ApiContainer.get<EventGuestsServiceInterface>(ApiTypes.eventGuestsService)
        .Search({ guestEmail: 'test@test.test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventGuestModelInterface[] = serviceResult.detail as EventGuestModelInterface[];
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
