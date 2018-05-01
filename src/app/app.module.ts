import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
Storage
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { RegisterPage } from '../pages/register/register';
import { AddProfileImgPage } from '../pages/add-profile-img/add-profile-img';
import { SaveProfileImgPage } from '../pages/save-profile-img/save-profile-img';
import { PostDetailsPage } from '../pages/post-details/post-details';
import { CommentsPage } from '../pages/comments/comments';
import { NotificationPage } from '../pages/notification/notification'; 
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile'; 
import { FavouritesPage } from '../pages/favourites/favourites';
import { DownloadManicanPage } from '../pages/download-manican/download-manican';
import { FollowingsPage } from '../pages/followings/followings';
import { FullSizeDownloadManicanPage } from '../pages/full-size-download-manican/full-size-download-manican';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MoreButtonPopoverPage } from '../pages/more-button-popover/more-button-popover';
import { AddPostDescriptionPage } from '../pages/add-post-description/add-post-description';
import { UserProfilePage } from '../pages/user-profile/user-profile';

import { UserProvider } from '../providers/user.service';
import { FooterComponent } from '../components/footer/footer';
import { PostProvider } from '../providers/post.service';

import { Device } from '@ionic-native/device';
import { FCM } from '@ionic-native/fcm';
import { Facebook} from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';
import { CommentProvider } from '../providers/comment.service';
import { FilterPopoverPage } from '../pages/filter-popover/filter-popover';
import { PhotoLibrary } from '@ionic-native/photo-library';

import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { CloudModule } from '@ionic/cloud-angular';
import { CacheModule } from 'ionic-cache';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Storage } from '@ionic/cloud/dist/es5/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ForgetPasswordPage,
    RegisterPage,
    AddProfileImgPage,
    
    SaveProfileImgPage,
    FollowingsPage,
    PostDetailsPage,
    CommentsPage,
    NotificationPage,
    ProfilePage,
    EditProfilePage,
    FavouritesPage,
    DownloadManicanPage,
    AddPostDescriptionPage,
    FullSizeDownloadManicanPage,
    SearchPage,
    SettingsPage,
    ChangePasswordPage,
    MoreButtonPopoverPage,
    FooterComponent,
    FilterPopoverPage,
    UserProfilePage
  ],
  imports: [
    [HttpModule],
    BrowserModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp,{scrollPadding: true,
      scrollAssist: true,
      autoFocusAssist: false,
      tabsPlacement: 'bottom',
    platforms: {
      android: {
        tabsPlacement: 'top'
      },
      ios: {
        tabsPlacement: 'top'
      },
      windows:
      {
        tabsPlacement: 'top'
      }
    }
    }),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot(),
    
    CloudModule.forRoot({
      'core':{
        'app_id':""
      },
      'push':{
        "sender_id":"72605404090",
        'pluginConfig':{
          'ios':{
            'badge':true,
            'sound':true
          },
          'android':{
            
          }
        }
      }
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ForgetPasswordPage,
    RegisterPage,
    AddProfileImgPage,
    
    SaveProfileImgPage,
    FollowingsPage,
    PostDetailsPage,
    CommentsPage,
    NotificationPage,
    ProfilePage,
    EditProfilePage,
    FavouritesPage,
    DownloadManicanPage,
    AddPostDescriptionPage,
    FullSizeDownloadManicanPage,
    SearchPage,
    SettingsPage,
    ChangePasswordPage,
    MoreButtonPopoverPage,
    FilterPopoverPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    Facebook,
    TwitterConnect,
    InAppBrowser,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    UserProvider,
    PostProvider,
    CommentProvider,
    PhotoLibrary,
    Base64ToGallery

  ]
})
export class AppModule { }
