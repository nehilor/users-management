import { ServiceResultInterface } from '../service-result.interface';
import { TokenModelInterface } from '../models/token.model.interface';

export interface TokensServiceInterface {
  CreateRecord(obj: TokenModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(obj: TokenModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(id: string): Promise<ServiceResultInterface>;
  Search(workingObject: any): Promise<ServiceResultInterface>;
}
