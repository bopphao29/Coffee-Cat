import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : any = FormGroup;
  responseMessage : any;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      phone : [null, [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      password: [null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      phone : formData.phone,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) =>{
      console.log(response)
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('token', response.token)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('fullname', response.data.fullname)
      this.snackbarService.openSnackBar(this.responseMessage,"Đăng nhập thành công")
      
      if(localStorage.getItem('role') === 'user'){
        this.router.navigate(['/product']);
      }
      else{
        this.router.navigate(['/dashbord']);
      }
    },(error) => {
      this.ngxService.stop();
      if(error.error?.error){
        this.responseMessage = error.error?.error
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
