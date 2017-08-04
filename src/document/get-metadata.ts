import { readFileSync } from 'fs';

import { log } from '../utils';
import { CommentParsed, parser } from './parser';

export function getMetadata(filePath: string): CommentParsed {
   log(`[READ FILE]: ${filePath}`);
   const fileContent: string = readFileSync(filePath, 'utf-8');
   log(`[PARSE METADATA]........`);
   return parser(fileContent, filePath);
}
