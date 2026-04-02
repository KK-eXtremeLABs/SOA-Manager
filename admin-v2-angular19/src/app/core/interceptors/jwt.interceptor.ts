import {
  HttpInterceptorFn,
  HttpParams,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Helpers } from '../utils/helpers';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  let request = req;
  let httpParams = new HttpParams();

  // Split URL and query params for proper handling
  const urlSplit = request.url.split('?');
  if (urlSplit.length === 2) {
    request = request.clone({ url: urlSplit[0] });

    const queryParamsSplit = urlSplit[1].split('&');
    queryParamsSplit.forEach((value) => {
      const splitValue = value.split('=');
      if (httpParams.has(splitValue[0])) {
        httpParams = httpParams.append(splitValue[0], splitValue[1]);
      } else {
        httpParams = httpParams.set(splitValue[0], splitValue[1]);
      }
    });

    request.params.keys().forEach((key) => {
      const val = request.params.getAll(key);
      if (val && val.length > 0) {
        if (httpParams.has(key)) {
          httpParams = httpParams.append(key, val[0]);
        } else {
          httpParams = httpParams.set(key, val[0]);
        }
      }
    });

    if (httpParams.keys().length > 0) {
      request = request.clone({ params: httpParams });
    }
  }

  // EPT encryption for GET requests
  if (
    environment.eptEnabled &&
    request.method === 'GET' &&
    request.params.keys().length > 0
  ) {
    httpParams = new HttpParams();

    const paramsObject: { [key: string]: string | string[] } = {};
    request.params.keys().forEach((key) => {
      const values = request.params.getAll(key);
      if (values) {
        const value =
          values.length > 1 || key.includes('[]') ? values : values[0];
        paramsObject[key.replace('[]', '')] = value;
      }
    });

    const encryptedParams = Helpers.encryptData(paramsObject);
    httpParams = httpParams.set('xyz', encryptedParams);

    request = request.clone({ params: httpParams });
  }

  // Attach JWT token for same-origin requests
  const token = tokenService.getToken();
  const selfHost = request.url.match(environment.baseUrl);
  if (token && selfHost) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request);
};
