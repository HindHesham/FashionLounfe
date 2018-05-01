import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-filter-popover',
  templateUrl: 'filter-popover.html',
})
export class FilterPopoverPage {
  param:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
