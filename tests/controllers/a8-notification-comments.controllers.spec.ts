import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { NotificationCommentModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  NotificationSchema,
  NotificationDocumentInterface,
  NotificationCommentSchema,
  NotificationCommentDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('notificationComments Controller Unit Test', () => {
  let dataInfo: NotificationCommentModelInterface;
  let notificationId = '',
    userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create notificationComments', () => {
    before(async () => {
      //get userId
      const userResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!userResult) {
        return false;
      }
      userId = userResult._id;
      //get notification
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!dbResult) {
        return false;
      }
      notificationId = dbResult._id;

      await NotificationCommentSchema.remove({ comment: 'test' });
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/notificationcomments')
        .set('authorization', authToken)
        .send({
          comment: 'test',
          date: new Date(),
          userId: userId,
          read: false
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

    it('Should create an notificationComments Object', done => {
      chai
        .request(app)
        .post('/notificationcomments')
        .set('authorization', authToken)
        .send({
          notificationId: notificationId,
          comment: 'test',
          date: new Date(),
          userId: userId,
          read: false
        })
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'error') {
            console.log(res.text);
            done(res.text);
          } else {
            return done();
          }
        })
        .catch((reason: any) => {
          console.log(reason);
          done(reason);
        });
    });
  });

  describe('Modify notificationComments', () => {
    before(async () => {
      let dbResult: NotificationCommentDocumentInterface = await NotificationCommentSchema.findOne(
        {
          comment: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      dataInfo = dbResult;
    });

    it('Should modify an notificationComments Object', done => {
      chai
        .request(app)
        .put('/notificationcomments')
        .set('authorization', authToken)
        .send(dataInfo)
        .then(res => {
          if ((JSON.parse(res.text) as any).code === 'success') {
            let notificationId = (JSON.parse(res.text) as any).detail._id;
            expect(notificationId).is.not.null;
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

  describe('Get notificationComments', () => {
    it('Should get all notificationComments', done => {
      chai
        .request(app)
        .get('/notificationcomments')
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
      let dbResult: NotificationCommentDocumentInterface = await NotificationCommentSchema.findOne(
        {
          comment: 'test'
        }
      );
      if (!dbResult) {
        return false;
      }
      accountId = dbResult._id;
    });

    it("Should get an notificationComments by it's id", done => {
      chai
        .request(app)
        .get(`/notificationcomments/${accountId}`)
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

    let notificationId = '';
    before(async () => {
      let dbResult: NotificationDocumentInterface = await NotificationSchema.findOne(
        {
          host: userId
        }
      );
      if (!dbResult) {
        return false;
      }
      notificationId = dbResult._id;
    });

    it("Should get a notificationComments by it's notificationId", done => {
      chai
        .request(app)
        .get(`/notificationcomments/bynotification/${notificationId}`)
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

    it("Should get an notificationComments by it's userId", done => {
      chai
        .request(app)
        .get(`/notificationcomments/byuser/${userId}`)
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

    it('Should search notificationComments object', done => {
      chai
        .request(app)
        .post(`/notificationcomments/search`)
        .set('authorization', authToken)
        .send({ userId: userId })
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
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
