import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { PremiumHostModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  PremiumHostSchema,
  PremiumHostDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('PremiumHost Controller Unit Test', () => {
  let dataInfo: PremiumHostModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create premiumHost', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await PremiumHostSchema.remove({ paypalEmail: 'test@test.test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/premiumhosts')
        .set('authorization', authToken)
        .send({
          joined: new Date()
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

    it('Should create an premiumHost Object', done => {
      chai
        .request(app)
        .post('/premiumhosts')
        .set('authorization', authToken)
        .send({
          userId: userId,
          joined: new Date()
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

  describe('Modify premiumHost', () => {
    before(async () => {
      let dbResult: PremiumHostDocumentInterface = await PremiumHostSchema.findOne({
        userId: userId
      });
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an premiumHost Object', done => {
      chai
        .request(app)
        .put('/premiumhosts')
        .set('authorization', authToken)
        .send(dataInfo)
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

  describe('Get premiumHost', () => {
    it('Should get all premiumHost', done => {
      chai
        .request(app)
        .get('/premiumhosts')
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

    let dataId = '';
    before(async () => {
      let dbResult: PremiumHostDocumentInterface = await PremiumHostSchema.findOne({
        dataId: 'test'
      });
      if (!dbResult) {
        return false;
      }
      dataId = dbResult._id;
    });

    it("Should get an premiumHost by it's id", done => {
      chai
        .request(app)
        .get(`/premiumhosts/${dataId}`)
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

    it("Should get an premiumHost by it's userId", done => {
      chai
        .request(app)
        .get(`/premiumhosts/byuser/${userId}`)
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

    it('Should search premiumHost object', done => {
      chai
        .request(app)
        .post('/premiumhosts/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            userId: userId
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
