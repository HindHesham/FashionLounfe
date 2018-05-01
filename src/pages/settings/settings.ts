import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { EditProfilePage } from '../edit-profile/edit-profile';
import{ LoginPage } from '../login/login';
import { ChangePasswordPage } from '../change-password/change-password';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage) {
  }

  gotoHomePage(){
    this.navCtrl.push(HomePage);
  }
  gotoEditProfilePage(){
    this.navCtrl.push(EditProfilePage);
  }
  gotoChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage);
  }
  logOut(){
    this.storage.clear().then(() => {
      this.navCtrl.push(LoginPage);
    });
  }
}
