import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";

@Injectable()
export class GetService {
	constructor(private http: HttpClient) { }

	async getUrls() {
		return await this.http.get<string[]>('/urls').toPromise()
	}
}