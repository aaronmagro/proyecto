import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BooksGalleryComponent } from '../../shared/components/books-gallery/books-gallery.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, BooksGalleryComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  constructor() {}
}
