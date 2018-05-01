import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user.service';
import { Storage } from '@ionic/storage';
import { PostDetailsPage } from '../post-details/post-details';
import { FollowingsPage } from '../followings/followings';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  allNotifications:any = [];

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public storage: Storage,
     public userProvider: UserProvider, 
     public loadingCtrl: LoadingController) {
    this.getAllNotifications();
  }

  getAllNotifications() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.storage.get('token').then((token)=> {
        this.userProvider.getAllNotification( token )
        .subscribe(data => {
          this.allNotifications = data.data;
          console.log('notification: ', this.allNotifications);
          loader.dismiss();
        },
        (err) => {
          loader.dismiss();
        })
        
    })
    })
  }

  ListNotifications() {
    return this.allNotifications;
  }

  deleteNotification(e,id) {
    e.stopPropagation();
    this.userProvider.deleteNotification(id)
    .subscribe(data => {
      console.log('data: ',data);
      this.getAllNotifications();
    },
    (err) => {
      console.log('error: ',err);
    })
  }

  gotoNotificationDetails(e, title, post_id, user_name) {
    e.stopPropagation();
    console.log('title: ',title, 'name: ', user_name);
    if(title == 'new favourite' || title == 'new like' || title == 'new comment') {
      this.navCtrl.push(PostDetailsPage, {"post_id":post_id, "user_name": user_name});
    } else if(title == 'new follow') {
      this.navCtrl.push(FollowingsPage);
    }
  }

}
