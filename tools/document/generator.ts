import { ComponentInfo } from './document.interfaces';
import { getMetadata } from './getMetadata';
import { saveMetadata } from './setMetadata';

export function getComponentDoc(folderPath: string): void {
   let metadata: ComponentInfo = getMetadata(folderPath);
   saveMetadata(folderPath, metadata);
}
