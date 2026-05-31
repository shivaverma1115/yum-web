export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  country: string;
  state: string;
  zipCode: string;
  description: string;
}