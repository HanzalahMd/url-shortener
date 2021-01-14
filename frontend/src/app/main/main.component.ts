import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { CreateService } from '../create.service'
import { url_format } from '../models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  form: FormGroup
  errorMessage: '';
  hostname = this.router.url;
  url = '';
  slug = '';
  id = '';

	constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private cs: CreateService) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			url: this.fb.control('', Validators.required),
			slug: this.fb.control('')
		  });
	}
	  

	clear() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/same-route']);
    // this.form.patchValue({
		// 	url: '',
		// 	slug: ''
		//   });
	}

	create(){
    console.log('formdata:', this.form)
    this.cs.createShortUrl(this.form.value as url_format)
     .then(results => {
       console.log('UrlInfo: ', results)
       this.url = results.url
       this.slug = results.slug
       this.id = results._id
      //  this.form.patchValue({
      //   	url: '',
      //   	slug: ''
      //     });
      //  this.router.navigate(['main'])
     })
     .catch(e => {
       console.log('error', e.error.message)
       this.errorMessage=e.error.message
     })
  }


}
