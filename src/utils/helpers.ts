import { readFileSync } from 'fs';
import * as beautify from 'js-beautify';
import * as _ from 'lodash';

export function getFileContent(path: string): string {
   console.log(JSON.stringify(readFileSync));
   return readFileSync(path, 'utf-8');
}
