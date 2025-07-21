import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private apiUrl = environment.apiUrl;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}Usuarios`)
    }

    /**
     * Get the current signed-in user data
     */
    getContries(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this.apiUrl}Paises`);
    }


    /**
    * Get the current signed-in user data
    */
    post(user: User): Observable<any> {
        return this._httpClient.post<User>(`${this.apiUrl}Usuarios`, user).pipe(
            map((user) => {
                this._user.next(user);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(id, user: User): Observable<any> {
        return this._httpClient.put<User>(`${this.apiUrl}Usuarios/${id}`, user).pipe(
            map((response) => {
                this._user.next(response);
            }),
        );
    }

       /**
     * Update the user
     *
     * @param user
     */
    delete(id): Observable<any> {
        return this._httpClient.delete<User>(`${this.apiUrl}Usuarios/${id}`).pipe(
            map((response) => {
                this._user.next(response);
            }),
        );
    }
}
