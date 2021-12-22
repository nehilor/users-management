import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MongoTestingConfig } from '../mongoConfig';
import * as Chalk from 'chalk';

import app from '../../src/app';
import { BlogModelInterface } from '../../src/interfaces/models';
import {
  UserSchema,
  UserDocumentInterface,
  BlogSchema,
  BlogDocumentInterface
} from '../../src/models';

chai.use(chaiHttp);
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFHVnNiRzhnZDI5eWJHUSIsImlhdCI6MTYxODY4NjkxNywiZXhwIjoxMDAwMDAwMDE2MTg2ODY5MTB9.Rj6iIBSuIkvU8yIhb_DtXrGuk-Qd1PL39MlWJp6YFgo';

describe('Blog Controller Unit Test', () => {
  let blogInfo: BlogModelInterface;
  let userId = '';
  before((done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create blog', () => {
    before(async () => {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: 'test@test.test'
      });
      if (!dbResult) {
        return false;
      }
      await BlogSchema.remove({ title: 'test' });
      userId = dbResult._id;
    });

    it('Should return an error', done => {
      chai
        .request(app)
        .post('/blogs')
        .set('authorization', authToken)
        .send({
          title: 'test',
          content: 'test',
          images: [{ location: 'test', key: 'test' }],
          date: new Date(),
          status: 'test',
          approved: true
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

    it('Should create an blog Object', done => {
      chai
        .request(app)
        .post('/blogs')
        .set('authorization', authToken)
        .send({
          userId: userId,
          title: 'test',
          content: 'test',
          images: [{ location: 'test', key: 'test' }],
          date: new Date(),
          status: 'test',
          approved: true
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

  describe('Modify blog', () => {
    before(async () => {
      let dbResult: BlogDocumentInterface = await BlogSchema.findOne({
        title: 'test'
      });
      if (!dbResult) {
        return false;
      }
      blogInfo = dbResult;
      blogInfo.content = 'test updated';
    });

    it('Should modify an blog Object', done => {
      chai
        .request(app)
        .put('/blogs')
        .set('authorization', authToken)
        .send(blogInfo)
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

  describe('Get blog', () => {
    it('Should get all blog', done => {
      chai
        .request(app)
        .get('/blogs')
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

    let blogId = '';
    before(async () => {
      let dbResult: BlogDocumentInterface = await BlogSchema.findOne({
        title: 'test'
      });
      if (!dbResult) {
        return false;
      }
      blogId = dbResult._id;
    });

    it("Should get an blog by it's id", done => {
      chai
        .request(app)
        .get(`/blogs/${blogId}`)
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

    it("Should get an blog by it's userId", done => {
      chai
        .request(app)
        .get(`/blogs/byuser/${userId}`)
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

    it('Should search blog object', done => {
      chai
        .request(app)
        .post('/blogs/search')
        .set('authorization', authToken)
        .send({
          workingObject: {
            title: 'test'
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
