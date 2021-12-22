import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { PaymentsServiceInterface } from '../../src/interfaces/services';
import { PaymentModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  DiscountCouponSchema,
  DiscountCouponDocumentInterface,
  PaymentSchema,
  PaymentDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('User Payment Unit Test', () => {
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

    it('Should create an payment Object', done => {
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
        .CreateRecord({
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

  describe('Modify payment', () => {
    before(async () => {
      let dbResult: PaymentDocumentInterface = await PaymentSchema.findOne({
        paymentId: 'test'
      });
      if (!dbResult) {
        return false;
      }
      paymentInfo = dbResult;
      paymentInfo.paymentStatus = 'test updated';
    });

    it('Should modify an payment Object', done => {
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
        .ModifyRecord(paymentInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let couponId = serviceResult.detail;
            expect(couponId).is.not.null;
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

  describe('Get payment', () => {
    it('Should get all payment', done => {
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: PaymentModelInterface[] = serviceResult.detail as PaymentModelInterface[];
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
      let dbResult: PaymentDocumentInterface = await PaymentSchema.findOne({
        paymentId: 'test'
      });
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an payment by it's id", done => {
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
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
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
        .GetByCouponId(couponId)
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

    it('Should search payment object', done => {
      ApiContainer.get<PaymentsServiceInterface>(ApiTypes.paymentsService)
        .Search({ paymentId: 'test' }, true)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: PaymentModelInterface[] = serviceResult.detail as PaymentModelInterface[];
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
