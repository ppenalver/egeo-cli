import { getMetadata } from './get-metadata';
import { CommentParsed } from './parser';
import { saveMetadata } from './set-metadata';

export function generateDoc(componentPath: string): void {
   const metadata: CommentParsed = getMetadata(componentPath);
   saveMetadata(componentPath, metadata);
}
