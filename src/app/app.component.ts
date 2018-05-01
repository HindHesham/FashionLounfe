import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { UserProvider } from '../providers/user.service';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage: any = LoginPage;
  rootPage: any;
  constructor(public platform: Platform,
     statusBar: StatusBar,
     splashScreen: SplashScreen,
     private storage: Storage,
     private userProvider: UserProvider,
     private alertCtrl: AlertController,
     private cache: CacheService){

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Set TTL to 12h
      cache.setDefaultTTL(60 * 60 * 12);
      // Keep our cached results when device is offline!
      cache.setOfflineInvalidate(false);
/*
       this.storage.get('token').then(token=> {
         if(token) {
           this.rootPage = HomePage;
         } else {
          this.rootPage = LoginPage;
        }
       });
       */
    
   
      this.storage.set('token', 'nDIUhu7YBV2x735DdPoW1IBHvBgtBhwtiksg42Nft67MSR4WKmisu44FfpGHLXLzO171dGTAm7REzFKgMD0lhUCxWoeujrhEWMsqWtXyz7yeXc6bzTJPse8utHkuJUsJoC8p1cz6oxMUWmb4GlQVZF');  
    
      this.rootPage = HomePage;
   
    });
  }
 
}
