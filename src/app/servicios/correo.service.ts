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

    // const url = 'http://localhost:3000';
    const url = 'http://3.139.64.158:3000';
    return this.http.post(url, data )
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

}
