import {
   buildDocExamples,
   buildDocGeneral,
   buildDocModelCode,
   buildDocParam,
   DocExample,
   DocGeneral,
   DocModel,
   DocParam,
   extractTag
} from '../code-parser';

export enum TAG_TYPES { DESCRIPTION, EXAMPLE, INPUT, OUTPUT, MODEL, LINK, UNKNOWN }

export class CommentParsed {
   public globalInfo: DocGeneral;
   public inputs: DocParam[] = [];
   public outputs: DocParam[] = [];
   public examples: DocExample[] = [];
   public models: DocModel[] = [];

   constructor(comments: string[], originalFilePath: string) {
      this.build(comments, originalFilePath);
   }

   private build(comments: string[], originalFilePath: string): void {
      comments.forEach((comment) => {
         const tag: TAG_TYPES = extractTag(comment);
         switch (tag) {
            case TAG_TYPES.INPUT:
               this.inputs.push(buildDocParam(comment));
               break;
            case TAG_TYPES.OUTPUT:
               this.outputs.push(buildDocParam(comment));
               break;
            case TAG_TYPES.DESCRIPTION:
               this.globalInfo = buildDocGeneral(comment);
               break;
            case TAG_TYPES.MODEL:
               this.models = buildDocModelCode(comment, originalFilePath);
               break;
            case TAG_TYPES.EXAMPLE:
               this.examples = buildDocExamples(comment);
               break;
         }
      });
   }
}
