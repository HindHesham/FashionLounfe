import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, Events } from 'ionic-angular';
import { CommentsPage } from '../comments/comments';
import { MoreButtonPopoverPage } from '../more-button-popover/more-button-popover';
import { PostProvider } from '../../providers/post.service';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/user.service';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-post-details',
  templateUrl: 'post-details.html',
})
export class PostDetailsPage {

  post_id;
  user_name;
  user_token;
  current_token;
  postDetails;
  delete_post_id;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public postProvider: PostProvider, 
    public loadingCtrl: LoadingController, public userProvider:UserProvider, public events: Events) {
    this.post_id = this.navParams.get("post_id");
    this.user_name = this.navParams.get("user_name");
    this.user_token = this.navParams.get("user_token");
    this.current_token = this.navParams.get("current_token");
    this.getPostDetails();
    this.listPostDetails();

    this.events.subscribe('postdetails:deleted', (data) => {
      console.log('posts deleted event');
      this.deletePostEvent();
    });
    console.log('current: ',this.current_token,'\n', 'user: ',this.user_token);
  }

  gotoComments(post_id){
    this.navCtrl.push(CommentsPage, {'post_id': post_id});
  }

  presentPopoverMore(myEvent, post_id) {
    this.delete_post_id = post_id;
    let popover = this.popoverCtrl.create(MoreButtonPopoverPage, { page_type: "post_details" });
    console.log('my event', myEvent);
    popover.present({
      ev: myEvent
    });
  }

  getPostDetails() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.getPostDetails(this.post_id)
      .subscribe(data=>{
        loader.dismiss();
        console.log("data: ",data.data);
        this.postDetails = data.data;
      },
      (err) => {
        loader.dismiss();
        console.log("error: ",err);
      })
    })
  }

  listPostDetails() {
    return this.postDetails;
  }

  addToLiked(e, post_id) {
    console.log("post_id: ",post_id);
    e.stopPropagation();
    this.postProvider.addPostLike(post_id)
    .subscribe(data=>{
      console.log("data: ",data);
      this.getPostDetails();
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
      this.getPostDetails();
    },
    (err) => {
      console.log("error: ",err);
    })
  }

  gotoUserProfile(user_id) {
    this.navCtrl.push(ProfilePage, {'user_id': user_id});
    this.userProvider.setProfileUSerId(user_id);
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
          this.navCtrl.push(HomePage);
        } else {
        }  
      },
      (err) => {
        console.log('error: ',err);
        loader.dismiss();
      })
    })
  }
  
}
