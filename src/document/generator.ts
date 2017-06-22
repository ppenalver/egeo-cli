import { ComponentInfo } from './document.interfaces';
import { getMetadata } from './get-metadata';
import { saveMetadata } from './set-metadata';

export function generateDoc(componentPath: string): void {
   const metadata: ComponentInfo = getMetadata(componentPath);
   saveMetadata(componentPath, metadata);
}
