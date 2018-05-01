import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DownloadManicanPage } from '../download-manican/download-manican';
import { FavouritesPage } from '../favourites/favourites';
import { ProfilePage } from '../profile/profile';
import { PostProvider } from '../../providers/post.service';
import { SearchPage } from '../search/search';
import { PostDetailsPage } from '../post-details/post-details';
import { UserProfilePage } from '../user-profile/user-profile';


@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {

  postsData: any = [];
  isEmptyArray: any;
  public sale_type: any = 'none';
  page_number: any = 1;
  averageSale: any;
  token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public postProvider: PostProvider, public loadingCtrl: LoadingController) {
    this.token = this.postProvider.getTokenFromStorage();
    this.getPostsWithSales();
  }

  // subscribe APIs
  getPostsWithSales() {
    this.sale_type = 'postsSale';

    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.getPostsWithSales()
      .subscribe(data => {
        loader.dismiss();
        this.postsData = data.data;
        if(this.postsData.length == 0) {
          this.isEmptyArray = 'true';
        } else {
          this.isEmptyArray = 'false';
        }
        console.log('dsfsfg: ', this.isEmptyArray);
        console.log('sales: ', this.postsData);
      },
      (err) => {
        loader.dismiss();
        console.log('error: ', err);
      })
    })
  }

  filterSalesPosts(average) {
    this.sale_type = 'filterSale';
    this.averageSale = average;

    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.postProvider.filterPostSales(average)
      .subscribe(data => {
        loader.dismiss();
        this.postsData = data.data;
        if(this.postsData.length == 0) {
          this.isEmptyArray = 'true';
        } else {
          this.isEmptyArray = 'false';
        }
        console.log('dsfsfg: ', this.isEmptyArray);
        console.log('data: ', data);
      },
      (err) => {
        loader.dismiss();
        console.log('error: ', err);
      })
    })
  }


  // Posts section methods
  gotoPostDetails(e,post_id,user_name, user_token) {
    e.stopPropagation();
    this.navCtrl.push(PostDetailsPage, {"post_id":post_id, "user_name": user_name, user_token, "current_token":this.token});
  }

  gotoUserProfile(e, user_id) {
    e.stopPropagation();
    this.navCtrl.push(UserProfilePage, {'user_id': user_id});
  }

  doInfinite(): Promise<any> {
    this.sale_type = 'postsSale';
    console.log('search type: ', this.sale_type);
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        if(this.sale_type == 'postsSale') {         
          this.page_number += 1;
          this.postProvider.getPostsWithSalesNextPage(this.page_number)
          .subscribe(data => {
            if(data.data.length > 0) {
              if(data.data.length == 0) {
                this.isEmptyArray = 'true';
              } else {
                this.isEmptyArray = 'false';
              }
              for (var i = 0; i < data.data.length; i++) {
                this.postsData.push(data.data[i]);
              }
            }
            console.log('data from sales: ', data);
          },
          (err) => {
            console.log('error: ',err);
          })
        } else if(this.sale_type == 'filterSale') {
          this.page_number += 1;
          this.postProvider.filterPostSalesNextPage(this.averageSale, this.page_number)
          .subscribe(data => {
            if(data.data.length > 0) {
              if(data.data.length == 0) {
                this.isEmptyArray = 'true';
              } else {
                this.isEmptyArray = 'false';
              }
              for (var i = 0; i < data.data.length; i++) {
                this.postsData.push(data.data[i]);
              }
            }
            console.log('data from filter: ', data);
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

  // tabs navigation methods
  gotoHome(){
    this.navCtrl.push(HomePage);
  }

  gotoAddSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  gotoAddPost(){
    this.navCtrl.push(DownloadManicanPage);
  }

  gotoFavourites(){
    this.navCtrl.push(FavouritesPage);
  }

  gotoProfile(){
    this.navCtrl.push(ProfilePage);
  }

}
