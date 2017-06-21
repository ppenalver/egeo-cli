export interface Parameter {
   name: string;
   type: string;
   default: string;
   optional: boolean;
   description: string;
}

export interface ComponentInfo {
   title: string;
   description: string;
   example: string;
   inputs: Parameter[];
   outputs: Parameter[];
}

export interface CommentParserResult {
   description: string;
   line: number;
   source: string;
   tags: CommentParserTag[];
}

export interface CommentParserTag {
   default: string;
   description: string;
   line: number;
   name: string;
   optional: boolean;
   source: string;
   tag: string;
   type: string;
}
