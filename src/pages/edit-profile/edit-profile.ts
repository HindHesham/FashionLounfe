import { Component } from '@angular/core';
import { UserProvider } from '../../providers/user.service';
import { Storage } from '@ionic/storage';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  gender;
  photo;
  base64Image:any = this.userProvider.getUserObject().photo;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public userProvider: UserProvider, 
    public storage: Storage,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    
  ) {
    this.userProvider.getProfileDetails();
  }

  getProfileDetails() {
    return this.userProvider.getUserObject();
  }

  /////////////// uplad image code //////////// 
  uploadImage() {
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
      this.saveImage();

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
            // alert("sucess" + data);
          } 
      },
      (err) => {
          loader.dismiss();
          // alert("Connection Server Error");
        })
      })
    })
  }

  ///////////// send edited data to service //////////
  saveUserEditedData(name, email, phone) {
    console.log('from methooooooood', this.gender);
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
    
    loader.present().then(() => { 
      this.storage.get('token').then((token) => {
        this.userProvider.editUserData(token, this.gender ,phone, email, name)
        .subscribe(data => {
          loader.dismiss();
          // alert('data: '+JSON.stringify(data));
          this.navCtrl.pop();
          let toast = this.toastCtrl.create({
            message: 'your data is updated',
            duration: 3000,
            position: 'bottom'
          }); toast.present();
        },
        (err) => {
          loader.dismiss();
          // alert('error: '+ err);
          // alert("Connection Server Error");
        })
      })
   },(err)=>{
     loader.dismiss();
    //  alert("Check your internet connection");
   })
  }

}
