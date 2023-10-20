import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  //variable to display form information to user, variable for selected theme
  public formError = '';
  public selectedTheme: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private userService: UserService
  ) {}

  //get user selected theme
  ngOnInit(): void {
    this.getTheme();
  }

  //use formBuilder to create login form
  public loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })


  //check that the user has filled in the form and attempt login
  public login() {
    if (this.loginForm.controls['username'].pristine || this.loginForm.controls['password'].pristine) {
      this.formError = "All fields are required";
    }
    else if (this.loginForm.valid) {
      this.loginUser(this.loginForm.value);
    }
  }

  //log the user in and save authorization token if successful
  public loginUser(user: any) {
    const that = this;
    this.authService.loginUser(user).subscribe({
        next(res: any) {
          that.authService.saveToken(res.token);
        },
        error(err: any) {
          that.formError = "Unauthorized Credentials";
        },
        complete() {
          that.router.navigateByUrl('home');
        }
      })
    }


  //go to the registration page
  public register() {
    this.router.navigateByUrl('register');
  }

  private getTheme() {
    this.selectedTheme = this.userService.getTheme();
  }

  }
