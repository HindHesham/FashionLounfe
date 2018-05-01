import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user.service';

@Component({
  selector: 'page-followings',
  templateUrl: 'followings.html',
})
export class FollowingsPage {

  constructor(private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userProvider.getProfileDetails();
  }

  listUserFollowing() {
    return this.userProvider.getUserFollowers();
  }

}
