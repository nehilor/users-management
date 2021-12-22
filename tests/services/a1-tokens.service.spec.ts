import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';
import * as Chalk from 'chalk';

import { TokensServiceInterface } from '../../src/interfaces/services';
import { TokenModelInterface } from '../../src/interfaces/models';
import { ServiceResultInterface } from '../../src/interfaces/service-result.interface';
import { ApiContainer } from '../../src/apiConfig';
import { ApiTypes } from '../../src/apiTypes';
import { TokenSchema, TokenDocumentInterface } from '../../src/models';
import { MongoTestingConfig } from '../mongoConfig';

describe('Token Unit Test', () => {
  let tokenInfo: TokenModelInterface;
  before(async (done: MochaDone) => {
    MongoTestingConfig.ConnectToDB();
    done();
  });

  describe('Create token', () => {
    before(async () => {
      await TokenSchema.remove({ token: 'test' });
    });

    it('Should create an token Object', done => {
      ApiContainer.get<TokensServiceInterface>(ApiTypes.tokensService)
        .CreateRecord({
          token: 'test'
        })
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            done();
          } else {
            return done(serviceResult);
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
      ApiContainer.get<TokensServiceInterface>(ApiTypes.tokensService)
        .ModifyRecord(tokenInfo)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let tokenId = serviceResult.detail;
            expect(tokenId).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });
  });

  describe('Get token', () => {
    it('Should get all token', done => {
      ApiContainer.get<TokensServiceInterface>(ApiTypes.tokensService)
        .GetAll()
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let tokensArray: TokenModelInterface[] = serviceResult.detail as TokenModelInterface[];
            expect(tokensArray.length).greaterThan(0);
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch(reason => {
          return done(reason);
        });
    });

    let tokenId = '';
    before(async () => {
      let dbResult: TokenDocumentInterface = await TokenSchema.findOne();
      if (!dbResult) {
        return false;
      }
      tokenId = dbResult._id;
    });

    it("Should get an token by it's id", done => {
      ApiContainer.get<TokensServiceInterface>(ApiTypes.tokensService)
        .GetById(tokenId)
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let tokenId = serviceResult.detail._id;
            expect(tokenId).is.not.null;
            done();
          } else {
            done(serviceResult);
          }
        })
        .catch((reason: any) => {
          throw done(reason);
        });
    });

    it('Should search token object', done => {
      ApiContainer.get<TokensServiceInterface>(ApiTypes.tokensService)
        .Search({})
        .then((serviceResult: ServiceResultInterface) => {
          if (serviceResult.code === 'success') {
            let tokensArray: TokenModelInterface[] = serviceResult.detail as TokenModelInterface[];
            expect(tokensArray.length).greaterThan(0);
            done();
          } else {
            return done(serviceResult);
          }
        })
        .catch(reason => {
          return done(reason);
        });
    });
  });
});

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});
