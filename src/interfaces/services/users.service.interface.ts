import { ServiceResultInterface } from '../service-result.interface';
import { UserModelInterface } from '../models/user.model.interface';

export interface UsersServiceInterface {
  CreateRecord(obj: UserModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(obj: UserModelInterface): Promise<ServiceResultInterface>;
  ChangeStatus(email: string, status: string): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(id: string): Promise<ServiceResultInterface>;
  Search(workingObject: any, populateAll: boolean): Promise<ServiceResultInterface>;
}
