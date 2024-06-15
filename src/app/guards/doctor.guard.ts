import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";


@Injectable({
    providedIn: 'root'
  })
export class DoctorGuard {

    constructor(
        private tokenService : TokenService,
        private userService : UserService,
        private router : Router
    ){

    }
    
    canActivate(next: ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isUserIdValid = this.tokenService.getUserId() > 0;
        const userResponse = this.userService.getFromLocalStorage();
        const isDoctor = userResponse?.role.toUpperCase() === "DOCTOR";

        if(!isTokenExpired && isUserIdValid && isDoctor) {
            return true;
        }else {
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
            // Ví dụ trả về trang login:
            this.router.navigate(['/login']);
            return false;
        }
        
    }

}

export const DoctorGuardFn : CanActivateFn = (next : ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean => {
    return inject(DoctorGuard).canActivate(next, state);
}