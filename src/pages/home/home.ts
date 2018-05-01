import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, Platform, Events } from 'ionic-angular';
import { CommentsPage } from '../comments/comments';
import { NotificationPage } from '../notification/notification';
import { PostDetailsPage } from '../post-details/post-details';
import { SearchPage } from '../search/search';
import { FavouritesPage } from '../favourites/favourites';
import { ProfilePage } from '../profile/profile';
import { DownloadManicanPage } from '../download-manican/download-manican';
import { MoreButtonPopoverPage } from '../more-button-popover/more-button-popover';
import { PostProvider } from '../../providers/post.service';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user.service';
import { Push } from '@ionic/cloud-angular';
import { CacheService } from "ionic-cache";
import { Observable } from 'rxjs/Observable';
import { UserProfilePage } from '../user-profile/user-profile';
import { SalesPage } from '../sales/sales';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  allPosts:any = [];
  public token;
  delete_post_id:any;
  page_number:any = 1;
  flag:any ;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public popoverCtrl: PopoverController, 
    public postProvider:PostProvider, 
    public userProvider: UserProvider,
    public storage: Storage,
    public platform: Platform,
    public push: Push,
    public events: Events,
    public loadingCtrl: LoadingController,
    private cache: CacheService) {
    
    
      platform.ready().then(()=>{
        push.register().then((token)=>{
          //alert("tooken "+JSON.stringify(token));
        });
        push.rx.notification().subscribe(msg=>{
          // alert("notify msg "+ JSON.stringify(msg));
        });
        
      });

      
      this.flag = this.navParams.get('flag');
      console.log('flaaag', this.flag);
      
     
      this.getAllData();

    this.events.subscribe('allposts:deleted', (data) => {
      console.log('all posts deleted');
      this.deletePostEvent();
    });
    
  }

  getAllData(){
    this.storage.get('token').then((token)=>{
      this.token = token;
      this.allPosts = this.postProvider.getAllPosts(token);
      //return this.allPosts;
    });
  }

  gotoNotification(){
    this.navCtrl.push(NotificationPage);
  }

  PostDetailsPage(post_id, user_name, user_token){
    this.navCtrl.push(PostDetailsPage, {"post_id":post_id, "user_name": user_name, "user_token": user_token, "current_token":this.token});
  }

  gotoComments(post_id){
    this.navCtrl.push(CommentsPage, {'post_id': post_id});
  }
  
  gotoAddPost(){
    this.navCtrl.push(DownloadManicanPage);
  }

  gotoSearch(){
    this.navCtrl.push(SearchPage)
  }

  gotoFavourites(){
    this.navCtrl.push(FavouritesPage);
  }

  gotoProfile(){
    this.navCtrl.push(ProfilePage);
    this.userProvider.setProfileUSerId(null);
  }

  presentPopoverMore(myEvent, post_id) {
    this.delete_post_id = post_id;
    let popover = this.popoverCtrl.create(MoreButtonPopoverPage,{page_type: "all_posts"});
    console.log('my event', myEvent);
    popover.present({
      ev: myEvent
    });

  }

  getAllPostsData() {
    return this.postProvider.getAllPostsData();
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.page_number += 1;
        this.postProvider.getNextPagePosts(this.page_number)
        .subscribe(data => {
          for (var i = 0; i < data.data.length; i++) {
            this.postProvider.pushToAllPostsData(data.data[i]);
          }
          console.log('data: ', data);
        },
        (err) => {
          console.log('error: ',err);
        })

        console.log('End async operation');
        resolve();
      }, 200);
    })
  }
  
  listAllPosts() {
    return this.allPosts;
  }

  addToLiked(e, post_id) {
    console.log("post_id: ",post_id);
    e.stopPropagation();
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.addPostLike(post_id)
      .subscribe(data=>{
        
        console.log("data: ",data);
        this.postProvider.getAllPosts(this.token);
        loader.dismiss();
      },
      (err)=> {
        loader.dismiss();
        console.log("error: ",err);
      })
    })
  }

  addToFavourite(e, post_id) {
    e.stopPropagation();

    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.addPostFavourite(post_id)
      .subscribe(data => {
        loader.dismiss();
        console.log("data: ",data);
        this.postProvider.getAllPosts(this.token);
      },
      (err) => {
        loader.dismiss();
        console.log("error: ",err);
      })
    })
  }

  gotoUserProfile(user_id) {
    this.navCtrl.push(UserProfilePage, {'user_id': user_id});
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
          this.postProvider.getAllPosts(this.token);
        } else {
        }  
      },
      (err) => {
        console.log('error: ',err);
        loader.dismiss();
      })
    })
  }

  doRefresh(refresher) {
    this.storage.get('token').then((token) => {
      this.postProvider.getAllPosts(this.token);
      refresher.complete();
    },
    (err)=>{
      refresher.complete();     
    })
  }
  gotoSales(){
    this.navCtrl.push(SalesPage);
  }
}
