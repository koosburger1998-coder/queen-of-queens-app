import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[ngVar]' })
export class NgVarDirective<T> {
  private context: { ngVar: T | null; $implicit: T | null } = { ngVar: null, $implicit: null };

  constructor(private vcr: ViewContainerRef, private tmpl: TemplateRef<{ ngVar: T; $implicit: T }>) {
    this.vcr.createEmbeddedView(this.tmpl, this.context);
  }

  @Input() set ngVar(value: T) {
    this.context.ngVar = value;
    this.context.$implicit = value;
  }
}
