import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import SimpleBar from 'simplebar';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements
OnInit, AfterViewInit {
  activeMenu:string = '';
  menuOpen:string = ''

  constructor( private router : Router) {}
  @ViewChild('simplebar', { static: false }) simplebarRef!: ElementRef;

  ngAfterViewInit() {
    new SimpleBar(this.simplebarRef.nativeElement);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.activeMenu = this.router.url;
    this.menuOpen = this.activeMenu;
  }

  menu:boolean = true;
  subMenu(item:any){
    this.menu = !this.menu;
    this.menuOpen = item;
  }

  goToRoute = (customeRoute: string) => {
    this.activeMenu = customeRoute;
    this.router.navigate([customeRoute]);
  };
}
