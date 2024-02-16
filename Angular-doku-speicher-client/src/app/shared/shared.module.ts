import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterTablePipe } from './pipe/filter.pipe';

@NgModule({
  declarations: [
    SidebarComponent,
    FilterTablePipe
  ],
  imports: [
    CommonModule,
    SharedRoutingModule, 
    NgxPaginationModule, 
    FormsModule,
    
   ],
  exports: [
    SidebarComponent,
    FilterTablePipe
  ],
})
export class SharedModule {}
