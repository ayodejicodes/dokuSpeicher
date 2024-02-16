import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InterconnectedService {
    private _updateProfilePicture = new Subject<any>();
    $updateProfilePicture = this._updateProfilePicture.asObservable();

    private _updateNotifications = new Subject<any>();
    $updateNotifications = this._updateNotifications.asObservable();

    constructor() { }

    updateProfilePicture(userInfo: any): void {
        this._updateProfilePicture.next(userInfo);
    }

    updateNotifications(status: boolean): void {
        this._updateNotifications.next(status);
    }
}
