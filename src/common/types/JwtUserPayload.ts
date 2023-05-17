export type JwtUserPayload = {
  provider: string;
  username: string;
  email: string;
  RolesOnUsers: {
    role_id: number;
  }[];
};
