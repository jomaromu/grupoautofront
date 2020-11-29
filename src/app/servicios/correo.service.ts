import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  constructor(
    private http: HttpClient
  ) { }

  enviarCorreo(data): Observable<any> {

    const url = 'https://grupoautopanama.com:3000';
    return this.http.post(url, data )
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

}
