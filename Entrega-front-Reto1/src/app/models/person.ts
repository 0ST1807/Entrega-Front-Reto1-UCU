export interface Person {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  telefono: string;
  ciudad: string;
}

export type PersonPayload = Omit<Person, 'id'>;
