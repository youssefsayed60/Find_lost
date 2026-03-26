import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../core/models/item';
import { ItemService } from '../../core/services/itemService';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  items: Item[] = []; 

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe(data => {
      this.items = data || [];
    });
  }

  get availableCount(): number {
    return this.items.filter(i => !i.claimed).length;
  }

  get claimedCount(): number {
    return this.items.filter(i => i.claimed).length;
  }

  claimItem(item: Item) {
    if (!item.claimed) {
      item.claimed = true;
      this.itemService.claimItem;
    }
  }
}