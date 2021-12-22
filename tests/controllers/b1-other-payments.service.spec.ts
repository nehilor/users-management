import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { OtherPaymentsServiceInterface } from '../../src/interfaces/services';
import { OtherPaymentModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  UserSchema,
  UserDocumentInterface,
  EventSchema,
  EventDocumentInterface,
  PaymentSchema,
  PaymentDocumentInterface,
  OtherPaymentSchema,
  OtherPaymentDocumentInterface
} from '../../src/models';
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Other Payment Unit Test', () => {
  let dataInfo: OtherPaymentModelInterface;
  let eventId = '',
    userId = '',
    paymentId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create OtherPayment', () => {
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
      //get paymentId
      const paymentResult: PaymentDocumentInterface = await PaymentSchema.findOne({
        paymentId: 'test'
      });
      if (!paymentResult) {
        return false;
      }
      paymentId = paymentResult._id;
      await OtherPaymentSchema.remove({ comment: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/otherpayments')
        .set('authorization', authToken)
        .send({
          eventId: eventId,
          hostId: userId,
          detail: 'test',
          eventDate: new Date(),
          total: '0.00',
          cardNumber: 'test',
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

    it('Should create an OtherPayment Object', done => {
      chai
        .request(app)
        .post('/otherpayments')
        .set('authorization', authToken)
        .send({
          paymentId: paymentId,
          eventId: eventId,
          hostId: userId,
          detail: 'test',
          eventDate: new Date(),
          total: '0.00',
          cardNumber: 'test',
          date: new Date()
        })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            done();
          } else {
            return done(res.text);
          }
        })
        .catch((reason: any) => {
          done(reason);
        });
    });
  });

  describe('Modify OtherPayment', () => {
    before(async () => {
      let dbResult: OtherPaymentDocumentInterface = await OtherPaymentSchema.findOne(
        {
          cardNumber: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
      dataInfo.total = '0.01';
    });

    it('Should modify an otherPayment Object', done => {
      chai
        .request(app)
        .put('/otherpayments')
        .set('authorization', authToken)
        .send(dataInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let couponId = (JSON.parse(res.text) as any).detail._id;
            expect(couponId).is.not.null;
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

  describe('Get OtherPayment', () => {
    it('Should get all otherPayments', done => {
      chai
        .request(app)
        .get('/otherpayments')
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
        .catch(reason => {
          return done(reason);
        });
    });

    let accountId = '';
    before(async () => {
      let dbResult: OtherPaymentDocumentInterface = await OtherPaymentSchema.findOne(
        {
          cardNumber: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an OtherPayment by it's id", done => {
      chai
        .request(app)
        .get(`/otherpayments/${accountId}`)
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
        .catch(reason => {
          return done(reason);
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

    it("Should get an OtherPayment by it's eventId", done => {
      chai
        .request(app)
        .get(`/otherpayments/byevent/${eventId}`)
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
        .catch(reason => {
          return done(reason);
        });
    });

    it("Should get an OtherPayment by it's hostId", done => {
      chai
        .request(app)
        .get(`/otherpayments/byhost/${userId}`)
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
        .catch(reason => {
          return done(reason);
        });
    });

    it("Should get an OtherPayment by it's paymentId", done => {
      chai
        .request(app)
        .get(`/otherpayments/bypayment/${paymentId}`)
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
        .catch(reason => {
          return done(reason);
        });
    });

    it('Should search OtherPayment object', done => {
      chai
        .request(app)
        .post(`/otherpayments/search`)
        .set('authorization', authToken)
        .send({ cardNumber: 'test' })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            if ((JSON.parse(res.text) as any).detail.length > 0) {
              done();
            }
          } else {
            return done(res.text);
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
