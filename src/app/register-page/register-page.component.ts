import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  //variable to display form information to user, variable for selected theme
  public formError = '';
  public selectedTheme: any;

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private userService: UserService
  ) { }

  //get user selected theme
  ngOnInit(): void {
    this.getTheme();
  }

  //user formBuilder to create registration form
  public registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required]
  },
  {validators: this.validatePass});

  //ensure the user filled in the form and attempt to register
  register() {
    if (this.registerForm.controls['username'].pristine || this.registerForm.controls['password'].pristine || this.registerForm.controls['passwordConfirm'].pristine) {
      this.formError = "All fields are required";
    }
    else if (this.registerForm.valid) {
      this.registerUser(this.registerForm.value);
    } else {
      this.formError = "Passwords must match"
    }
}

//register  new user and save authorization token if successful
  public registerUser(user: any) {
    const that = this;
    this.authService.registerUser(user).subscribe({
      next(res: any) {
        that.authService.saveToken(res.token);
      },
      error(err: any) {
        that.formError = "Unable to create account"
      },
      complete() {
        that.router.navigateByUrl('home');
      }
    })

  }

//private function to confirm that both passwords match
  private validatePass(form: FormGroup) {
      return form.controls['password'].value === form.controls['passwordConfirm'].value ? null : {nomatch: true};
    }

    private getTheme() {
      this.selectedTheme = this.userService.getTheme();
    }
}
