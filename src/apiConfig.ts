import 'reflect-metadata';
import { Container } from 'inversify';
import {
  UsersService,
  TokensService,
} from './services/';
import {
  UsersServiceInterface,
  TokensServiceInterface,
  AuthServiceInterface
} from './interfaces/services';
import { ApiTypes } from './apiTypes';
import { AuthService } from './services/auth.service';

let ApiContainer = new Container();

ApiContainer.bind<UsersServiceInterface>(ApiTypes.usersService).to(UsersService);
ApiContainer.bind<TokensServiceInterface>(ApiTypes.tokensService).to(TokensService);
ApiContainer.bind<AuthServiceInterface>(ApiTypes.authService).to(AuthService);

export { ApiContainer };
