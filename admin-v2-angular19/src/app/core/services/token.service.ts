import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly sessionKey = 'HGDFWEBNDBFUSHDFDNSFBDHSGFDBNSFD';

  setToken(data: string): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(data));
  }

  getToken(): string | null {
    const raw = localStorage.getItem(this.sessionKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  removeToken(): void {
    localStorage.removeItem(this.sessionKey);
  }
}
