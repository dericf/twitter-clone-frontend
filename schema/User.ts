import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  birthdate: string;
}

export interface UserUpdateRequestBody {
  password: string;
  newUsername?: string;
  newBio?: string;
}

export interface UserCreateRequestBody {
  username: string;
  email: string;
  bio: string;
  birthdate: string;
  password: string;
}

export interface UserRegisterForm extends UserCreateRequestBody {
  confirmPassword: string;
}

export interface UserDeleteRequestBody {
  password: string;
}

export interface UserAccountConfirmationRequestBody {
  confirmationKey: string;
}

export type UserResponse = APIResponse<Array<User>>;
export type UserUpdateResponse = APIResponse<User>;
export type UserCreateResponse = APIResponse<User>;
export type UserDeleteResponse = APIResponse<EmptyResponse>;

export type UserAccountConfirmationResponse = APIResponse<EmptyResponse>;
