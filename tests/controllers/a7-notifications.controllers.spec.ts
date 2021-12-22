import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { NotificationModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  NotificationSchema,
  NotificationDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Notifications Controller Unit Test', () => {
  let dataInfo: NotificationModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create Notifications', () => {
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

      await NotificationSchema.remove({ reservationToken: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/notifications')
        .set('authorization', authToken)
        .send({
          host: userId,
          guest: userId
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

    it('Should create an Notifications Object', done => {
      chai
        .request(app)
        .post('/notifications')
        .set('authorization', authToken)
        .send({
          eventId: eventId,
          host: userId,
          guest: userId
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

  describe('Modify Notifications', () => {
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

    it('Should modify an Notifications Object', done => {
      chai
        .request(app)
        .put('/notifications')
        .set('authorization', authToken)
        .send(dataInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let eventId = (JSON.parse(res.text) as any).detail._id;
            expect(eventId).is.not.null;
            done();
          } else {
            console.log(res.text);
            done(res.text);
          }
        })
        .catch((reason: any) => {
          console.log(reason);
          throw done(reason);
        });
    });
  });

  describe('Get Notifications', () => {
    it('Should get all Notifications', done => {
      chai
        .request(app)
        .get('/notifications')
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
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          guestEmail: 'test@test.test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an Notifications by it's id", done => {
      chai
        .request(app)
        .get(`/notifications/${accountId}`)
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

    it("Should get an Notifications by it's eventId", done => {
      chai
        .request(app)
        .get(`/notifications/byevent/${eventId}`)
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

    it("Should get an Notifications by it's host", done => {
      chai
        .request(app)
        .get(`/notifications/byhost/${userId}`)
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

    it("Should get an Notifications by it's guest", done => {
      chai
        .request(app)
        .get(`/notifications/byguest/${userId}`)
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

    it('Should search Notifications object', done => {
      chai
        .request(app)
        .post(`/notifications/search`)
        .set('authorization', authToken)
        .send({ reviewed: userId })
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
  });
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
