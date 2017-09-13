import { html_beautify, js_beautify } from 'js-beautify';
import {
   defaultTo as _defaultTo,
   escape as _escape,
   isNil as _isNil,
   startsWith as _startsWith
} from 'lodash';

import { TAG_TYPES } from '../parser';

const TAG_REG_EXP: RegExp = /@(\S*?)\s/;
const TYPE_REG_EXP: RegExp = /{(.*?)}/;
const NAME_REG_EXP: RegExp = /\[(.*?(\\\[|\\\])*?)]/;
const ALL_REG_EXP: RegExp = /((.|[\r\n])+)/;
const EXAMPLE_REG_EXP: RegExp = /```((.|[\r\n])+?)```/;

export function isValidTag(tag: string): boolean {
   return getTag(tag) !== TAG_TYPES.UNKNOWN;
}

export function extractText(text: string, reg: RegExp, valueToTake: number): string {
   const result: RegExpMatchArray | null = reg.exec(text);
   return result !== null ? result[valueToTake] : '';
}

export function normalizeText(text: string | null | undefined, removeLineBreak: boolean = false): string {
   text = _defaultTo(text, '').trim();
   if (text.length > 0) {
      if (removeLineBreak) {
         text = text.replace(/(\r\n|\n|\r)+/gm, ' ');
      }
      while (_startsWith(text, '\n')) {
         text = text.substring(1);
      }
      while (_startsWith(text, '\r')) {
         text = text.substring(1);
      }
      while (_startsWith(text, '\t')) {
         text = text.substring(1);
      }
   }
   return text.trim();
}

export function removeEmptyFromList(list: string[]): string[] {
   return list.reduce((finalList: string[], part) => part && normalizeText(part).length > 0 ? [...finalList, normalizeText(part)] : finalList, []);
}

export function extractTag(text: string): TAG_TYPES {
   let internalText: string = '' + text;
   internalText = internalText.replace(EXAMPLE_REG_EXP, '');
   internalText = internalText.replace(TYPE_REG_EXP, '');
   internalText = internalText.replace(NAME_REG_EXP, '');
   return getTag(normalizeText(extractText(internalText, TAG_REG_EXP, 1)));
}

export function extractType(text: string): string {
   let internalText: string = '' + text;
   internalText = internalText.replace(EXAMPLE_REG_EXP, '');
   internalText = internalText.replace(TAG_REG_EXP, '');
   return _escape(normalizeText(extractText(internalText, TYPE_REG_EXP, 1)));
}

export function extractName(text: string): string {
   return getName(extractFullNameBlock(text));
}

export function extractDefaultValue(text: string): string {
   const name: string = extractFullNameBlock(text);
   const parts: string[] = name.split('=');
   return parts.length === 2 ? normalizeText(parts[1]).replace(/\\\[/g, '[').replace(/\\\]/g, ']') : '';
}

export function extractRequired(text: string): boolean {
   const name: string = extractFullNameBlock(text);
   return _startsWith(name, '^');
}

export function extractDescription(text: string): string {
   let internalText: string = '' + text;
   internalText = internalText.replace(EXAMPLE_REG_EXP, '');
   internalText = internalText.replace(TAG_REG_EXP, '');
   internalText = internalText.replace(TYPE_REG_EXP, '');
   internalText = internalText.replace(NAME_REG_EXP, '');
   const a: string = normalizeText(extractText(internalText, ALL_REG_EXP, 1), true);

   return a;
}

export function extractExample(text: string, type: string): string {
   let value: string = normalizeText(extractText(text, EXAMPLE_REG_EXP, 1));
   if (type === 'html') {
      value = html_beautify(value, { wrap_attributes: 'force', wrap_attributes_indent_size: 6 });
   } else if (type === 'ts') {
      value = js_beautify(value);
   }
   return value;
}

function extractFullNameBlock(text: string): string {
   let internalText: string = '' + text;
   internalText = internalText.replace(EXAMPLE_REG_EXP, '');
   internalText = internalText.replace(TAG_REG_EXP, '');
   internalText = internalText.replace(TYPE_REG_EXP, '');
   return normalizeText(extractText(internalText, NAME_REG_EXP, 1));
}

function getName(text: string): string {
   const result: string[] = text.split('=');
   const name: string = !_isNil(result) && result.length >= 1 ? normalizeText(result[0]) : '';
   return _startsWith(name, '^') ? name.substring(1) : name;
}

function getTag(type: string | null | undefined): TAG_TYPES {
   switch (_defaultTo(type, '').toLowerCase()) {
      case 'description': return TAG_TYPES.DESCRIPTION;
      case 'example': return TAG_TYPES.EXAMPLE;
      case 'input': return TAG_TYPES.INPUT;
      case 'output': return TAG_TYPES.OUTPUT;
      case 'model': return TAG_TYPES.MODEL;
      case 'link': return TAG_TYPES.LINK;
      default:
         return TAG_TYPES.UNKNOWN;
   }
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
