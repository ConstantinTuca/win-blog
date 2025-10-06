import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { CountUpModule } from 'ngx-countup';
import { AboutComponent } from '../components/about/about.component';


import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../common/authentication/services/login.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    CountUpModule,
    AboutComponent,
    AnalyticsComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user = {name_text: 'User'} as any;
  private _userValue: any;
  constructor(private loginService: LoginService) {
    this._userValue = this.loginService.userValue.pipe().subscribe(u => this.user = u);
    console.log(this.user)
  }


  activeSidebar:boolean = true

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  saleData = [
    {
      title:'Via Website',
      value:'50%'
    },
    {
      title:'Via Team Member',
      value:'12%'
    },
    {
      title:'Via Agents',
      value:'6%'
    },
    {
      title:'Via Social Media',
      value:'15%'
    },
    {
      title:'Via Digital Marketing',
      value:'12%'
    },
    {
      title:'Via Others',
      value:'5%'
    },
  ]

  transection = [
    {
      image:'assets/images/property/1.jpg',
      date:'13th March 2023',
      name:'Mr. Rocky',
      price:'$1245/M',
      type:'Rent',
      status:'Paid'
    },
    {
      image:'assets/images/property/2.jpg',
      date:'5th May 2023',
      name:'Mr. Cristino',
      price:'$12450',
      type:'Sell',
      status:'Unpaid'
    },
    {
      image:'assets/images/property/3.jpg',
      date:'19th June 2023',
      name:'Mr. Jack',
      price:'$12450',
      type:'Sell',
      status:'Paid'
    },
    {
      image:'assets/images/property/4.jpg',
      date:'20th June 2023',
      name:'Ms. Cally',
      price:'$12450',
      type:'Sell',
      status:'Unpaid'
    },
    {
      image:'assets/images/property/5.jpg',
      date:'31st Aug 2023',
      name:'Ms. Cristina',
      price:'$1245/M',
      type:'Rent',
      status:'Unpaid'
    },
  ]

  topProperties = [
    {
      image:'assets/images/property/1.jpg',
      name:'House',
      place:'Baton Rouge, USA',
      value:'11%',
      status:'loss'
    },
    {
      image:'assets/images/property/2.jpg',
      name:'House',
      place:'Baton Rouge, USA',
      value:'20%',
      status:'profit'
    },
    {
      image:'assets/images/property/3.jpg',
      name:'House',
      place:'Baton Rouge, USA',
      value:'24%',
      status:'profit'
    },
    {
      image:'assets/images/property/4.jpg',
      name:'House',
      place:'Baton Rouge, USA',
      value:'21%',
      status:'profit'
    },
    {
      image:'assets/images/property/5.jpg',
      name:'House',
      place:'Baton Rouge, USA',
      value:'45%',
      status:'profit'
    },
  ]

}
