import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { DemoComponent } from './app.component';
import { FakeComponent } from './fake.component';
import { ExampleModule } from 'demo';
import { getRouter } from './config';

// Libs and external dependencies
import 'rxjs';
import 'styles/global.scss';

@NgModule({
   imports: [
      BrowserModule,
      ExampleModule,
      RouterModule.forRoot(getRouter())
   ],
   declarations: [DemoComponent, FakeComponent],
   bootstrap: [DemoComponent]
})
export class DemoModule {}
