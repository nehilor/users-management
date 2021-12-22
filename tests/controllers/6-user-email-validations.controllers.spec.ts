import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { UserEmailValidationModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  UserEmailValidationSchema,
  UserEmailValidationDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('UserEmailValidation Controller Unit Test', () => {
  let validationInfo: UserEmailValidationModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create userEmailValidation', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await UserEmailValidationSchema.remove({ bankSwift: 'test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/useremailvalidations')
        .set('authorization', authToken)
        .send({
          userId: userId
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

    it('Should create an userEmailValidation Object', done => {
      chai
        .request(app)
        .post('/useremailvalidations')
        .set('authorization', authToken)
        .send({
          userId: userId,
          token: 'test'
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

  describe('Get userEmailValidation', () => {
    it('Should get all userEmailValidation', done => {
      chai
        .request(app)
        .get('/useremailvalidations')
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
      let dbResult: UserEmailValidationDocumentInterface = await UserEmailValidationSchema.findOne(
        {
          bankSwift: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an userEmailValidation by it's id", done => {
      chai
        .request(app)
        .get(`/useremailvalidations/${accountId}`)
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

    it("Should get an userEmailValidation by it's userId", done => {
      chai
        .request(app)
        .get(`/useremailvalidations/byuser/${userId}`)
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

    it('Should search userEmailValidation object', done => {
      chai
        .request(app)
        .post('/useremailvalidations/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            token: 'test'
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
