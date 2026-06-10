import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HighlightDirective } from './directives/highlight.directive';
import { NgVarDirective } from './directives/ng-var.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [SpinnerComponent, NavbarComponent, HighlightDirective, NgVarDirective, DateFormatPipe],
  imports: [CommonModule, RouterModule, MatButtonModule, MatProgressSpinnerModule],
  exports: [SpinnerComponent, NavbarComponent, HighlightDirective, NgVarDirective, DateFormatPipe, CommonModule],
})
export class SharedModule {}
