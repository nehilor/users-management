import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { UserStripeAccountModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  UserStripeAccountSchema,
  UserStripeAccountDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('UserStripeAccount Controller Unit Test', () => {
  let accountInfo: UserStripeAccountModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userStripeAccount', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserStripeAccountSchema.remove({ paypalEmail: 'test@test.test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/userstripeaccounts')
        .set('authorization', authToken)
        .send({
          accountId: 'test',
          active: true
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

    it('Should create an userStripeAccount Object', done => {
      chai
        .request(app)
        .post('/userstripeaccounts')
        .set('authorization', authToken)
        .send({
          userId: userId,
          accountId: 'test',
          active: true
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

  describe('Modify userStripeAccount', () => {
    before(async () => {
      let dbResult: UserStripeAccountDocumentInterface = await UserStripeAccountSchema.findOne(
        {
          accountId: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.active = false;
    });

    it('Should modify an userStripeAccount Object', done => {
      chai
        .request(app)
        .put('/userstripeaccounts')
        .set('authorization', authToken)
        .send(accountInfo)
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

  describe('Get userStripeAccount', () => {
    it('Should get all userStripeAccount', done => {
      chai
        .request(app)
        .get('/userstripeaccounts')
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
      let dbResult: UserStripeAccountDocumentInterface = await UserStripeAccountSchema.findOne(
        {
          accountId: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userStripeAccount by it's id", done => {
      chai
        .request(app)
        .get(`/userstripeaccounts/${accountId}`)
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

    let userId = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      userId = dbResult._id;
    });

    it("Should get an userStripeAccount by it's userId", done => {
      chai
        .request(app)
        .get(`/userstripeaccounts/byuser/${userId}`)
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

    it('Should search userStripeAccount object', done => {
      chai
        .request(app)
        .post('/userstripeaccounts/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            accountId: 'test'
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
