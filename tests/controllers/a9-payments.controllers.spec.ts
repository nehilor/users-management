import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { PaymentModelInterface } from '../../src/interfaces/models';
import {
  DiscountCouponSchema,
  DiscountCouponDocumentInterface,
  PaymentSchema,
  PaymentDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Payment Controller Unit Test', () => {
  let paymentInfo: PaymentModelInterface;
  let couponId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create payment', () => {
    before(async () => {
      let dbResult: DiscountCouponDocumentInterface = await DiscountCouponSchema.findOne(
        {
          code: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      await PaymentSchema.remove({ paymentId: 'test' });
      couponId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/payments')
        .set('authorization', authToken)
        .send({
          coupon: couponId,
          description: 'test',
          currency: 'crc',
          reservationToken: 'test',
          paymentStatus: 'test',
          total: '000',
          cardNumber: 'test',
          firstName: 'test',
          lastName: 'test',
          address: 'test',
          createdOn: new Date()
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

    it('Should create an payment Object', done => {
      chai
        .request(app)
        .post('/payments')
        .set('authorization', authToken)
        .send({
          paymentId: 'test',
          coupon: couponId,
          description: 'test',
          currency: 'crc',
          reservationToken: 'test',
          paymentStatus: 'test',
          total: '000',
          cardNumber: 'test',
          firstName: 'test',
          lastName: 'test',
          address: 'test',
          createdOn: new Date()
        })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'error') {
            console.log(res.text);
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

  describe('Modify payment', () => {
    before(async () => {
      let dbResult: PaymentDocumentInterface = await PaymentSchema.findOne({
        paymentId: 'test'
      });
      if (!dbResult) {
        return false;
      }
      paymentInfo = dbResult;
      paymentInfo.reservationToken = 'test updated';
    });

    it('Should modify an payment Object', done => {
      chai
        .request(app)
        .put('/payments')
        .set('authorization', authToken)
        .send(paymentInfo)
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

  describe('Get payment', () => {
    it('Should get all payment', done => {
      chai
        .request(app)
        .get('/payments')
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
      let dbResult: PaymentDocumentInterface = await PaymentSchema.findOne({
        bankSwift: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an payment by it's id", done => {
      chai
        .request(app)
        .get(`/payments/${accountId}`)
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

    let couponId = '';
    before(async () => {
      let dbResult: DiscountCouponDocumentInterface = await DiscountCouponSchema.findOne(
        {
          code: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      couponId = dbResult._id;
    });

    it("Should get an payment by it's couponId", done => {
      chai
        .request(app)
        .get(`/payments/bycoupon/${couponId}`)
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

    it('Should search payment object', done => {
      chai
        .request(app)
        .post('/payments/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            paymentId: 'test'
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
