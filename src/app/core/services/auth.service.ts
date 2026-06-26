import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { ApiResponse, CurrentUser, LoginRequest, LoginResponse, RegisterRequest, Role, UserDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  readonly currentUser = signal<CurrentUser | null>(null);
  readonly isAdmin = computed(() => this.currentUser()?.role === Role.ADMIN);

  constructor() {
    this.restoreSession();
  }

  login(request: LoginRequest): Observable<CurrentUser> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/authenticate`, request)
      .pipe(
        switchMap((response) => {
          this.storage.setToken(response.accessToken);
          this.storage.setRefreshToken(response.refreshToken);
          this.storage.setEmail(request.email);
          return this.http.get<ApiResponse<UserDTO>>(`${environment.apiUrl}/api/v1/users/${request.email}`);
        }),
        map((wrapped): CurrentUser => ({ ...wrapped.data, token: this.storage.getToken()! })),
        tap((current) => {
          this.persistUser(current);
          this.router.navigate(['/overview']);
        }),
      );
  }

  register(request: RegisterRequest): Observable<UserDTO> {
    return this.http
      .post<ApiResponse<UserDTO>>(`${environment.apiUrl}/api/v1/users`, request)
      .pipe(map((r) => r.data));
  }

  logout(): void {
    const refreshToken = this.storage.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(`${environment.apiUrl}/authenticate/logout`, { refreshToken })
        .subscribe({ error: () => {} });
    }
    this.storage.clearAuth();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }

  private persistUser(user: CurrentUser): void {
    this.storage.setUserId(user.id);
    this.storage.setName(user.name);
    this.storage.setRole(user.role);
    this.currentUser.set(user);
  }

  private restoreSession(): void {
    const token = this.storage.getToken();
    const id = this.storage.getUserId();
    const email = this.storage.getEmail();
    const name = this.storage.getName();
    const role = this.storage.getRole() as Role | null;

    if (token && id && email && name && role) {
      this.currentUser.set({ id, email, name, role, token });
    }
  }
}
