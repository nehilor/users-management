import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';

import app from '../../src/app';
import { UserSchema, UserDocumentInterface } from '../../src/models';
import { UserModelInterface } from '../../src/interfaces/models';

const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Auth Controller Test', () => {
  let userInfo: UserModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('authenticate user', () => {
    before(async () => {
      userInfo = await UserSchema.findOne({ email: 'test@test.test' });
      if (!userInfo) {
        return false;
      }
    });

    it('Should verify the user credential', done => {
      chai
        .request(app)
        .post('/auth/verifycredentials')
        .set('authorization', authToken)
        .send({ email: userInfo.email, password: 'aGVsbG8gd29ybGQ' })
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

  describe('Modify password', () => {
    it('Should modify an user password', done => {
      chai
        .request(app)
        .put('/auth/changepassword')
        .set('authorization', authToken)
        .send({ _id: userInfo._id, currentPassword: 'aGVsbG8gd29ybGQ', newPassword: '1234', passwordVerification: '1234' })
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

  describe('Create Recovery password token', () => {
    it('Should create a recovery password token', done => {
      chai
        .request(app)
        .post('/auth/createrecoverypasswordtoken')
        .set('authorization', authToken)
        .send({ email: 'test@test.test' })
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
  describe('Verify recovery password token', () => {
    let registrationToken = '';
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      }).select(['registrationToken']);
      if (!dbResult) {
        return false;
      }
      registrationToken = dbResult.registrationToken;
    });

    it("Should verify registrationToken", done => {
      chai
        .request(app)
        .post('/auth/verifyregistrationtoken')
        .set('authorization', authToken)
        .send({ token: registrationToken })
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
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
