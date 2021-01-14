import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { url_format } from "./models";

@Injectable()
export class CreateService {

    url='http://localhost:3000';

    constructor(private http: HttpClient){}

    createShortUrl(urlInfo: url_format):Promise<any>{
        //console.log('svc', loginInfo)
        return this.http.post<url_format>('/url', urlInfo).toPromise()
    }

}