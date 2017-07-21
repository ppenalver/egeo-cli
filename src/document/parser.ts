import { getAllResults } from './parser-utils';
import { DocParam, TAG_TYPES } from './parser.model';

export function parser(text: string): DocParam[] {
   let comments: string[] = getAllResults(text, /\/\*\*(([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*)\*\/+/igm, 1);
   comments = comments.map((_) => removeStars(_));
   comments = comments.reduce((prev: string[], curr: string) => [...prev, ...splitByTag(curr)], []);
   return comments.map((_) => new DocParam(_));
}

function removeStars(text: string): string {
   return text.split('*').map((_) => _.trim()).join('\n');
}

function splitByTag(text: string): string[] {
   return text.trim().split('@').
      reduce((prev: string[], curr: string) => curr.trim().length > 0 ? [...prev, `@${curr}`] : prev, []);
}
