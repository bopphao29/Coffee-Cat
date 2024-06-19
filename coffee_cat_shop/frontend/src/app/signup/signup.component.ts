import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  signupForm : any = FormGroup;
  responseMessage : any;


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      phone: [null, [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      fullname : [null, [Validators.required]],
      email : [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      address : [null, [Validators.required]],
      password: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]
    })
  }


  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      phone: formData.phone,
      fullname : formData.fullname,
      email : formData.email,
      address: formData.address,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }
    this.userService.signUp(data).subscribe((response: any) =>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Đăng ký thành công"),
      this.router.navigate(['/'])
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
