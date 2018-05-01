import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider, 
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController ,
    public storage: Storage
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  onKeyPress(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode == 32 || event.keyCode == 46) ||
        (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      return true;
    }
    else {
      return false;
    }
  }
  changePassword(password, confirmPassword){
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
      loader.present().then(() => {
      this.storage.get('token').then((token)=> {
        this.userProvider.editPassword(token, password, confirmPassword)
        .subscribe((data) => {
         
          loader.dismiss();    
          console.log("data", data);

          if(data.error == "token_Required"){
           loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Please check your connection',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if(data.error == "new password required")
          {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'New Password Required',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if(data.error == "confirm password required")
          {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Confirm Password Required',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if(data.error == "password Not match")
          {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Please enter the same password',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          //else if(data.success == "password updated successfully"){
            else {
            loader.dismiss();
            
            let toast = this.toastCtrl.create({
              message: 'Password Updated Successfully',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
            this.navCtrl.pop();
          } 
        },(err)=>{
          loader.dismiss();
          // alert("Server Connection Error, Plese Check Your Internet Connection");
        }
      )
        //end subscribe
      })
    },
      (err)=>{
        loader.dismiss();
        // alert("Process time out, Please try again later");
      })
  }
}
