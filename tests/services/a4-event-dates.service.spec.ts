import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { EventDatesServiceInterface } from '../../src/interfaces/services';
import { EventDateModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  EventSchema,
  EventDocumentInterface,
  EventDateSchema,
  EventDateDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('EventDate Unit Test', () => {
  let accountInfo: EventDateModelInterface;
  let eventId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create EventDate', () => {
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test updated'
      });
      if (!dbResult) {
        return false;
      }
      await EventDateSchema.remove({ eventStatus: 'test' });
      eventId = dbResult._id;
    });

    it('Should create an EventDate Object', done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
        .CreateRecord({
          eventId: eventId,
          eventDate: new Date(),
          eventStatus: 'test'
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

  describe('Modify EventDate', () => {
    before(async () => {
      let dbResult: EventDateDocumentInterface = await EventDateSchema.findOne({
        eventStatus: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.eventDate = new Date();
    });

    it('Should modify an event Object', done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
        .ModifyRecord(accountInfo)
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

  describe('Get EventDate', () => {
    it('Should get all EventDate', done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventDateModelInterface[] = serviceResult.detail as EventDateModelInterface[];
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
      let dbResult: EventDateDocumentInterface = await EventDateSchema.findOne({
        eventStatus: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an EventDate by it's id", done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
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

    it("Should get an EventDate by it's eventId", done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
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

    it('Should search EventDate object', done => {
      ApiContainer.get<EventDatesServiceInterface>(ApiTypes.eventDatesService)
        .Search({ eventStatus: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: EventDateModelInterface[] = serviceResult.detail as EventDateModelInterface[];
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
