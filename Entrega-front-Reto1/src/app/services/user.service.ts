import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly MOCK_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.payload.signature';
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? window.localStorage : null;
  }

  login(username: string, password: string): Observable<boolean> {
    // Mocked async login flow so UI can react to pending state
    const storage = this.storage;
    if (storage) {
      storage.setItem('token', this.MOCK_JWT);
      storage.setItem('user', username);
    }

    return of(true).pipe(delay(500));
  }

  logout(): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    storage.removeItem('token');
    storage.removeItem('user');
  }

  isLoggedIn(): boolean {
    const storage = this.storage;
    return storage ? !!storage.getItem('token') : false;
  }

  getToken(): string | null {
    const storage = this.storage;
    return storage ? storage.getItem('token') : null;
  }

  getCurrentUser(): string | null {
    const storage = this.storage;
    return storage ? storage.getItem('user') : null;
  }
}
