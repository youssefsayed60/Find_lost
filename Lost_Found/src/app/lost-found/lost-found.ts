import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../core/models/item';

@Component({
  selector: 'app-lost-found',
  standalone: true, // Recommended for modern Angular
  imports: [CommonModule, FormsModule],
  templateUrl: './lost-found.html',
  styleUrl: './lost-found.css',
})
export class LostFound implements OnInit {
  // We initialize as an empty array typed to the Interface
  items: Item[] = [];
  filteredItems: Item[] = [];
  
  activeFilter: string = 'all';
  showModal: boolean = false;
  showBookingModal: boolean = false;
  selectedBookingItem: Item | null = null;
  
  bookingForm = {
    bookerName: '',
    pickupDate: ''
  };

  formData = {
    itemName: '',
    description: '',
    location: '',
    finderName: ''
  };

  imagePreview: string | null = null;

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  // Logic to handle filtering based on the Interface properties
  filterItems(filter: string) {
    this.activeFilter = filter;
    switch (filter) {
      case 'available':
        this.filteredItems = this.items.filter(item => !item.claimed);
        break;
      case 'booked':
        this.filteredItems = this.items.filter(item => item.claimed);
        break;
      default:
        this.filteredItems = [...this.items];
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    
    // Constructing the object strictly following the Item Interface
    const newItem: Item = {
      name: this.formData.itemName,
      description: this.formData.description,
      location: this.formData.location,
      finderName: this.formData.finderName,
      photo: this.imagePreview || '',
      dateFound: new Date(),
      claimed: false
    };

    this.items.unshift(newItem);
    this.saveToLocalStorage();
    this.filterItems(this.activeFilter);
    this.closeModal();
    this.resetForm();
  }

  // --- Persistence & Helpers ---

  saveToLocalStorage() {
    localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('lostFoundItems');
    if (saved) {
      // Parsing the data ensures it conforms to our Item[] interface
      this.items = JSON.parse(saved);
    } 
    // else {
    //   this.items = []; // Start fresh if no local data exists
    // }
    this.filteredItems = [...this.items];
  }

  resetForm() {
    this.formData = { itemName: '', description: '', location: '', finderName: '' };
    this.imagePreview = null;
  }

  // Getters for UI counters
  get allCount(): number { return this.items.length; }
  get availableCount(): number { return this.items.filter(item => !item.claimed).length; }
  get bookedCount(): number { return this.items.filter(item => item.claimed).length; }

  // Modal Controls
  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }
  openBookingModal(item: Item) { this.selectedBookingItem = item; this.showBookingModal = true; }
  closeBookingModal() { this.showBookingModal = false; this.selectedBookingItem = null; }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(input.files[0]);
    }
  }
}