import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { PostProvider } from '../../providers/post.service';

@Component({
  selector: 'page-more-button-popover',
  templateUrl: 'more-button-popover.html',
})
export class MoreButtonPopoverPage {

  post_id: any;
  token: any;
  page_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
    this.post_id = this.navParams.get('post_id');
    this.token = this.navParams.get('token');
    this.page_type = this.navParams.get('page_type');
  }

  deletePost(page) {
    console.log('page type: ',this.page_type);
    if(this.page_type == "all_posts") {
      this.events.publish('allposts:deleted');
    } else if(this.page_type == "post_details") {
      this.events.publish('postdetails:deleted');
    } else if(this.page_type == "profile_post") {
      this.events.publish('profilepost:deleted');
    } else if(this.page_type == 'favourite') {
      this.events.publish('fav:deleted');
    } else if(this.page_type == 'search') {
      this.events.publish('search:deleted');
    }
    this.viewCtrl.dismiss();
  }

}
