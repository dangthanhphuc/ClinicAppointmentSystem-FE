import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(control : AbstractControl) : {[key : string] : boolean} | null {
    const password = control.get('password');
    const retypePassword = control.get('retypePassword');    

    return password != null && retypePassword != null && password?.value != retypePassword?.value ? {passwordMismatch : true} : null;
}

export function timeRangeValidator(startTimeKey: string, endTimeKey: string): ValidatorFn {
    debugger
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.get(startTimeKey)?.value;
      const endTime = control.get(endTimeKey)?.value;
  
      if (startTime && endTime && startTime >= endTime) {
        return { timeRange: true };
      }
      return null;
    };
  }