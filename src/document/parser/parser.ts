import { getAllResults } from '../code-parser';
import { extractBlocks, removeStars } from './parser-utils';
import { CommentParsed } from './parser.model';

export function parser(text: string, originalFilePath: string): CommentParsed {
   let comments: string[] = getAllResults(text, /\/\*\*(([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*)\*\/+/igm, 1);
   comments = comments.map((_) => removeStars(_));
   comments = comments.reduce((prev: string[], curr: string) => [...prev, ...extractBlocks(curr)], []);
   return new CommentParsed(comments, originalFilePath);
}
