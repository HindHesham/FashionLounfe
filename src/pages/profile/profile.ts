import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, LoadingController } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { FavouritesPage } from '../favourites/favourites';
import { HomePage } from '../home/home';
import { DownloadManicanPage } from '../download-manican/download-manican';
import { SettingsPage } from '../settings/settings';
import{ SearchPage } from '../search/search';
import { AddProfileImgPage } from '../add-profile-img/add-profile-img';
import { UserProvider } from '../../providers/user.service';
import { SaveProfileImgPage } from '../save-profile-img/save-profile-img';
import { PostDetailsPage } from '../post-details/post-details';
import { CommentsPage } from '../comments/comments';
import { PostProvider } from '../../providers/post.service';
import { MoreButtonPopoverPage } from '../more-button-popover/more-button-popover';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';
import { concatAll } from 'rxjs/operator/concatAll';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  pageType: string = "POST";

  token:any;
  delete_post_id:any;
  page_number:any = 1;


  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider:UserProvider,public storage: Storage, 
    public postProvider: PostProvider, public popoverCtrl: PopoverController, public events: Events, public loadingCtrl: LoadingController) {

    this.userProvider.getProfileDetails();

    this.events.subscribe('profilepost:deleted', (data) => {
      this.deletePostEvent();
    });
    this.token = this.postProvider.getTokenFromStorage();
  }

  ///////////// pages navigation/////////////
  gotoSettings(){
    this.navCtrl.push(SettingsPage);
  }

  gotoAddProfileImage(){
    this.navCtrl.push(SaveProfileImgPage);
  }

  gotoHome(){
    this.navCtrl.push(HomePage);
  }

  gotoAddPost(){
    this.navCtrl.push(DownloadManicanPage);
  }

  gotoFavourites(){
    this.navCtrl.push(FavouritesPage);
  }
  gotoSearch(){
    this.navCtrl.push(SearchPage);
  }

  gotoUserProfile(user_id) {
    this.navCtrl.push(UserProfilePage, {'user_id': user_id});
    this.userProvider.setProfileUSerId(user_id);
  }

  ///////////// profile details /////////////
  getProfileDetails() {
    return this.userProvider.getUserObject();
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.page_number += 1;
        this.userProvider.getNextCurrentProfileDetails(this.page_number);

        console.log('End async operation');
        resolve();
      }, 200);
    })
  }

  ///////////// show posts data /////////////
  listUserPosts() {
    return this.userProvider.getUserPosts();
  }

  getUserPhoto() {
    return this.userProvider.getUserObject().photo;
  }

  getUserName() {
    return this.userProvider.getUserObject().name;
  }

  getUserIsBase() {
    return this.userProvider.getUserObject().isBase64;
  }

  PostDetailsPage(post_id){
    this.navCtrl.push(PostDetailsPage, {"post_id":post_id, "user_name": this.getUserName(), "user_token": this.getProfileDetails().token, "current_token":this.token});
  }

  gotoComments(post_id){
    this.navCtrl.push(CommentsPage, {'post_id': post_id});
  }

  addToLiked(e, post_id) {
    console.log("post_id: ",post_id);
    e.stopPropagation();
    this.postProvider.addPostLike(post_id)
    .subscribe(data=>{
      console.log("data: ",data);
      this.userProvider.getUserProfileDetails(this.userProvider.getProfileUserId());
    },
    (err)=> {
      console.log("error: ",err);
    })
  }

  addToFavourite(e, post_id) {
    e.stopPropagation();
    this.postProvider.addPostFavourite(post_id)
    .subscribe(data => {
      console.log("data: ",data);
      this.userProvider.getUserProfileDetails(this.userProvider.getProfileUserId());
    },
    (err) => {
      console.log("error: ",err);
    })
  }

  presentPopoverMore(myEvent, post_id) {
    this.delete_post_id = post_id;
    let popover = this.popoverCtrl.create(MoreButtonPopoverPage,{page_type: "profile_post"});
    console.log('my event', myEvent);
    popover.present({
      ev: myEvent
    });

  }

  deletePostEvent() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.deletePost(this.delete_post_id)
      .subscribe(data =>{
        loader.dismiss();
        console.log('data: ', data);
        if(data.msg == "true") {
          this.userProvider.getProfileDetails();
        } else {
        }  
      },
      (err) => {
        console.log('error: ',err);
        loader.dismiss();
      })
    })
  }

  ///////////// followers data /////////////
  listUserFollowers() {
    return this.userProvider.getUserFollowers();
  }

  followUser(follower_id) {
    this.userProvider.followUser(follower_id)
    .subscribe(data => {
      this.userProvider.getUserProfileDetails(this.userProvider.getUserObject().id);
    },
    (err) => {
      // alert('Error: '+JSON.stringify(err));
    })
  }

  ///////////// followings data /////////////
  listUserFollowing() {
    return this.userProvider.getUserFollowing();
  }
  
  
}

