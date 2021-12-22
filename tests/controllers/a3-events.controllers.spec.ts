import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { EventModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Event Controller Unit Test', () => {
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
      await EventSchema.remove({ title: 'test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/events')
        .set('authorization', authToken)
        .send({
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
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'error') {
            done();
          } else {
            return done(res.text);
          }
        })
        .catch((reason: any) => {
          done(reason);
        });
    });

    it('Should create an event Object', done => {
      console.log(userId);
      chai
        .request(app)
        .post('/events')
        .set('authorization', authToken)
        .send({
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
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'error') {
            done(res.text);
          } else {
            return done();
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
        experience: 'test'
      });
      if (!dbResult) {
        return false;
      }
      eventInfo = dbResult;
      eventInfo.cuisine = 'test updated';
    });

    it('Should modify an event Object', done => {
      chai
        .request(app)
        .put('/events')
        .set('authorization', authToken)
        .send(eventInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let userId = (JSON.parse(res.text) as any).detail._id;
            expect(userId).is.not.null;
            done();
          } else {
            done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });

  describe('Get event', () => {
    it('Should get all event', done => {
      chai
        .request(app)
        .get('/events')
        .set('authorization', authToken)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let id = (JSON.parse(res.text) as any).detail._id;
            expect(id).is.not.null;
            done();
          } else {
            done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    let eventId = '';
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        title: 'test'
      });
      if (!dbResult) {
        return false;
      }
      eventId = dbResult._id;
    });

    it("Should get an event by it's id", done => {
      chai
        .request(app)
        .get(`/events/${eventId}`)
        .set('authorization', authToken)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let id = (JSON.parse(res.text) as any).detail._id;
            expect(id).is.not.null;
            done();
          } else {
            done(res.text);
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
      chai
        .request(app)
        .get(`/events/byuser/${userId}`)
        .set('authorization', authToken)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let id = (JSON.parse(res.text) as any).detail._id;
            expect(id).is.not.null;
            done();
          } else {
            done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search event object', done => {
      chai
        .request(app)
        .post('/events/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            experience: 'test'
          },
          populateAll: false
        })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            if ((JSON.parse(res.text) as any).detail.length > 0) {
              done();
            }
          } else {
            return done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
