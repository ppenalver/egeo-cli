import { readFileSync } from 'fs';
import * as beautify from 'js-beautify';
import * as _ from 'lodash';

/* tslint:disable */
const commentParser = require('comment-parser');
/* tslint:enable */

import { hasValue, isDefined, log } from '../utils';
import { CommentParserResult, CommentParserTag, ComponentInfo, Parameter } from './document.interfaces';

export function getMetadata(filePath: string): ComponentInfo {
   log(`[READ FILE]: ${filePath}`);
   const fileContent: string = readFileSync(filePath, 'utf-8');
   const comments: CommentParserResult[] = getCommentParsed(fileContent);
   const parsed: ComponentInfo = extractComponentInfo(comments);
   return parsed;
}

function getCommentParsed(fileContent: string): CommentParserResult[] {
   log(`[EXTRACT METADATA]........`);
   const inputRegexp: RegExp = new RegExp(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//igm);
   let result: RegExpExecArray | null = inputRegexp.exec(fileContent);
   let comments: CommentParserResult[] = [];
   while (result !== null) {
      const parserResult: CommentParserResult[] = commentParser(result[0]);
      if (parserResult && parserResult.length > 0) {
         comments = [...comments, ...remapLines(fileContent, parserResult, result.index)];
      }
      result = inputRegexp.exec(fileContent);
   }
   return comments;
}

function remapLines(originalStr: string, results: CommentParserResult[], indexRegexp: number): CommentParserResult[] {
   const remapedStartLine: number = (originalStr.substring(0, indexRegexp).match(/\n/g) || []).length + 1;
   const newResult: CommentParserResult[] = _.cloneDeep(results);
   newResult.forEach((result) => {
      result.line = remapedStartLine + result.line;
      result.tags.forEach((tag) => {
         tag.line = tag.line + remapedStartLine;
      });
   });
   return newResult;
}

function extractComponentInfo(comments: CommentParserResult[]): ComponentInfo {
   // Init component info
   let compInfo: ComponentInfo = {
      description: '',
      example: '',
      inputs: [],
      outputs: [],
      title: ''
   };
   comments.forEach((comment: CommentParserResult) => {
      if (comment.tags) {
         comment.tags.forEach((tag: CommentParserTag) => {
            compInfo = extractInfoFromTag(compInfo, tag);
         });
      }
   });
   return compInfo;
}

function extractInfoFromTag(original: ComponentInfo, tag: CommentParserTag): ComponentInfo {
   log(`[PARSE METADATA]........`);
   const componentInfo: ComponentInfo = _.cloneDeep(original);
   if (tag.tag) {
      const normalizedTag: string = tag.tag.toLowerCase();
      switch (normalizedTag) {
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
            log(`Option not recognized: ${tag.tag} in line: ${tag.line}, source: "${tag.source}"`, 'Warn');
            break;
      }
   }
   return componentInfo;
}

function getParamInfo(tag: CommentParserTag): Parameter {
   return {
      default: hasValue(tag.type) ? tag.default : '',
      description: hasValue(tag.description) ? tag.description : '',
      name: hasValue(tag.name) ? tag.name : '',
      optional: tag.optional,
      type: hasValue(tag.type) ? tag.type : ''
   };
}
