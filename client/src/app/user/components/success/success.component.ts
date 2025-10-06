import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscribe-success',
  templateUrl: './success.component.html',
  imports: [
    RouterLink
  ]
})
export class SuccessComponent implements OnInit {
  sessionId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    // Optionally: call backend to confirm subscription status using sessionId
  }
}
