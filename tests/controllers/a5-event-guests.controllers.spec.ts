import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { EventGuestModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  EventGuestSchema,
  EventGuestDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('EventGuest Controller Unit Test', () => {
  let dataInfo: EventGuestModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create EventGuest', () => {
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        menu: 'test'
      });
      if (!dbResult) {
        return false;
      }
      eventId = dbResult._id;
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

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/eventguests')
        .set('authorization', authToken)
        .send({
          eventDate: new Date(),
          userId: userId,
          guestEmail: 'test@test.test',
          reservationToken: 'test',
          reservationStatus: 'test'
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

    it('Should create an EventGuest Object', done => {
      chai
        .request(app)
        .post('/eventguests')
        .set('authorization', authToken)
        .send({
          eventId: eventId,
          eventDate: new Date(),
          userId: userId,
          guestEmail: 'test@test.test',
          reservationToken: 'test',
          reservationStatus: 'test'
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

  describe('Modify EventGuest', () => {
    before(async () => {
      let dbResult: EventGuestDocumentInterface = await EventGuestSchema.findOne({
        guestEmail: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an EventGuest Object', done => {
      chai
        .request(app)
        .put('/eventguests')
        .set('authorization', authToken)
        .send(dataInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let eventId = (JSON.parse(res.text) as any).detail._id;
            expect(eventId).is.not.null;
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

  describe('Get EventGuest', () => {
    it('Should get all EventGuest', done => {
      chai
        .request(app)
        .get('/eventguests')
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
      chai
        .request(app)
        .get(`/eventguests/${accountId}`)
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
        menu: 'test'
      });
      if (!dbResult) {
        return false;
      }
      eventId = dbResult._id;
    });

    it("Should get an EventGuest by it's eventId", done => {
      chai
        .request(app)
        .get(`/eventguests/byevent/${eventId}`)
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

    it('Should search EventGuest object', done => {
      chai
        .request(app)
        .get(`/eventguests/byguest/${userId}`)
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

    it('Should search EventGuest object', done => {
      chai
        .request(app)
        .post('/eventguests/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            guestEmail: 'test@test.test'
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
