import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, PopoverController, Events } from 'ionic-angular';

import{ HomePage } from '../home/home';
import { FavouritesPage } from '../favourites/favourites';
import { ProfilePage } from '../profile/profile';
import { DownloadManicanPage } from '../download-manican/download-manican';
import { PostProvider } from '../../providers/post.service';
import { PostDetailsPage } from '../post-details/post-details';
import { MoreButtonPopoverPage } from '../more-button-popover/more-button-popover';
import { UserProvider } from '../../providers/user.service';
import { UserProfilePage } from '../user-profile/user-profile';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  myInput:any = [];
  searchPosts:any = [];
  // tagPosts:any = [];
  // isAppear = true;
  firstTagPost;
  secondTagPost;
  ThirdTagPost;
  ForthTagPost;
  currentTagPost;
  token;
  search_type:any = 'none';
  page_number:any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public postProvider:PostProvider, public loadingCtrl: LoadingController, 
    public popoverCtrl: PopoverController, public userProvider: UserProvider, public events: Events) {
    this.getPostTags();

    this.token = this.postProvider.getTokenFromStorage();

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

  gotoProfile(){
    this.navCtrl.push(ProfilePage);
    this.userProvider.setProfileUSerId(null);
  }

  onInput(event) {
    if(this.myInput[0] == (event.keyCode == 32)) {
      this.myInput = "";
    } else if(this.myInput == "") {
      console.log("empty input");
      this.searchPosts = [];
    } else {
      this.getPostsBySearch();
    }
    // else {
    //   if(this.myInput =='#') {
    //     // this.isAppear = false;
    //   } else if(this.myInput[0] =='#') {
    //     // this.setPostTags(this.myInput.slice(1));
    //   } else {
    //     if(this.myInput == "") {
    //       console.log("empty input");
    //       this.searchPosts = [];
    //       // this.isAppear = true;
    //     }
    //     else {
    //       this.getPostsBySearch();
    //     }
    //   }
    // }
    
  }

  getPostsBySearch() {
    this.search_type = 'searchByPosts';
    this.postProvider.getPostsBySearch(this.myInput)
    .subscribe(data=>{
      this.searchPosts = data.data;
      console.log("data: ",data);
    },
    (err) => {
      console.log("error: ",err);
    })
  }

  setPostTags(input) {
    this.currentTagPost = input;
    this.search_type = 'searchByTags';
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.setPostTags(input)
      .subscribe(data => {
        console.log("data: ",data);
        // this.tagPosts = data.data;
        this.searchPosts = data.data;
        loader.dismiss();
      },
      (err) => {
          console.log("error: ",err);
          loader.dismiss();
      })
    });
  }

  doInfinite(): Promise<any> {
    console.log('search type: ', this.search_type);
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        if(this.search_type == 'searchByPosts') {         
          this.page_number += 1;
          this.postProvider.getNextPagePostSearch(this.page_number, this.myInput)
          .subscribe(data => {
            if(data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                this.searchPosts.push(data.data[i]);
              }
            }
            console.log('data: ', data);
          },
          (err) => {
            console.log('error: ',err);
          })
        } else if(this.search_type == 'searchByTags') {
          this.page_number += 1;
          this.postProvider.getNextPagePostSearch(this.page_number, this.currentTagPost)
          .subscribe(data => {
            if(data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                this.searchPosts.push(data.data[i]);
              }
            }
            console.log('data: ', data);
          },
          (err) => {
            console.log('error: ',err);
          })
        }

        console.log('End async operation');
        resolve();
      }, 200);
    })
  }

  onCancel(eve) {
    this.searchPosts = [];
    // this.isAppear = true;
  }

  listSearchPosts() {
    return this.searchPosts;
  }

  gotoPostDetails(e, post_id,user_name, user_token) {
    e.stopPropagation();
    this.navCtrl.push(PostDetailsPage, {"post_id":post_id, "user_name": user_name, user_token, "current_token":this.token});
  }

  gotoUserProfile(e,user_id) {
    e.stopPropagation();
    this.navCtrl.push(UserProfilePage, {'user_id': user_id});
  }

  getPostTags() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
    });
    this.postProvider.getPostTags()
    .subscribe(data => {
      console.log("data: ",data);
      this.firstTagPost = data.first;
      this.secondTagPost = data.second;
      this.ThirdTagPost = data.third;
      this.ForthTagPost = data.fourth;
      loader.dismiss();
    },
    (err) => {
      console.log("error: ",err);
      loader.dismiss();
    })
  }

  presentPopoverMore(myEvent, post_id) {
    // this.delete_post_id = post_id;
    // let popover = this.popoverCtrl.create(MoreButtonPopoverPage, {page_type: "search"});
    // console.log('my event', myEvent);
    // popover.present({
    //   ev: myEvent
    // });

  }

}
