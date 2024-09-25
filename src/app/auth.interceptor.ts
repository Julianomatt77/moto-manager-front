import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from "@angular/common/http";
import {Observable} from "rxjs";

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const idToken = window.sessionStorage.getItem("mm_token");

  if (idToken) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization",
        "Bearer " + idToken)
    });

    return next(cloned);
  }
  else {
    return next(req);
  }

}
