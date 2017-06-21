import { readFileSync } from 'fs';
import * as _ from 'lodash';
import * as beautify from 'js-beautify';
const commentParser = require('comment-parser');

import { hasValue, isDefined } from './utils';
import { CommentParserResult, CommentParserTag, Parameter, ComponentInfo } from './document.interfaces';

export function getMetadata(filePath: string): ComponentInfo {
   console.log(`[READ FILE]: ${filePath}`);
   let fileContent = readFileSync(filePath, 'utf-8');
   let comments: CommentParserResult[] = getCommentParsed(fileContent);
   let parsed: ComponentInfo = extractComponentInfo(comments);
   return parsed;
}

function getCommentParsed(fileContent: string): CommentParserResult[] {
   console.log(`[EXTRACT METADATA]........`);
   let inputRegexp = new RegExp(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//, 'igm');
   let result: RegExpExecArray | null
   let comments: CommentParserResult[] = [];
   while (result = inputRegexp.exec(fileContent)) {
      let parserResult: CommentParserResult[] = commentParser(result[0]);
      if (parserResult && parserResult.length > 0) {
         comments = [...comments, ...remapLines(fileContent, parserResult, result.index)];
      }
   }
   return comments;
}

function remapLines(originalStr: string, results: CommentParserResult[], indexRegexp: number): CommentParserResult[] {
   let remapedStartLine: number = (originalStr.substring(0, indexRegexp).match(/\n/g) || []).length + 1;
   let newResult: CommentParserResult[] = _.cloneDeep(results);
   newResult.forEach(result => {
      result.line = remapedStartLine + result.line;
      result.tags.forEach(tag => {
         tag.line = tag.line + remapedStartLine;
      });
   })
   return newResult;
}

function extractComponentInfo(comments: CommentParserResult[]): ComponentInfo {
   // Init component info
   let compInfo: ComponentInfo = {
      title: '',
      description: '',
      example: '',
      inputs: [],
      outputs: []
   };
   comments.forEach((comment: CommentParserResult) => {
      if (comment.tags) {
         comment.tags.forEach((tag: CommentParserTag) => {
            compInfo = extractInfoFromTag(compInfo, tag);
         })
      }
   })
   return compInfo;
}

function extractInfoFromTag(original: ComponentInfo, tag: CommentParserTag): ComponentInfo {
   console.log(`[PARSE METADATA]........`);
   let componentInfo = _.cloneDeep(original);
   if (tag.tag) {
      let normalizedTag: string = tag.tag.toLowerCase();
      switch (tag.tag) {
         case 'description' || 'desc':
            componentInfo.description = hasValue(tag.description) ? tag.description : '';
            componentInfo.title = hasValue(tag.name) ? tag.name : '';
            break;
         case 'example':
            componentInfo.example = hasValue(tag.description) ? beautify.html(tag.description) : '';
            break;
         case 'input':
            componentInfo.inputs.push(getParamInfo(tag));
            break;
         case 'output':
            componentInfo.outputs.push(getParamInfo(tag));
            break;
         default:
            console.log('\x1b[41m', `Option not recognized: ${tag.tag} in line: ${tag.line}, source: "${tag.source}"`, '\x1b[0m');
            break;
      }
   }
   return componentInfo;
}

function getParamInfo(tag: CommentParserTag): Parameter {
   return {
      name: hasValue(tag.name) ? tag.name : '',
      type: hasValue(tag.type) ? tag.type : '',
      optional: tag.optional,
      default: hasValue(tag.type) ? tag.default : '',
      description: hasValue(tag.description) ? tag.description : ''
   };
}
