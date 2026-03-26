import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../core/services/itemService';
import { Item } from '../../core/models/item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-item',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-item.html',
  styleUrl: './post-item.css',
})
export class PostItem {
   itemForm: FormGroup;
  selectedPhoto: string | undefined;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      finderName: ['', Validators.required],
      dateFound: ['', Validators.required],
      photo: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.itemForm.valid) {
      const newItem: Item = {
        ...this.itemForm.value,
        photo: this.selectedPhoto,
        claimed: false
      };

      this.itemService.addItem(newItem);
      this.router.navigate(['/']); 
    }
  }

}
