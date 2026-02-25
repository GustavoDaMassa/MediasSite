import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  updateName(userId: number, name: string): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.base}/api/v1/users/${userId}/name`, { string: name });
  }

  updateEmail(userId: number, email: string): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.base}/api/v1/users/${userId}/email`, { email });
  }

  delete(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/v1/users/${userId}`);
  }
}
