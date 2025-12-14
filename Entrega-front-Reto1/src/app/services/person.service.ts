import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person, PersonPayload } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly API_URL = 'http://localhost:3000/personas';

  constructor(private readonly http: HttpClient) {

  }

  getAll(): Observable<Person[]> { //Observable lo que hace es "observar" los cambios que hay en el backend
    return this.http.get<Person[]>(this.API_URL);
  }

  create(payload: PersonPayload): Observable<Person> {
    return this.http.post<Person>(this.API_URL, payload);
  }

  update(id: number, payload: PersonPayload): Observable<Person> {
    return this.http.put<Person>(`${this.API_URL}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
