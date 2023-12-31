import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { Observable } from "rxjs";
import { AuthServiceService } from "./auth-service.service";

@Injectable()
export class httpInterceptors implements HttpInterceptor{

    public token = '';

    constructor(
        private authService: AuthServiceService,
    ) {}

    //intercept the request and add authorization token to the request if user is logged in
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Interceptor Engaged");
        const that = this;
        if (that.authService.isLoggedIn()) {
            that.token = that.authService.getToken();

            const request = req.clone({
                headers: req.headers.set(
                    'Authorization', `Bearer ${that.token}`,)
            });

            return next.handle(request);
        } else {
            return next.handle(req);
        }
    }


}