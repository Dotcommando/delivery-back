import ObjectId from 'bson-objectid';


export interface IAddress<T_id = ObjectId, TUser = ObjectId> {
  _id: T_id;
  userId: TUser;
  postalCode?: string;
  country: string;
  region?: string;
  city: string;
  street: string;
  building: string;
  flat?: string;
}
