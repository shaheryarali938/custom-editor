import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPositiveNumber]'
})
export class PositiveNumberDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value.length > 0 && value[0] === '0') {
      value = value.substring(1);
    }

    this.ngControl.control?.setValue(value);
  }
}