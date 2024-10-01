import { Injectable } from '@angular/core';
import * as jsonData from '../../../assets/data/references.json';
import { Reference } from '../models/reference';

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  private data: Reference[] = (jsonData as unknown as { default: Reference[] }).default;

  constructor() {}

  public getReferences(): Reference[] {
    return this.data;
  }
}