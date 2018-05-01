import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PostProvider } from '../../providers/post.service';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-add-profile-img',
  templateUrl: 'add-profile-img.html',
})
export class AddProfileImgPage {

  base64Image;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public postProvider:PostProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProfileImgPage');
  }

  goback() {
    this.navCtrl.pop();
  }
  gotoProfilePage(){
    this.navCtrl.push(ProfilePage);
  }
/*
  uploadImage() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   sourceType: 2,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   mediaType: this.camera.MediaType.PICTURE
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   this.base64Image = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    // });
  }
*/
  saveImage() {
    
  }
}
