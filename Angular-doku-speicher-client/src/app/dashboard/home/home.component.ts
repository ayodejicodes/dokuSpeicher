import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';
import { FilterTablePipe } from 'src/app/shared/pipe/filter.pipe';
import { saveAs } from 'file-saver';
declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FilterTablePipe]
})
export class HomeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  page:number=1;
  p: any;
  imageFilePreview: boolean = false;
  fileUploaded: boolean = false;
  selectedFile: any = {}; 
  graphData: any;
  filesArray: any;
  dashboardStatsCalculation: any;
  isShowPreview: boolean = false;
  isShowDownloadButton: boolean = false;
  searchedArray: any;
  filesRequest: any;
  query: any;
  expiryDateCount: any;
  documentShareLink: any;
  editFileName:any;

  constructor(private apiCallingService: ApiCallingService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService){  
      this.setDataObject();
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.filesArray = [];
    this.filesRequest = [];
    this.searchedArray = [];
    this.closePreview();
    this.ngxService.start();
    this.apiCallingService.GetData('api', 'document').subscribe((response: any) => {
      if (response.isSuccess) {
        this.filesArray = response.data;
        this.searchedArray = response.data;
        this.calculateStats();
      } else {
        this.toastr.error(response.message, 'Error!');
      }
      this.ngxService.stop();
      },
      (error: any) => {
        this.ngxService.stop();
        if(error.status == 401){
          this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
        }
        this.toastr.error('Error occured while processing your request','Error!');
      }
    );
  }

  getDocumentbyId(documentId: any): void {
    this.expiryDateCount = '';
    this.documentShareLink = '';
    this.apiCallingService.GetData('api', 'document/'+documentId).subscribe((response: any) => {
      if (response.isSuccess) {
        this.selectedFile = response.data;
        this.isShowPreview = true;
        this.areAnyCheckboxesSelected();
      } else {
        this.toastr.error(response.message, 'Error!');
      }
      this.ngxService.stop();
      },
      (error: any) => {
        this.ngxService.stop();
        if(error.status == 401){
          this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
        }
        this.toastr.error('Error occured while processing your request','Error!');
      }
    );
  }

  downloadDocument(): void {
    var documentIds ='';
    (this.filesArray.filter((x: any)=>x.checked == true)).forEach((element: any) => {
      documentIds +='documentIds='+element.documentId+'&'
    });
    documentIds = documentIds.substring(0, documentIds.length - 1);
    this.apiCallingService.downloadFiles('api', 'document/download?'+documentIds).subscribe((response: any) => {
      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      var fileName = '';
      this.selectedFile.downloadCount += 1;
      if(!response.type.includes('zip')) {
        fileName = this.selectedFile.name.split("-").pop() as string; 
      } else {
        fileName = 'download.zip';
      }
      
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
  
      window.URL.revokeObjectURL(downloadUrl);
      link.remove();
      this.ngxService.stop();

      
      },
      (error: any) => {
        this.ngxService.stop();
        if(error.status == 401){
          this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
        }
        this.toastr.error('Error occured while processing your request','Error!');
      }
    );
  }

  deleteDocument(): void {
    this.apiCallingService.DeleteData('api', 'document/delete/'+this.selectedFile.documentId).subscribe((response: any) => {
      if (response.isSuccess) {
        this.getDocuments();
      } else {
        this.toastr.error(response.message, 'Error!');
      }
      this.ngxService.stop();
      },
      (error: any) => {
        this.ngxService.stop();
        if(error.status == 401){
          this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
        }
        this.toastr.error('Error occured while processing your request','Error!');
      }
    );
  }

  getDocumentShareLink(): void {
    if(this.expiryDateCount > 0) {
      var date = new Date();
      date.setDate(date.getDate() + Number(this.expiryDateCount));    
      this.apiCallingService.PostData('api', 'documentShareLink/create/'+this.selectedFile.documentId,{
        "expiryDateTime": date.toISOString()
      }).subscribe((response: any) => {
        if (response.isSuccess) {
          this.documentShareLink = response.data.generatedLink
        } else {
          this.toastr.error(response.message, 'Error!');
        }
        this.ngxService.stop();
        },
        (error: any) => {
          this.ngxService.stop();
          if(error.status == 401){
            this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
          }
          this.toastr.error('Error occured while processing your request','Error!');
        }
      );
    }
    
  }

  copyToClipBoard(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.documentShareLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  filterFiles(type: any): void {
    if(type!=='All') {
      this.filesArray = this.searchedArray.filter((x: any)=>x.type === type);
    } else {
      this.filesArray = this.searchedArray;
    } 
  }

  uploadDocuments(): void {
    const formData = new FormData();
    this.filesRequest.forEach(function (obj: any, index: any) {
      formData.append(`files`, obj);
    });
    this.apiCallingService.PostData('api', 'document/upload',formData).subscribe((response: any) => {
      if (response.isSuccess) {
        this.getDocuments();
        this.toastr.success('Files uploaded successfully', 'Success');
        this.cancelUploading();
      } else {
        this.toastr.error(response.message, 'Error!');
      }
      this.ngxService.stop();
      },
      (error: any) => {
        this.ngxService.stop();
        if(error.status == 401){
          this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
        }
        this.toastr.error('Error occured while processing your request','Error!');
      }
    );
    
  }

  setDataObject(): void {
    this.dashboardStatsCalculation = {};
    this.dashboardStatsCalculation.pdfFileCount =  0;
    this.dashboardStatsCalculation.pdfFileSize =  0;

    this.dashboardStatsCalculation.excelFileCount =  0;
    this.dashboardStatsCalculation.excelFileSize =  0;

    this.dashboardStatsCalculation.wordFileCount =  0;
    this.dashboardStatsCalculation.wordFileSize =  0;

    this.dashboardStatsCalculation.txtFileCount =  0;
    this.dashboardStatsCalculation.txtFileSize =  0;

    this.dashboardStatsCalculation.imagesFileCount =  0;
    this.dashboardStatsCalculation.imagesFileSize =  0;

    this.dashboardStatsCalculation.totalFileSizes =  0;
  }

  calculateStats(): void {
    this.setDataObject();
    this.filesArray.forEach((element: any) => {
      if(element.type === 'pdf'){
        this.dashboardStatsCalculation.pdfFileCount =  this.dashboardStatsCalculation.pdfFileCount + 1;
        this.dashboardStatsCalculation.pdfFileSize =  this.dashboardStatsCalculation.pdfFileSize + element.fileSize;
      }

      else if(element.type === 'xlsx'){
        this.dashboardStatsCalculation.excelFileCount =  this.dashboardStatsCalculation.excelFileCount + 1;
        this.dashboardStatsCalculation.excelFileSize =  this.dashboardStatsCalculation.excelFileSize + element.fileSize;
      }

      else if(element.type === 'docx'){
        this.dashboardStatsCalculation.wordFileCount =  this.dashboardStatsCalculation.wordFileCount + 1;
        this.dashboardStatsCalculation.wordFileSize =  this.dashboardStatsCalculation.wordFileSize + element.fileSize;
      }

      else if(element.type === 'txt'){
        this.dashboardStatsCalculation.txtFileCount =  this.dashboardStatsCalculation.txtFileCount + 1;
        this.dashboardStatsCalculation.txtFileSize =  this.dashboardStatsCalculation.txtFileSize + element.fileSize;
      }

      else {
        this.dashboardStatsCalculation.imagesFileCount =  this.dashboardStatsCalculation.imagesFileCount + 1;
        this.dashboardStatsCalculation.imagesFileSize =  this.dashboardStatsCalculation.imagesFileSize + element.fileSize;
      }
      this.dashboardStatsCalculation.totalFileSizes = this.dashboardStatsCalculation.totalFileSizes + element.fileSize;
    });
    this.graphData = [
      { name: 'pdf', y: this.dashboardStatsCalculation.pdfFileSize },
      { name: 'xlsx', y: this.dashboardStatsCalculation.excelFileSize },
      { name: 'docx', y: this.dashboardStatsCalculation.wordFileSize },
      { name: 'txt', y: this.dashboardStatsCalculation.txtFileSize },
      { name: 'images', y: this.dashboardStatsCalculation.imagesFileSize }
    ];

    this.generatePieGraph();
  }

  generatePieGraph() {
    $('#filesDataChart')?.highcharts({
      chart: {
          type: 'pie',
          backgroundColor: 'transparent'
      },
      title: {
          text: null,
          align: 'left'
      },
      subtitle: {
        useHTML: true,
        text: this.formatBytes(this.dashboardStatsCalculation.totalFileSizes),
        floating: true,
        verticalAlign: 'middle',
        y: -10
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          borderRadius: 0,
          borderWidth: 7,
          borderColor: '#f0f2fe',
          innerSize: "70%",
          dataLabels: {
              enabled: false,
          },
          showInLegend: true,
        }
      },
      colors: ['rgba(245, 57, 95, 0.85)', 'rgb(0, 196, 159)', 'rgb(255, 187, 40)', 'rgb(0, 136, 254)', 'rgb(136, 132, 216)'],
      series: [{
          name: 'Percentage',
          data: this.graphData,
          size: '70%'
      }]
    })
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  convertDate(date: any) {
    return new Date(date)
  }

  uploadFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      for(var i = 0; i< event.target.files.length;i++) {
        const extension = event.target.files[i].name.toLowerCase().substring(event.target.files[i].name.lastIndexOf('.'));
        this.filesRequest.push(event.target.files[i]);
        if (extension === '.jpg' || extension === '.jpeg' || extension === '.png' 
        || extension === '.xlsx' || extension === '.docx' || extension === '.pdf' || extension === '.txt'
        || extension === '.docx') {
          this.fileUploaded = true;
          this.imageFilePreview = true;
        } else {
          this.imageFilePreview = false;
          // Unsupported file type
          this.fileInput.nativeElement.value = "";
          this.fileUploaded = false;
          this.toastr.error(extension+' is invalid','Error!');
          return;
        }
      }
    }
  }

  cancelUploading(){
    this.fileInput.nativeElement.value = "";
    this.imageFilePreview = false;
    this.fileUploaded = false;
  }
  
  toggleSelectedFile() {
    setTimeout(() => {
      this.generatePieGraph();  
    }, 100);
  }

  areAnyCheckboxesSelected(): void {
    this.isShowDownloadButton = false;
    this.filesArray.forEach((element: any) => {
      if(element.checked) {
        this.isShowDownloadButton = true
      }
    });
  }

  toggleCheckbox(event: any, documentId: any): void {
   if(event?.target.checked) {
    this.getDocumentbyId(documentId);
   } else {
    this.selectedFile = {};
    this.toggleSelectedFile();
    this.areAnyCheckboxesSelected();
    this.isShowPreview = false;
   }
  }

  openPreview(documentId: any, index: any): void {
    this.filesArray[index].checked = true;
    this.getDocumentbyId(documentId);
  }

  closePreview(): void {
    this.selectedFile = {};
    this.toggleSelectedFile();
    this.areAnyCheckboxesSelected();
    this.isShowPreview = false;
  }

  openEditModal(): void {
    this.editFileName = this.selectedFile.name;
    $("#editModal").modal('show');
  }

  closeEditModal(): void {
    $("#editModal").modal('hide');
  }

  updateDocument(): void {
    if(this.editFileName !== '') {
      this.ngxService.start();
      this.apiCallingService.PutData('api', 'document/edit/'+this.selectedFile.documentId,{
        "name": this.editFileName
      }).subscribe((response: any) => {
        if (response.isSuccess) {
          this.closeEditModal();
          this.getDocuments();
        } else {
          this.toastr.error(response.message, 'Error!');
        }
        this.ngxService.stop();
        },
        (error: any) => {
          this.ngxService.stop();
          if(error.status == 401){
            this.toastr.warning('Your session has expired. Please relogin', 'Session Expired!');
          }
          this.toastr.error('Error occured while processing your request','Error!');
        }
      );
    }
    
  }
}
