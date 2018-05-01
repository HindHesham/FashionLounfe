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
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  pageType: string = "POST";
  
    user_id;
    isFollow;
    isUnfollow;
    public token:any;
    page_number:any = 1;
    rate;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider:UserProvider,public storage: Storage, 
    public postProvider: PostProvider, public popoverCtrl: PopoverController, public events: Events, public loadingCtrl: LoadingController) {
      
      this.token = this.postProvider.getTokenFromStorage();
      this.user_id = navParams.get('user_id');
      this.userProvider.getUserProfileDetails(this.user_id); 
      this.getUserRating();
  }

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

  gotoProfile(){
    this.navCtrl.push(ProfilePage);
    this.userProvider.setProfileUSerId(null);
  }

  getProfileDetails() {
    return this.userProvider.getUserObject();
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.page_number += 1;
        this.userProvider.getNextUserProfileDetails(this.page_number, this.user_id);

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
    let popover = this.popoverCtrl.create(MoreButtonPopoverPage,{page_type: "profile_post"});
    console.log('my event', myEvent);
    popover.present({
      ev: myEvent
    });

  }

  ///////////// followers data /////////////
  listUserFollowers() {
    return this.userProvider.getUserFollowers();
  }

  followUser(follower_id) {
    this.userProvider.followUser(follower_id)
    .subscribe(data => {
      this.userProvider.getUserProfileDetails(this.userProvider.getUserObject().id);
      this.isFollowUser();
    },
    (err) => {
      // alert('Error: '+JSON.stringify(err));
    })
  }

  gotoUserProfile(user_id) {
    this.navCtrl.push(UserProfilePage, {'user_id': user_id});
    this.userProvider.setProfileUSerId(user_id);
  }

  ///////////// followings data /////////////
  listUserFollowing() {
    return this.userProvider.getUserFollowing();
  }

  isFollowUser() {
    this.userProvider.isFollowUser(this.user_id)
    .subscribe(data => {
      console.log('shimaaaaaaaaaaa: ',data);
      this.isFollow = data.follow;
      this.isUnfollow = data.unfollow;
    },
    (err) =>{
      console.log('error: ',err);
    })
  }

  isFollowerUser() {
    return this.isFollow;
  }

  isUnfollowerUser() {
    return this.isUnfollow;
  }

  getUserRating() {
    this.userProvider.getUserRating(this.user_id)
    .subscribe(data => {
      this.rate = data.average;
      console.log('user rating: ', data);
    },
    (err) => {
      console.log('error: ', err);
    })
  }

  saveUserRating(e) {
    console.log('clicked: ', e, this.user_id);
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.userProvider.saveUserRating(this.user_id)
      .subscribe(data => {
        console.log('data: ', data);
        loader.dismiss();
      },
      (err) => {
        console.log('error: ', err);
        loader.dismiss();
      })
    })
  }

}
