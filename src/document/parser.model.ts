export enum TAG_TYPES { DESCRIPTION, EXAMPLE, INPUT, OUTPUT, MODEL, METHOD, INJECTION, PARAM, UNKNOWN }

export interface CommentBlock {
   blockType: TAG_TYPES;
   blockContent: string;
}
