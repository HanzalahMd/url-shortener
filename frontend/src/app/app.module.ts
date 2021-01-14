import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { CreateService } from './create.service';
import { GetService } from './get.service';
import { ListsComponent } from './lists/lists.component'

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'lists', component: ListsComponent },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent, LoginComponent, MainComponent, ListsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CreateService, GetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
