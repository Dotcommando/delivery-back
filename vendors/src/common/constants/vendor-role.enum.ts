export enum VENDOR_ROLE {
  ADMIN = 'admin',
  OWNER = 'owner',
  DIRECTOR = 'director',
  DEPUTY_DIRECTOR = 'deputy_director',
  SENIOR_ACCOUNTANT = 'senior_accountant',
  ACCOUNTANT = 'accountant',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  DELIVERYMAN = 'deliveryman',
}

export const VENDOR_ROLE_ARRAY = Object.values(VENDOR_ROLE);
