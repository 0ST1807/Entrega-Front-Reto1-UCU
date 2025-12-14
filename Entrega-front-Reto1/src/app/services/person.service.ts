import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person, PersonPayload } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly resourceUrl = 'http://localhost:3000/personas';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.resourceUrl);
  }

  create(payload: PersonPayload): Observable<Person> {
    return this.http.post<Person>(this.resourceUrl, payload);
  }

  update(id: number, payload: PersonPayload): Observable<Person> {
    return this.http.put<Person>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
