import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

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
import { MongoTestingConfig } from '../mongoConfig';

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

    it('Should create an OtherPayment Object', done => {
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .CreateRecord({
          paymentId: paymentId,
          eventId: eventId,
          hostId: userId,
          detail: 'test',
          eventDate: new Date(),
          total: '0.00',
          cardNumber: 'test',
          date: new Date()
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
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .ModifyRecord(dataInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let eventId = serviceResult.detail;
            expect(eventId).is.not.null;
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

  describe('Get OtherPayment', () => {
    it('Should get all otherPayments', done => {
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: OtherPaymentModelInterface[] = serviceResult.detail as OtherPaymentModelInterface[];
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
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
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
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .GetByEventId(eventId)
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

    it("Should get an OtherPayment by it's hostId", done => {
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .GetByHostId(userId)
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

    it("Should get an OtherPayment by it's paymentId", done => {
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .GetByPaymentId(paymentId)
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

    it('Should search OtherPayment object', done => {
      ApiContainer.get<OtherPaymentsServiceInterface>(ApiTypes.otherPaymentsService)
        .Search({ cardNumber: 'test' })
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let usersArray: OtherPaymentModelInterface[] = serviceResult.detail as OtherPaymentModelInterface[];
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
