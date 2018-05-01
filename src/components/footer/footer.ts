import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DownloadManicanPage } from '../../pages/download-manican/download-manican';
import { SearchPage } from '../../pages/search/search';
import { FavouritesPage } from '../../pages/favourites/favourites';
import { ProfilePage } from '../../pages/profile/profile';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the FooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {

  @Input('myPageNAme') myPageName;
  pageName: string;

  constructor(public navCtrl: NavController) {
    
  }

  ngAfterViewInit() {
    this.pageName = this.myPageName;
    console.log("retretrtrr",this.pageName);
  }

  gotoHome() {
    this.navCtrl.push(HomePage);
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
  }

}
