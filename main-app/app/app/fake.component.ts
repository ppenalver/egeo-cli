import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'st-fake-component-page',
   template: '<div>YOU NAVIGATE TO PAGE: {{pageName}}  <router-outlet></router-outlet> </div>',
   changeDetection: ChangeDetectionStrategy.OnPush
})

export class FakeComponent {
   public pageName: string = 'ERROR';

   constructor(private _router: ActivatedRoute) {
      let id: string = 'pageName';
      this._router.data.subscribe(data => this.pageName = data[id]);
   }
}
