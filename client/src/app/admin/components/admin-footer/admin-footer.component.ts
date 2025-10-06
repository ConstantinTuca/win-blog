import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-footer.component.html',
  styleUrl: './admin-footer.component.scss'
})
export class AdminFooterComponent {
  date:any;
  ngOnInit(): void {
    this.date = new Date().getFullYear();
  }
}
