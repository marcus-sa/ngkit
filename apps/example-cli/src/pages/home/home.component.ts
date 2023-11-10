import { Component } from '@angular/core';
import { ActivatedRoute, RouterState } from '@angular/router';

@Component({
  selector: 'home',
  standalone: true,
  template: `Hello {{ route.snapshot.data['data'] }}`,
})
export class HomeComponent {
  constructor(protected readonly route: ActivatedRoute) {}
}
