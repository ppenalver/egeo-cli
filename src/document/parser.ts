import { COMMENT_TYPE, DocParam } from './parser.model';

export class CommentParser {

   private parseComment(comment: string): void {
      let params: DocParam = new DocParam();
      params.type = this.getType(this.applyRegexp(comment, ))
   }

   private getType(type: string): COMMENT_TYPE {
      switch (type) {
         case 'description': return COMMENT_TYPE.DESCRIPTION;
         case 'example': return COMMENT_TYPE.EXAMPLE;
         case 'injection': return COMMENT_TYPE.INJECTION;
         case 'input': return COMMENT_TYPE.INPUT;
         case 'method': return COMMENT_TYPE.METHOD;
         case 'model': return COMMENT_TYPE.MODEL;
         case 'output': return COMMENT_TYPE.OUTPUT;
         case 'param': return COMMENT_TYPE.PARAM;
         default: return COMMENT_TYPE.UNKNOWN;
      }
   }

   private getValues(text: string): void {
      const parts: string[] = text.split(' ');
      parts.reduce((finalDocParam, currPart, idx) => {


         return finalDocParam;
      }, new DocParam());
   }



}
