import { Component, OnInit } from '@angular/core';
import {GetService} from '../get.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  urls = [];
  hostname = this.router.url;

	constructor(private router: Router, private getSvc: GetService) { }

	ngOnInit(): void {
    this.getSvc.getUrls()
      .then(result => {
        // console.log(result)
        this.urls = result
        console.log(this.router)
      })
      
			.catch(e => console.error('error: ', e))
	}

}