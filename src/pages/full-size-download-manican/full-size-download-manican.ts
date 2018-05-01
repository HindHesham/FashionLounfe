import { Component } from '@angular/core';
import { NavController, NavParams,Platform, AlertController, LoadingController } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';


declare var cordova: any;
@Component({
  selector: 'page-full-size-download-manican',
  templateUrl: 'full-size-download-manican.html',
})
export class FullSizeDownloadManicanPage {
  photoObjPass : any;
  URL: any;
  Folder_Name: String
  File_Name: String;
  storageDirectory: string = '';
  path: any;
  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public platform: Platform,
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      private photoLibrary: PhotoLibrary
    ){
      this.photoObjPass = navParams.get("photoObjPass");
      this.URL = "http://www.fashion.fatimabalhaddad.com/public/images/staticImages/"+this.photoObjPass.photo;
      console.log("Url is ", this.URL);
      console.log("from const", this.photoObjPass);

      this.platform.ready().then(() => {
        // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
        if(!this.platform.is('cordova')) {
          return false;
        }
  
        if (this.platform.is('ios')) {
          this.storageDirectory = cordova.file.documentsDirectory;
        }
        else if(this.platform.is('android')) {
          this.storageDirectory = cordova.file.dataDirectory;
        }
        else {
          // exit otherwise, but you could add further types here e.g. Windows
          return false;
        }
      });
      
    }  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FullSizeDownloadManicanPage');
  }
  gotoPrevPage(){
    this.navCtrl.pop();
  }
  download(){
    var album = 'fashion lounge';
    var url = this.URL;
    this.path = this.storageDirectory+album;
    let loader = this.loadingCtrl.create({
      content: 'Downloading..',
    });
    loader.present().then(() => {
      this.photoLibrary.requestAuthorization().then(() => {
        console.log("permissions success") ;
        cordova.plugins.photoLibrary.saveImage(url, album, function (libraryItem) {
          loader.dismiss();
        }, function (err) {
          loader.dismiss();
            console.log("error", err);
            // alert("Please check your connection");
        });

        this.navCtrl.pop();
      })
    })
  }

}