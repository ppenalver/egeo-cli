import { Component, ViewEncapsulation } from '@angular/core';

@Component({
   selector: 'app',
   styleUrls: ['app.component.scss'],
   encapsulation: ViewEncapsulation.None,
   template: `
      <st-demo></st-demo>
      <router-outlet></router-outlet>
   `
})
export class DemoComponent { }
