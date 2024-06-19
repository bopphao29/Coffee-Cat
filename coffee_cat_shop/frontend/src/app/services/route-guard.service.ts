import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode"
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  role: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');

    var tokenPayload: any
    try {
      tokenPayload = jwt_decode(token);
    }
    catch (error) {
      localStorage.clear()
      this.router.navigate(['/'])
    }

    let checkrole = false;

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkrole = true
      }
    }

    if (tokenPayload.role == 'admin') {
      this.role == 'admin';
      if (this.auth.isAuthenticated() && checkrole) {
        return true;
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error);
      this.router.navigate(['/product'])
      return false
    } else if (tokenPayload.role == 'user') {
      this.role == 'user';
      if (this.auth.isAuthenticated() && checkrole) {
        return true;
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error);
      this.router.navigate(['/user-view-product'])
      return false
    }
    else {
      this.router.navigate(['/'])
      localStorage.clear();
      return false;
    }

  }

}
