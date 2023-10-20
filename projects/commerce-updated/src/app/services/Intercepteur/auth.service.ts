import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FortressService } from '../local/local.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private fortress: FortressService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.fortress.get('token');
    if (authToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`),
      });
      return next.handle(authRequest);
    }
    return next.handle(request);
  }
}
