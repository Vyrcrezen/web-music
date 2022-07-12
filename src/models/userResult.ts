export type UserResult =
    | false
    | {
          authenticated: true;
          id: string | number;
      };
