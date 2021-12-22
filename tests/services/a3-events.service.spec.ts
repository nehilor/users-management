import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { EventsServiceInterface } from '../../src/interfaces/services';
import { EventModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Event Unit Test', () => {
  let eventInfo: EventModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create event', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await EventSchema.remove({ title: 'test updated' });
      userId = dbResult._id;
    });

    it('Should create an event Object', done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
        .CreateRecord({
          userId: userId,
          experience: 'test',
          cuisine: 'test',
          minGuests: 1,
          maxGuests: 2,
          title: 'test',
          description: 'test',
          menu: 'test',
          drinks: 'test',
          diets: 'test',
          currentCity: 'test',
          address: 'test',
          cityName: 'test',
          venueType: 'test',
          lng: 'test',
          lat: 'test',
          currency: 'test',
          price: 1,
          free: true,
          kidsPrice: 1,
          freeKids: true,
          soldout: true,
          hideGuests: true,
          lastMinute: false,
          openHour: '0:00:00',
          closeHour: '0:00:00',
          images: [{ location: 'test', key: 'test' }],
          lastModifiedDate: new Date(),
          status: 'test'
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

  describe('Modify event', () => {
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test'
      });
      if (!dbResult) {
        return false;
      }
      eventInfo = dbResult;
      eventInfo.title = 'test updated';
    });

    it('Should modify an event Object', done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
        .ModifyRecord(eventInfo)
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

  describe('Get event', () => {
    it('Should get all event', done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventModelInterface[] = serviceResult.detail as EventModelInterface[];
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
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test updated'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an event by it's id", done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
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

    it("Should get an event by it's userId", done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
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

    it('Should search event object', done => {
      ApiContainer.get<EventsServiceInterface>(ApiTypes.eventsService)
        .Search({ title: 'test updated' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventModelInterface[] = serviceResult.detail as EventModelInterface[];
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
