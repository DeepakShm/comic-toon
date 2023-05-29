export type JwtUserPayload = {
  provider: string;
  username: string;
  email: string;
  RolesOnUsers: {
    role_id: number;
  }[];
};

export type ReqUser = {
  provider: string;
  username: string;
  email: string;
  userId: string;
  roles: number[];
  iat: number;
  exp: number;
};
