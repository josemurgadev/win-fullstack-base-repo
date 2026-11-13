import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  host: { class: 'flex shrink-0' },
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {}
