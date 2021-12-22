import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';

import app from '../../src/app';
import { TokenSchema, TokenDocumentInterface } from '../../src/models';
import { TokenModelInterface } from '../../src/interfaces/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Token Controller Unit Test', () => {
  let tokenInfo: TokenModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create token', () => {
    before(async () => {
      await TokenSchema.remove({ token: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/tokens')
        .set('authorization', authToken)
        .send({})
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

    it('Should create an token Object', done => {
      chai
        .request(app)
        .post('/tokens')
        .set('authorization', authToken)
        .send({
          token: 'test'
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

  describe('Modify token', () => {
    before(async () => {
      let dbResult: TokenDocumentInterface = await TokenSchema.findOne({
        token: 'test'
      });
      if (!dbResult) {
        return false;
      }
      tokenInfo = dbResult;
    });

    it('Should modify an token Object', done => {
      chai
        .request(app)
        .put('/tokens')
        .set('authorization', authToken)
        .send(tokenInfo)
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

  describe('Get token', () => {
    it('Should get all token', done => {
      chai
        .request(app)
        .get('/tokens')
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

    let tokenId = '';
    before(async () => {
      let dbResult: TokenDocumentInterface = await TokenSchema.findOne({
        token: 'test'
      });
      if (!dbResult) {
        return false;
      }
      tokenId = dbResult._id;
    });

    it("Should get an token by it's id", done => {
      chai
        .request(app)
        .get(`/tokens/${tokenId}`)
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

    it('Should search token object', done => {
      chai
        .request(app)
        .post('/tokens/search')
        .set('authorization', authToken)
        .send({ workingObject: { token: 'test' }, populateAll: true })
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
