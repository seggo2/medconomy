import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  address?: string | null;
  company?: Company | null;
  relatedCoworkers?: User[] | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private api = '/api/users';

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  getOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.api, user);
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}`, user);
  }

  getCompanies() {
    return this.http.get<Company[]>(`/api/companies`);
  }
  
}
