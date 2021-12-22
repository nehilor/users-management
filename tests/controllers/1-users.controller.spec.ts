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

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('User Controller Unit Test', () => {
  let userInfo: UserModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create user', () => {
    before(async () => {
      await UserSchema.remove({ email: 'test@test.test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/users')
        .set('authorization', authToken)
        .send({
          lastName: 'user',
          email: 'test@test.test',
          genre: 'test',
          birthDate: new Date(),
          countryCode: 'test',
          description: 'test',
          status: 'test',
          active: true,
          password: '94aaafc08da063f546096510e1b0c020',
          rol: 1,
          news: 1,
          image: 'test',
          settings: {
            currency: 'test',
            language: 'test',
            preferences: 'test',
            languages: 'test',
            registrationUrl: 'test',
            registrationTimestamp: 'test',
            registrationIp: 'test'
          },
          creationDate: new Date()
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

    it('Should create an user Object', done => {
      chai
        .request(app)
        .post('/users')
        .set('authorization', authToken)
        .send({
          firstName: 'test',
          lastName: 'user',
          email: 'test@test.test',
          genre: 'test',
          birthDate: new Date(),
          countryCode: 'test',
          description: 'test',
          status: 'test',
          active: true,
          rol: 1,
          news: 1,
          image: {
            key: 'test',
            location: 'test'
          },
          creationDate: new Date()
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

  describe('Modify user', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      userInfo = dbResult;
      userInfo.firstName = 'first name modified';
      userInfo.lastName = 'last name modified';
    });

    it('Should modify an user Object', done => {
      chai
        .request(app)
        .put('/users')
        .set('authorization', authToken)
        .send(userInfo)
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

  describe('Get user', () => {
    it('Should get all user', done => {
      chai
        .request(app)
        .get('/users')
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

    it("Should get an user by it's id", done => {
      chai
        .request(app)
        .get(`/users/${userId}`)
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

    it('Should search user object', done => {
      chai
        .request(app)
        .post('/users/search')
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
