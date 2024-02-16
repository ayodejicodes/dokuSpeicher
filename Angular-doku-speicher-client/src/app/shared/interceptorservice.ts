import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private _router: Router) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
            localStorage.removeItem('token');
            localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI0ZGI1YTFhMS0yODdiLTQyZGUtOWZjYS04N2FjNjM2ZTdmYTYiLCJ1bmlxdWVfbmFtZSI6IlRlc3RVc2VyIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm5iZiI6MTcwNzk5MzE4MywiZXhwIjoxNzA4NTk3OTgzLCJpYXQiOjE3MDc5OTMxODN9.a6-fwsSBrrQ37f9z3d5ylr4H345pQKQskWLm_GixZc4')
        if (localStorage.getItem('token') != null) {
            const idToken = localStorage.getItem('token');
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + idToken)
            });
            return next.handle(cloned).pipe
                (
                    tap(
                        (succ: any) => {
                            if (succ.body !== undefined) {
                                if (succ.body.status === 401 || succ.body.status === 403) {
                                    // localStorage.clear();
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    this._router.navigateByUrl('');
                                }
                            }
                        },
                        err => {
                            if (err.status === 401 || err.status === 403) {
                                // localStorage.clear();
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                this._router.navigateByUrl('');
                            }
                        }
                    )
                );
        }
        else {
            return next.handle(req);
        }
    }

}