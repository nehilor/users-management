import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { UserBankAccountModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  UserBankAccountSchema,
  UserBankAccountDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('UserBankAccount Controller Unit Test', () => {
  let accountInfo: UserBankAccountModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userBankAccount', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserBankAccountSchema.remove({ bankSwift: 'test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/userbankaccounts')
        .set('authorization', authToken)
        .send({
          currency: 'crc',
          userName: 'test',
          bankName: 'test',
          bankNumber: 'test',
          bankSwift: 'test',
          bankAddress: 'test',
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

    it('Should create an userBankAccount Object', done => {
      chai
        .request(app)
        .post('/userbankaccounts')
        .set('authorization', authToken)
        .send({
          userId: userId,
          currency: 'crc',
          userName: 'test',
          bankName: 'test',
          bankNumber: 'test',
          bankSwift: 'test',
          bankAddress: 'test',
          extraInfo: 'test',
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

  describe('Modify userBankAccount', () => {
    before(async () => {
      let dbResult: UserBankAccountDocumentInterface = await UserBankAccountSchema.findOne(
        {
          bankSwift: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountInfo = dbResult;
      accountInfo.bankName = 'test updated';
    });

    it('Should modify an userBankAccount Object', done => {
      chai
        .request(app)
        .put('/userbankaccounts')
        .set('authorization', authToken)
        .send(accountInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let userId = (JSON.parse(res.text) as any).detail._id;
            expect(userId).is.not.null;
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

  describe('Get userBankAccount', () => {
    it('Should get all userBankAccount', done => {
      chai
        .request(app)
        .get('/userbankaccounts')
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
      let dbResult: UserBankAccountDocumentInterface = await UserBankAccountSchema.findOne(
        {
          bankSwift: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userBankAccount by it's id", done => {
      chai
        .request(app)
        .get(`/userbankaccounts/${accountId}`)
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

    it("Should get an userBankAccount by it's userId", done => {
      chai
        .request(app)
        .get(`/userbankaccounts/byuser/${userId}`)
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

    it('Should search userBankAccount object', done => {
      chai
        .request(app)
        .post('/userbankaccounts/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            bankSwift: 'test'
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
