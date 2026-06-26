import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  updateName(userId: number, name: string): Observable<UserDTO> {
    return this.http
      .patch<ApiResponse<UserDTO>>(`${this.base}/api/v1/users/${userId}/name`, { string: name })
      .pipe(map((r) => r.data));
  }

  updateEmail(userId: number, email: string): Observable<UserDTO> {
    return this.http
      .patch<ApiResponse<UserDTO>>(`${this.base}/api/v1/users/${userId}/email`, { email })
      .pipe(map((r) => r.data));
  }

  delete(userId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<UserDTO>>(`${this.base}/api/v1/users/${userId}`)
      .pipe(map(() => undefined));
  }
}
