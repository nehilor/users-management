import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';

import app from '../../src/app';
import {
  DiscountCouponSchema,
  DiscountCouponDocumentInterface
} from '../../src/models';
import { DiscountCouponModelInterface } from '../../src/interfaces/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Discount Coupon Controller Unit Test', () => {
  let couponInfo: DiscountCouponModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create discountCoupon', () => {
    before(async () => {
      await DiscountCouponSchema.remove({ code: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/discountcoupons')
        .set('authorization', authToken)
        .send({
          discount: 1,
          expiration: new Date(),
          used: false
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

    it('Should create an discountCoupon Object', done => {
      chai
        .request(app)
        .post('/discountcoupons')
        .set('authorization', authToken)
        .send({
          code: 'test',
          discount: 1,
          expiration: new Date(),
          used: false
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

  describe('Modify discountCoupon', () => {
    before(async () => {
      let dbResult: DiscountCouponDocumentInterface = await DiscountCouponSchema.findOne(
        {
          code: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      couponInfo = dbResult;
      couponInfo.discount = 2;
    });

    it('Should modify an discountCoupon Object', done => {
      chai
        .request(app)
        .put('/discountcoupons')
        .set('authorization', authToken)
        .send(couponInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            done();
          } else {
            return done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });

  describe('Get discountCoupon', () => {
    it('Should get all discountCoupon', done => {
      chai
        .request(app)
        .get('/discountcoupons')
        .set('authorization', authToken)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            done();
          } else {
            return done(res.text);
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

    it("Should get an discountCoupon by it's id", done => {
      chai
        .request(app)
        .get(`/discountcoupons/${couponId}`)
        .set('authorization', authToken)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            done();
          } else {
            return done(res.text);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search discountCoupon object', done => {
      chai
        .request(app)
        .post('/discountcoupons/search')
        .set('authorization', authToken)
        .send({ workingObject: { email: 'test@test.test' }, populateAll: true })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            done();
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
