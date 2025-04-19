export interface ISignUp {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ICreatedUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  accessToken: string;
}
