import { DocParam } from './doc-param';
import { getAllResults, getTag, normalizeText } from './parser-utils';
import { CommentBlock, TAG_TYPES } from './parser.model';

interface ParserBlock {
   blockName: string;
   block: string;
   rest: string;
}

export function parser(text: string): DocParam[] {
   let comments: string[] = getAllResults(text, /\/\*\*(([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*)\*\/+/igm, 1);
   comments = comments.map((_) => removeStars(_));
   const commentBlocks: CommentBlock[] = comments.reduce((prev: CommentBlock[], curr: string) => [...prev, ...extractBlocks(curr)], []);
   return commentBlocks.map((_) => new DocParam(_));
}

function removeStars(text: string): string {
   return text.split('*').map((_) => _.trim()).join('\n');
}

function splitByTag(text: string): string[] {
   return text.trim().split('@').
      reduce((prev: string[], curr: string) => validParams(curr) ? [...prev, `@${curr}`] : prev, []);
}

function validParams(param: string): boolean {
   if (param && param.trim().length > 0) {
      switch (param.toLowerCase()) {
         case 'description':
         case 'input':
         case 'output':
         case 'model':
         case 'example':
         case 'link':
            return true;
         default:
            return false;
      }
   }
   return false;
}

function extractBlocks(text: string): CommentBlock[] {
   const result: CommentBlock[] = [];
   let parseBlock: ParserBlock = extractBlock(text);
   while (parseBlock.blockName !== '') {
      const tag: TAG_TYPES = getTag(normalizeText(parseBlock.blockName));
      if (tag !== TAG_TYPES.UNKNOWN) {
         result.push({ blockType: tag, blockContent: parseBlock.block });
      } else {
         result[result.length - 1].blockContent += `@${parseBlock.blockName} ${parseBlock.block}`;
      }
      parseBlock = extractBlock(parseBlock.rest);
   }
   return result;
}

function extractBlock(text: string): ParserBlock {
   const reg: RegExp = /(@(.*?)\s((.|[\r\n])+?))(@|$)/;
   const result: RegExpMatchArray | null = reg.exec(text);
   if (result !== null) {
      return { blockName: result[2], block: result[3], rest: text.replace(result[1], '') };
   }
   return { blockName: '', block: '', rest: text };
}
