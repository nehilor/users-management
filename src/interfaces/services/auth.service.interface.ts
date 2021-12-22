import { ServiceResultInterface } from '../service-result.interface';

export interface AuthServiceInterface {
  VerifyCredentials(
    userName: string,
    password: string
  ): Promise<ServiceResultInterface>;
  ModifyPassword(
    _id: string,
    currentPassword: string,
    newPassword: string,
    passwordVerification: string
  ): Promise<ServiceResultInterface>;
  CreateRecoveryPasswordToken(email: string): Promise<ServiceResultInterface>;
  VerifyRegistrationToken(
    registrationToken: string
  ): Promise<ServiceResultInterface>;
}
