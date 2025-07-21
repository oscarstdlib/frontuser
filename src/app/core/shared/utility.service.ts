import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { catchError, Observable, throwError } from 'rxjs';
import { AppSettingsService } from '../config/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private _httpClient = inject(HttpClient);
  icono: "error" | "warn" | "primary" | "accent" | "basic" | "info" | "success" | "warning" = "error";

  constructor(
    private router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _seting:AppSettingsService
  ) { }


  /**
  * @description: peticion get
  * @param url: string endpoind
  */
  getQuery(url: string) {
    return this._httpClient.get(url).pipe(catchError(this.handleError));
  }

    /**
  * @description: peticion post
  * @param url: string endpoind
  * @param data: json a enviar
  */
    postFile(file: File) {
      const formData = new FormData();
      formData.append('archivo', file);
      return this._httpClient.post(this._seting.generica.url.ftp, formData).pipe(catchError(this.handleError));
    }

  /**
  * @description: peticion post
  * @param url: string endpoind
  * @param data: json a enviar
  */
  postQuery(url: string, data: any) {
    return this._httpClient.post(url, data).pipe(catchError(this.handleError));
  }


    /**
  * @description: peticion post
  * @param url: string endpoind
  * @param data: json a enviar
  */
    putQuery(url: string, data: any) {
      return this._httpClient.put(url, data).pipe(catchError(this.handleError));
    }
  

  /**
   * @description: para fallas de errores en las peticiones.
   */
  handleError = (err: any): Observable<HttpEvent<any>> => {
    if (err.status == 204) {
      return;
    }
    if (err.status == 404) {
      return;
    }
    let errorMessage = 'No hay respuesta, favor intente nuevamente';
    // console.log("Algo se daño");
    let res: any = {};
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error: ${err.error.message}`;
    } else {
      switch (err.status) {
        case 401:
        case 402:
        case 302:
        case 0:
          this.icono = 'warn'
          errorMessage = `Favor coloque los valores del inicio sesión nuevamente`;
          localStorage.clear();
          localStorage.clear();
          setTimeout(() => {
            localStorage.setItem('closeSession', 'true');
            this.router.navigate(['/sign-out'])
          }, 100);
          break;
        case 403:
          errorMessage = `No tiene permiso para ejecutar esta acción`;
          break;
        case 400:
          if (err.error.message == 'La session ha expirado') {
            localStorage.clear();
            localStorage.clear();
            setTimeout(() => {
              localStorage.setItem('closeSession', 'true');
              this.router.navigate(['/login'])
            }, 100);
          }
          if (
            err.error.message !== undefined &&
            typeof err.error.message == 'string'
          ) {
            errorMessage = `${err.error.message}`;
          }
          break;
        case 404:
          errorMessage = `${err.error.message}`;
          break;
        case 500:
          errorMessage = `${err.error.message}`;
          break;
        default:
          errorMessage = `${err.statusText.message}`;
          break;
      }
    }
    if (err.error !== 'La session ha expirado') {
      if (
        errorMessage != 'undefined' &&
        errorMessage !== undefined &&
        errorMessage != null &&
        errorMessage != '' &&
        errorMessage != 'UNKNOWN ERROR!'
      ) {
        // Swal.fire({
        //   title: 'Error',
        //   text: errorMessage,
        //   icon: this.icono,
        //   confirmButtonText: 'Cerrar',
        // }).then();

        const confirmation = this._fuseConfirmationService.open({
          title: 'Error',
          icon: {
            color: this.icono
          },
          message: errorMessage,
          actions: {
            confirm: {
              show: true,
              label: "Aceptar",
              color: 'warn'
            },
            cancel: {
              show: false
            }
          }
        });
      } else {
        // Swal.fire({
        //   title: 'Error',
        //   text: 'No hubo respuesta por parte del servidor, favor intente nuevamente',
        //   icon: this.icono,
        //   confirmButtonText: 'Cerrar',
        // }).then();

        const confirmation = this._fuseConfirmationService.open({
          title: 'Error',
          message: 'No hubo respuesta por parte del servidor, favor intente nuevamente',
          actions: {
            confirm: {
              show: true,
              label: "Aceptar",
              color: 'warn'
            },
            cancel: {
              show: false
            }
          }
        });
      }
    }
    return throwError(errorMessage);
  };


}
