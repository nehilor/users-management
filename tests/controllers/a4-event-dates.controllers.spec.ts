import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { EventDateModelInterface } from '../../src/interfaces/models';
import {
  EventSchema,
  EventDocumentInterface,
  EventDateSchema,
  EventDateDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('EventDate Controller Unit Test', () => {
  let dataInfo: EventDateModelInterface;
  let eventId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create EventDate', () => {
    before(async () => {
      let dbResult: EventDocumentInterface = await EventSchema.findOne({
        menu: 'test'
      });
      if (!dbResult) {
        return false;
      }
      await EventDateSchema.remove({ eventStatus: 'test' });
      eventId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/eventdates')
        .set('authorization', authToken)
        .send({
          eventDate: new Date(),
          eventStatus: 'test'
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

    it('Should create an EventDate Object', done => {
      chai
        .request(app)
        .post('/eventdates')
        .set('authorization', authToken)
        .send({
          eventId: eventId,
          eventDate: new Date(),
          eventStatus: 'test'
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

  describe('Modify EventDate', () => {
    before(async () => {
      let dbResult: EventDateDocumentInterface = await EventDateSchema.findOne({
        eventStatus: 'test'
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an EventDate Object', done => {
      chai
        .request(app)
        .put('/eventdates')
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

  describe('Get EventDate', () => {
    it('Should get all EventDate', done => {
      chai
        .request(app)
        .get('/eventdates')
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
      let dbResult: EventDateDocumentInterface = await EventDateSchema.findOne({
        bankSwift: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an EventDate by it's id", done => {
      chai
        .request(app)
        .get(`/eventdates/${accountId}`)
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

    it("Should get an EventDate by it's eventId", done => {
      chai
        .request(app)
        .get(`/eventdates/byevent/${eventId}`)
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

    it('Should search EventDate object', done => {
      chai
        .request(app)
        .post('/eventdates/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            eventStatus: 'test'
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
