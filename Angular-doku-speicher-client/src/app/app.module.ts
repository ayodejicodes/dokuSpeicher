import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthGuard } from './shared/auth.guard';
import { InterceptorService } from './shared/interceptorservice';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      newestOnTop: true,
      progressBar: false,
      progressAnimation: 'increasing',
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      closeButton: false,
      titleClass: 'toast-title',
      toastClass: 'ngx-toastr',
    }),
    NgxUiLoaderModule.forRoot({
      bgsColor: '#0349a0',
      bgsOpacity: 0.5,
      bgsPosition: 'bottom-right',
      bgsSize: 60,
      bgsType: 'ball-scale-multiple',
      blur: 20,
      delay: 0,
      fastFadeOut: true,
      fgsColor: '#0349a0',
      fgsPosition: 'center-center',
      fgsSize: 150,
      fgsType: 'ball-scale-multiple',
      gap: 24,
      logoPosition: 'center-center',
      logoSize: 120,
      logoUrl: '',
      masterLoaderId: 'master',
      overlayBorderRadius: '0',
      overlayColor: 'rgba(40, 40, 40, 0.8)',
      pbColor: '#0349a0',
      pbDirection: 'ltr',
      pbThickness: 8,
      hasProgressBar: true,
      text: 'Processing...',
      textColor: '#FFFFFF',
      textPosition: 'center-center',
      maxTime: -1,
      minTime: 300,
    }),
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxDocViewerModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
