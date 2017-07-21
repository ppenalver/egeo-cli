import * as _ from 'lodash';

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

export function normalizeText(text: string): string {
   text = _(text).defaultTo('').toString().trim();
   if (text.length > 0) {
      while (_.startsWith(text, '\n')) {
         text = text.substring(1);
      }
      while (_.startsWith(text, '\r')) {
         text = text.substring(1);
      }
      while (_.startsWith(text, '\t')) {
         text = text.substring(1);
      }
   }
   return text.trim();
}
