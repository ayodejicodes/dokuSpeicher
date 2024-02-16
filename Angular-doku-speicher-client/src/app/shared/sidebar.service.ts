import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(window.innerWidth > 768);

  isSidebarCollapsed$ = this.isSidebarCollapsedSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.isSidebarCollapsedSubject.next(window.innerWidth > 768);
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
  }
}
