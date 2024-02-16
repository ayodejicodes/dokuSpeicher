import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiCallingService {
    baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl
    }
    PostData<T>(ControllerName: any, MethodName: any, data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/${ControllerName}/${MethodName}`, data);
    }
    PutData<T>(ControllerName: any, MethodName: any, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${ControllerName}/${MethodName}`, data);
    }
    DeleteData<T>(ControllerName: any, MethodName: any): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${ControllerName}/${MethodName}`);
    }
    GetData<T>(ControllerName: any, MethodName: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${ControllerName}/${MethodName}`);
    }

    downloadFiles<T>(ControllerName: any, MethodName: any): Observable<any> {
        return this.http.get(`${this.baseUrl}/${ControllerName}/${MethodName}`, { responseType: 'blob' })
    }

    
}
