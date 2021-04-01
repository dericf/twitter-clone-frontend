export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  birthdate: string;
}

export type UserResponse = Array<User>;

export interface UserUpdateRequestBody {
  password: string;
  newUsername: string;
  newBio: string;
}

export type UserUpdateResponse = User;


export interface UserCreateRequestBody {
  username: string;
  email: string;
  bio: string;
  birthdate: string;
	password: string;
}

export type UserCreateResponse = User;


export interface UserDeleteRequestBody {
	password: string
}