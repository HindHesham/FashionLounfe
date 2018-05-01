import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import{ SearchPage } from '../search/search';
import { DownloadManicanPage } from '../download-manican/download-manican';
import { ProfilePage } from '../profile/profile';
import { MoreButtonPopoverPage } from '../more-button-popover/more-button-popover';
import { PostProvider } from '../../providers/post.service';
import { PostDetailsPage } from '../post-details/post-details';
import { UserProvider } from '../../providers/user.service';


@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {

  favouritePosts;
  delete_post_id: any;
  token:any;
  page_number:any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public postProvider:PostProvider, 
    public loadingCtrl: LoadingController, public userProvider: UserProvider, public events: Events){
    this.getAllFavouritePosts();
    this.token = this.postProvider.getTokenFromStorage();

    this.events.subscribe('fav:deleted', (data) => {
      this.unfavouritePostEvent();
    });
  }

  gotoHome(){
    this.navCtrl.push(HomePage);
  }

  gotoSearch(){
    this.navCtrl.push(SearchPage);
  }

  gotoAddPost(){
    this.navCtrl.push(DownloadManicanPage);
  }

  gotoProfile(){
    this.navCtrl.push(ProfilePage);
    this.userProvider.setProfileUSerId(null);
  }

  gotoPostDetails(post_id,user_name) {
    this.navCtrl.push(PostDetailsPage,{"post_id":post_id, "user_name":user_name})
  }

  presentPopoverMore(myEvent, post_id) {
    this.delete_post_id = post_id;
    let popover = this.popoverCtrl.create(MoreButtonPopoverPage, {page_type: "favourite"});
    console.log('my event', myEvent);
    popover.present({
      ev: myEvent
    });

  }

  getAllFavouritePosts() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.getAllFavouritePosts()
      .subscribe(data=> {
        loader.dismiss();
        this.favouritePosts = data.data;
        console.log("data: ",data," favourite object: ",this.favouritePosts);
      },
      (err) => {
        console.log("error: ",err);
        loader.dismiss();
      })
    })
    
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.page_number += 1;
        this.postProvider.getNextPageFavourite(this.page_number)
        .subscribe(data => {
          for (var i = 0; i < data.data.length; i++) {
            this.favouritePosts.push(data.data[i]);
          }
          console.log('data: ', data.data);
        },
        (err) => {
          console.log('error: ',err);
        })

        console.log('End async operation');
        resolve();
      }, 500);
    })
  }

  listFavouritePosts() {
    return this.favouritePosts;
  }

  unfavouritePostEvent() {
    // e.stopPropagation();
    this.postProvider.addPostFavourite(this.delete_post_id)
    .subscribe(data => {
      console.log("data: ",data);
      this.getAllFavouritePosts();
    },
    (err) => {
      console.log("error: ",err);
    })
  }

}
