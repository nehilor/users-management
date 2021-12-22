import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { DiscountCouponsServiceInterface } from '../../src/interfaces/services';
import { DiscountCouponModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import {
  DiscountCouponSchema,
  DiscountCouponDocumentInterface
} from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('DiscountCoupon Unit Test', () => {
  let discountCouponInfo: DiscountCouponModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create discountCoupon', () => {
    before(async () => {
      await DiscountCouponSchema.remove({ code: 'test' });
    });

    it('Should create an discountCoupon Object', done => {
      ApiContainer.get<DiscountCouponsServiceInterface>(
        ApiTypes.discountCouponsService
      )
        .CreateRecord({
          code: 'test',
          discount: 1,
          expiration: new Date(),
          used: false
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
      discountCouponInfo = dbResult;
      discountCouponInfo.discount = 2;
    });

    it('Should modify an discountCoupon Object', done => {
      ApiContainer.get<DiscountCouponsServiceInterface>(
        ApiTypes.discountCouponsService
      )
        .ModifyRecord(discountCouponInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let discountCouponId = serviceResult.detail;
            expect(discountCouponId).is.not.null;
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

  describe('Get discountCoupon', () => {
    it('Should get all discountCoupon', done => {
      ApiContainer.get<DiscountCouponsServiceInterface>(
        ApiTypes.discountCouponsService
      )
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let discountCouponsArray: DiscountCouponModelInterface[] = serviceResult.detail as DiscountCouponModelInterface[];
            expect(discountCouponsArray.length).greaterThan(0);
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch(reason => {
          return done(reason);
        });
    });

    let discountCouponId = '';
    before(async () => {
      let dbResult: DiscountCouponDocumentInterface = await DiscountCouponSchema.findOne(
        {
          code: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      discountCouponId = dbResult._id;
    });

    it("Should get an discountCoupon by it's id", done => {
      ApiContainer.get<DiscountCouponsServiceInterface>(
        ApiTypes.discountCouponsService
      )
        .GetById(discountCouponId)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let discountCouponId = serviceResult.detail._id;
            expect(discountCouponId).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search discountCoupon object', done => {
      ApiContainer.get<DiscountCouponsServiceInterface>(
        ApiTypes.discountCouponsService
      )
        .Search({ code: 'test' })
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let discountCouponsArray: DiscountCouponModelInterface[] = serviceResult.detail as DiscountCouponModelInterface[];
            expect(discountCouponsArray.length).greaterThan(0);
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
