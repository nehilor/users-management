import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';

import app from '../../src/app';
import { NewsletterSchema, NewsletterDocumentInterface } from '../../src/models';
import { NewsletterModelInterface } from '../../src/interfaces/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Newsletter Controller Unit Test', () => {
  let newsletterInfo: NewsletterModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create newsletter', () => {
    before(async () => {
      await NewsletterSchema.remove({ email: 'test@test.test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/newsletters')
        .set('authorization', authToken)
        .send({
          createdAt: new Date()
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

    it('Should create an newsletter Object', done => {
      chai
        .request(app)
        .post('/newsletters')
        .set('authorization', authToken)
        .send({
          email: 'test@test.test',
          createdAt: new Date()
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

  describe('Modify newsletter', () => {
    before(async () => {
      let dbResult: NewsletterDocumentInterface = await NewsletterSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      newsletterInfo = dbResult;
    });

    it('Should modify an newsletter Object', done => {
      chai
        .request(app)
        .put('/newsletters')
        .set('authorization', authToken)
        .send(newsletterInfo)
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

  describe('Get newsletter', () => {
    it('Should get all newsletter', done => {
      chai
        .request(app)
        .get('/newsletters')
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

    let newsletterId = '';
    before(async () => {
      let dbResult: NewsletterDocumentInterface = await NewsletterSchema.findOne({
        code: 'test'
      });
      if (!dbResult) {
        return false;
      }
      newsletterId = dbResult._id;
    });

    it("Should get an newsletter by it's id", done => {
      chai
        .request(app)
        .get(`/newsletters/${newsletterId}`)
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

    it('Should search newsletter object', done => {
      chai
        .request(app)
        .post('/newsletters/search')
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
