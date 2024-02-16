import { Component, Input, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() dataCollapsedSidebar!: boolean;

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.sidebarService.isSidebarCollapsed$.subscribe(isCollapsed => {
      this.dataCollapsedSidebar = isCollapsed;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
