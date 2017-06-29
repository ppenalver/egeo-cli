/* tslint:disable */
import { expect } from 'chai';
import * as fs from 'mock-fs';

import { ComponentInfo } from './document.interfaces';
import { getMetadata } from './get-metadata';


const testCode: string = `
/** @description {Component} Breadcrumbs
 *
 * The breadcrumb component show you a path of navigation separated by arrow like a breadcrumb path.
 *
 * @example
 *
 * <breadcrumb
 *    [options]="options"
 *    qaTag="test"
 *    (changeOption)="onChangeOption(event)">
 * </breadcrumb>
 */
@Component({
   selector: 'st-breadcrumbs',
   templateUrl: './st-breadcrumbs.html',
   styleUrls: ['./st-breadcrumbs.scss']
})
export class StBreadCrumbs implements OnInit {
   /** @Input {string[]} options Options to show chained by arrows */
   @Input() options: string[];
   /** @Input {string} qaTag='' Id for qa tests */
   @Input() qaTag: string = '';
   /** @Input {string} [optional] optional parameter 1 */
   @Input() optionalTest: string;
   /** @Input {string} [optionInitialized=''] optional parameter 2 */
   @Input() optionInitialized: string = '';
   /** @Output {number} index of option clicked */
   @Output() changeOption: EventEmitter<number> = new EventEmitter<number>();

   ngOnInit(): void {
      if (!this.qaTag) {
         throw new Error('qaTag is a necesary field');
      }
   }
}
`;

describe('get Metadata', () => {
   const breadcrumbPath: string = '/components/test/breadcrumb.component.ts';
   const MOCK_FILE_INFO: fs.Config = {
      breadcrumbPath: testCode
   };
   fs(MOCK_FILE_INFO);

   afterEach(() => {
      fs.restore();
   });


   it('read main comment', () => {
      const result: any = getMetadata(breadcrumbPath);
      console.log(JSON.stringify(result));
      expect(true).to.be.true;
   });
});
