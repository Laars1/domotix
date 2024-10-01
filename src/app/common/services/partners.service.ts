import { Injectable } from '@angular/core';
import * as jsonData from '../../../assets/data/partners.json';
import { Partner } from '../models/partner';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  private data: Partner[] = (jsonData as unknown as { default: Partner[] }).default;

  constructor() {}

  public get(): Partner[] {
    return this.data;
  }
}