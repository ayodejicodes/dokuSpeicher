import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/sidebar.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarCollapsed!: boolean;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.isSidebarCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sidebarService.isSidebarCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }
}
