import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { ReviewModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  ReviewSchema,
  ReviewDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Reviews Controller Unit Test', () => {
  let dataInfo: ReviewModelInterface;
  let eventId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create Reviews', () => {
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

      await ReviewSchema.remove({ reservationToken: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/reviews')
        .set('authorization', authToken)
        .send({
          reviewTo: userId,
          reviewFrom: userId,
          stars: 1,
          comment: 'test',
          date: new Date()
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

    it('Should create an Reviews Object', done => {
      chai
        .request(app)
        .post('/reviews')
        .set('authorization', authToken)
        .send({
          eventId: eventId,
          reviewTo: userId,
          reviewFrom: userId,
          stars: 1,
          comment: 'test',
          date: new Date()
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

  describe('Modify Reviews', () => {
    before(async () => {
      let dbResult: ReviewDocumentInterface = await ReviewSchema.findOne({
        reviewTo: userId
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an Reviews Object', done => {
      chai
        .request(app)
        .put('/reviews')
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

  describe('Get Reviews', () => {
    it('Should get all Reviews', done => {
      chai
        .request(app)
        .get('/reviews')
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
      let dbResult: ReviewDocumentInterface = await ReviewSchema.findOne({
        guestEmail: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an Reviews by it's id", done => {
      chai
        .request(app)
        .get(`/reviews/${accountId}`)
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

    it("Should get an Reviews by it's eventId", done => {
      chai
        .request(app)
        .get(`/reviews/byevent/${eventId}`)
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

    it("Should get an Reviews by it's reviewer", done => {
      chai
        .request(app)
        .get(`/reviews/byreviewer/${userId}`)
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

    it("Should get an Reviews by it's reviewed", done => {
      chai
        .request(app)
        .get(`/reviews/byreviewed/${userId}`)
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

    it('Should search Reviews object', done => {
      chai
        .request(app)
        .post(`/reviews/search`)
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
