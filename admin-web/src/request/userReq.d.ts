export interface UserReq {
  Name: string;
  PhoneNumber: string;
  Username: string;
  Password: string;
}

export interface UpdateUserReq {
  Name: string;
  PhoneNumber: string;
  Username: string;
  Email: string;
}

export interface UpdatePasswordReq {
  current_password: string;
  new_password: string;
}