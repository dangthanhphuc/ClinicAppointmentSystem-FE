import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class DateHandle {
    
    static arrayToDate(dateArray: number[]): Date {
        const [year, month, day, hour, minute, second] = dateArray;
        return new Date(year, month - 1, day, hour, minute, second);
    }
}