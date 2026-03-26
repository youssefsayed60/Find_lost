import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items:Item[]=[    
  ];
  private items$ = new BehaviorSubject<Item[]>([]);
  constructor(){}
  getItems(){
    return this.items$.asObservable();

  }
  addItem(item: Item){
    this.items.push(item);
    this.items$.next(this.items);
  }
  claimItem(index: number) {
    if(this.items[index]) {
     this.items[index].claimed=true;
      this.items$.next(this.items);
    }
  }
  
}
