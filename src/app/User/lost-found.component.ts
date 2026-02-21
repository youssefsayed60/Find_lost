import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LostItem {
  id: string;
  name: string;
  description: string;
  location: string;
  finderName: string;
  imageUrl?: string;
  dateFound: Date;
  isBooked: boolean;
  bookedBy?: string;
  bookedDate?: Date;
}

@Component({
  selector: 'app-lost-found',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lost-found.component.html',
  styleUrls: ['./lost-found.component.css']
})
export class LostFoundComponent implements OnInit {
  items: LostItem[] = [
    {
      id: '1',
      name: 'Blue Water Bottle',
      description: 'A blue plastic water bottle with a white cap. Found near the library entrance.',
      location: 'Library 2nd Floor',
      finderName: 'John Smith',
      imageUrl: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Water+Bottle',
      dateFound: new Date('2024-01-15'),
      isBooked: false
    },
    {
      id: '2',
      name: 'Black Backpack',
      description: 'Black backpack with multiple compartments. Contains some books and a laptop charger.',
      location: 'Cafeteria',
      finderName: 'Sarah Johnson',
      imageUrl: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Backpack',
      dateFound: new Date('2024-01-14'),
      isBooked: true,
      bookedBy: 'Mike Wilson',
      bookedDate: new Date('2024-01-16')
    },
    {
      id: '3',
      name: 'Silver Watch',
      description: 'Silver analog watch with a leather strap. Brand appears to be Casio.',
      location: 'Gym',
      finderName: 'Emily Davis',
      imageUrl: 'https://via.placeholder.com/300x200/C0C0C0/000000?text=Watch',
      dateFound: new Date('2024-01-13'),
      isBooked: false
    }
  ];

  filteredItems: LostItem[] = [...this.items];
  activeFilter: string = 'all';
  showModal: boolean = false;
  showBookingModal: boolean = false;
  selectedBookingItem: LostItem | null = null;
  bookingForm = {
    bookerName: '',
    pickupDate: ''
  };
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  formData = {
    itemName: '',
    description: '',
    location: '',
    finderName: '',
    imageUrl: ''
  };

  // Computed properties for template
  get allCount(): number {
    return this.items.length;
  }

  get availableCount(): number {
    return this.items.filter(item => !item.isBooked).length;
  }

  get bookedCount(): number {
    return this.items.filter(item => item.isBooked).length;
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  filterItems(filter: string) {
    this.activeFilter = filter;
    
    switch (filter) {
      case 'available':
        this.filteredItems = this.items.filter(item => !item.isBooked);
        break;
      case 'booked':
        this.filteredItems = this.items.filter(item => item.isBooked);
        break;
      default:
        this.filteredItems = [...this.items];
    }
    
    this.updateActiveTab();
  }

  updateActiveTab() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-filter') === this.activeFilter) {
        tab.classList.add('active');
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      itemName: '',
      description: '',
      location: '',
      finderName: '',
      imageUrl: ''
    };
    this.selectedImageFile = null;
    this.imagePreview = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreview = null;
  }

  openBookingModal(item: LostItem): void {
    this.selectedBookingItem = item;
    this.bookingForm = {
      bookerName: '',
      pickupDate: ''
    };
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedBookingItem = null;
    this.bookingForm = {
      bookerName: '',
      pickupDate: ''
    };
  }

  submitBooking(event: Event): void {
    event.preventDefault();
    
    if (this.selectedBookingItem) {
      this.selectedBookingItem.isBooked = true;
      this.selectedBookingItem.bookedBy = this.bookingForm.bookerName;
      this.selectedBookingItem.bookedDate = new Date(this.bookingForm.pickupDate);
      
      // Save to localStorage for persistence
      this.saveToLocalStorage();
      
      this.closeBookingModal();
      this.filterItems(this.activeFilter);
    }
  }

  deleteItem(itemId: string): void {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.filterItems(this.activeFilter);
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
  }

  loadFromLocalStorage(): void {
    const saved = localStorage.getItem('lostFoundItems');
    if (saved) {
      this.items = JSON.parse(saved);
      this.filteredItems = [...this.items];
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    
    const newItem: LostItem = {
      id: (this.items.length + 1).toString(),
      name: this.formData.itemName,
      description: this.formData.description,
      location: this.formData.location,
      finderName: this.formData.finderName,
      imageUrl: this.imagePreview || 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=No+Image',
      dateFound: new Date(),
      isBooked: false
    };

    this.items.unshift(newItem);
    this.filterItems(this.activeFilter);
    this.saveToLocalStorage();
    this.closeModal();
  }

  bookItem(itemId: string) {
    const item = this.items.find(i => i.id === itemId);
    if (item && !item.isBooked) {
      item.isBooked = true;
      item.bookedBy = 'Current User'; // In a real app, this would be the logged-in user
      item.bookedDate = new Date();
      this.filterItems(this.activeFilter);
    }
  }

  getEmptyMessage(): string {
    switch (this.activeFilter) {
      case 'available':
        return 'No available items at the moment.';
      case 'booked':
        return 'No items have been booked yet.';
      default:
        return 'No items have been posted yet.';
    }
  }
}
