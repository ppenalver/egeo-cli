import {
   defaultTo as _defaultTo,
   startsWith as _startsWith
} from 'lodash';

import { log } from '../utils';
import { DocExample } from './doc-example';
import { TAG_TYPES } from './parser.model';

export function applyRegexp(text: string, reg: RegExp, valueToTake: number): [string, string] {
   const result: RegExpMatchArray | null = reg.exec(text);
   if (result !== null) {
      return [result[valueToTake], text.replace(result[0], '')];
   }
   return ['', text];
}

export function getAllResults(text: string, reg: RegExp, valueToTake: number): string[] {
   let match: RegExpMatchArray | null = null;
   const result: string[] = [];
   do {
      match = reg.exec(text);
      if (match) {
         result.push(match[valueToTake].trim());
      }
   } while (match);
   return result;
}

export function normalizeText(text: string | null | undefined, removeLineBreak: boolean = false): string {
   text = _defaultTo(text, '').trim();
   if (text.length > 0) {
      if (removeLineBreak) {
         text = text.replace(/(\r\n|\n|\r)/gm, '');
      }
      while (_startsWith(text, '\n')) {
         text = text.substring(1);
      }
      while (_startsWith(text, '\r')) {
         text = text.substring(1);
      }
      while (_startsWith(text, '\t')) {
         text = text.substring(1);
      }
   }
   return text.trim();
}

export function getTag(type: string | null | undefined): TAG_TYPES {
   switch (_defaultTo(type, '').toLowerCase()) {
      case 'description': return TAG_TYPES.DESCRIPTION;
      case 'example': return TAG_TYPES.EXAMPLE;
      case 'injection': return TAG_TYPES.INJECTION;
      case 'input': return TAG_TYPES.INPUT;
      case 'method': return TAG_TYPES.METHOD;
      case 'model': return TAG_TYPES.MODEL;
      case 'output': return TAG_TYPES.OUTPUT;
      case 'param': return TAG_TYPES.PARAM;
      default:
         return TAG_TYPES.UNKNOWN;
   }
}

export function parseExample(text: string): DocExample[] {
   let internalText: string = text;
   const reg: RegExp = /({(.*?)}(.|[\r\n])+?)*(\[(.*?)\](.|[\r\n])+?)*(```((.|[\r\n])+?)```)/;
   let match: RegExpMatchArray | null = reg.exec(internalText);
   const result: DocExample[] = [];
   while (match !== null) {
      result.push(new DocExample(match[2], match[5], match[8], ''));
      internalText = internalText.replace(match[0], '');
      match = reg.exec(internalText);
   }
   return result;
}
