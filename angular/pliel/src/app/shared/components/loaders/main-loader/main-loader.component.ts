import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-loader.component.html',
  styleUrl: './main-loader.component.scss'
})
export class MainLoaderComponent {

  items: any[] = new Array(18);

  constructor() { }

}
