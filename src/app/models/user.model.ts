import { RoleTypeEnum } from "./enums/role-type.enum";

export interface UserModel {
    id: number;
    name: string;
    email: string;
    password: string;
  }