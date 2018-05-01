import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfilePage } from '../profile/profile';
import { AddProfileImgPage } from '../add-profile-img/add-profile-img';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user.service';


/**
 * Generated class for the SaveProfileImgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-save-profile-img',
  templateUrl: 'save-profile-img.html',
  providers: [Camera]
})
export class SaveProfileImgPage {
  base64Image:any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public camera: Camera,
     public loadingCtrl: LoadingController,
     private toastCtrl: ToastController,
     public storage: Storage,
     public userProvider:UserProvider
    ) {
      this.base64Image = 'none'
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaveProfileImgPage');
  }
  goback() {
    this.navCtrl.pop();
  }
  uploadImage(){
  
      const options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true
      }
      this.camera.getPicture(options).then((imageData) => {
       this.base64Image = "data:image/JPEG;base64,"+imageData;
        console.log("image base64 is ",this.base64Image);
    })

  }
  saveImage(){
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
    loader.present().then(() => {
      this.storage.get('token').then(token=>{
        //alert("token is " + token);
        this.userProvider.addProfileImage(token,this.base64Image)
        .subscribe(data => {
          //alert("data is "+ JSON.stringify(data)) 
          if(data.msg == "token_required")
          {
            let toast = this.toastCtrl.create({
              message: 'connection failed',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else{
            loader.dismiss();
            this.navCtrl.push(ProfilePage)
          } 
      },
      (err) => {
          loader.dismiss();
          // alert("Connection Server Error");
        })
      })
    })
  }
  gotoProfilePage()
  {
    this.navCtrl.push(ProfilePage);
  }
}

