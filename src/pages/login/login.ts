import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';

import { Device } from '@ionic-native/device';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Loading } from 'ionic-angular/components/loading/loading';

interface deviceInterface {
  macId?: string
};
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  token:any;
  twitterToken:any;
  public deviceInfo: deviceInterface = {};
  dataFromFacebook: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private device: Device, 
    public userProvider: UserProvider, 
    public formBuilder: FormBuilder, 
    private fcm: FCM, 
    private toastCtrl: ToastController,
    private storage: Storage,
    private fb: Facebook,
    public tw: TwitterConnect,
    public loadingCtrl: LoadingController
  ){
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
     
    });
    this.deviceInfo.macId = this.device.uuid;
    console.log("macId is",this.deviceInfo.macId)
    this.fcm.getToken().then(token=>{
      this.token = token;
      console.log("token in constructor from login", token);
      });
      
  }

  goForgetpassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }
  goRegister()
  {
   this.navCtrl.push(RegisterPage);
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
  loginUser(email,password) { 
    console.log('email: ',email,'password: ',password);
    
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
    loader.present().then(() => {

    if(!this.loginForm.valid){
      this.submitAttempt = true;
    } else {
      this.submitAttempt = false;
      this.deviceInfo.macId = this.device.uuid;
      //console.log("macId is",this.deviceInfo.macId)
      this.fcm.getToken().then(token=>{
        this.token = token;
        console.log("token before subscribe", token);

        this.userProvider.loginUser(email,password,this.deviceInfo.macId,this.token)
        .subscribe((data) =>{
          console.log("mac is ", this.deviceInfo.macId);
          console.log("token after subscribe is ", this.token);
          console.log("data is ", data.msg);
        
          if(data.msg == "email_required" || data.msg == "password_required" || data.msg == "token_required" || data.msg == "mac_required")
          {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Please fill all fields',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if ( data.msg == "invalid_data") {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Please enter valid data',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if (data.token){
             
             this.storage.set('token', data.token);
             console.log("return is : ", data.token);
             loader.dismiss();             
             this.navCtrl.push(HomePage);
          }
        },
          (err)=>{
            loader.dismiss();
            // alert("error: "+ err);
          }
        )
        });
      }
    },
      (err)=>{
        loader.dismiss();
        // alert("Process time out, Please try again later");        
      })
    }
    
    fb_login(){
      let permissions = new Array();
      permissions = ["public_profile", "email"];
      this.fb.login(permissions)
      .then((res: FacebookLoginResponse) =>
      {
        console.log('Logged into Facebook!',res)
        let params = new Array();
       this.fb.api("/me?fields=name,gender,picture,first_name,last_name,email", params)
       .then((user) => {
            console.log("user object",user.toString())
            this.dataFromFacebook = user;
            let userFromFacebook = {
              name: this.dataFromFacebook.name,
              gender: this.dataFromFacebook.gender,
              fname: this.dataFromFacebook.first_name,
              lname: this.dataFromFacebook.last_name,
              email: this.dataFromFacebook.email,
              fbId: this.dataFromFacebook.id
            }
            const data = {
              facebook_id:userFromFacebook.fbId,
              mac:this.deviceInfo.macId,
              token: this.token,
              gender: userFromFacebook.gender, 
              fname : userFromFacebook.fname, 
              lname : userFromFacebook.lname
            }
            this.facebokkService(data);
          });
        })
      // .catch(e =>alert('Error logging to facebook'+e));
    }

    facebokkService(data){
      const { facebook_id , mac , token, gender, fname, lname } = data ;
      let loader = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Loading...'
      });
      loader.present().then(() => {

        this.userProvider.facebookLogin(facebook_id , mac , token, gender, fname, lname)
        .subscribe((data) => {
          //console.log("facebook data msg ", JSON.stringify(data));
          loader.dismiss();
          console.log("facebook data msg ", JSON.stringify(data));
         
          if(data.msg == "token_Required" || data.msg == "mac_Required" || data.msg == "invalid_MAC_Address" || data.msg == "invalid data"){
           loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Please check your connection',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
          else if (data.token){
            this.storage.set('token', data.token);
            console.log("return is : ", data.token);
            loader.dismiss();
            this.navCtrl.push(HomePage);
         }
        },
        (err)=>{
          loader.dismiss();
          // alert("Please Check Your Internet Connection");
          //alert("err "+ err);
        }
      )
    });  
  }

  loginWithTwitter(){
    this.tw.login().then((res) => {
       this.twitterToken = res.token
      console.log("login Pass");
      
      let loader = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Loading...'
      });
      loader.present().then(() => { 
        this.tw.showUser().then((user) =>{
          console.log("showUser pass");
          let twitterObj = {
            twId: user.id,
            name: user.name,
            userName: user.screen_name,
            picture: user.profile_image_url_https
          }
          console.log("object " , JSON.stringify(twitterObj));
          this.userProvider.twitterLogin(twitterObj.twId, twitterObj.name ,this.deviceInfo.macId, this.token)
          .subscribe((data) => {
            loader.dismiss();
            console.log("data msg ", JSON.stringify(data));

            if(data.msg == "token_Required" || data.msg == "mac_Required" || data.msg == "invalid data"){
              let toast = this.toastCtrl.create({
                message: 'Please Login With Valid Account',
                duration: 3000,
                position: 'bottom'
              }); toast.present();
            }
            else if (data.token){
              
              this.storage.set('token', data.token);
              console.log("return is : ", data.token);
              this.navCtrl.push(HomePage);
            }
          },
          (err)=>{
            //alert("err subscribe: "+JSON.stringify(err));
            loader.dismiss();
            // alert("Server Error Connection, Please Try Again Later");
          })
        //end subscribe
      },
        (err)=>{
          // alert("Please Useing Valid Account")
        });
        //end showUser()
      });
    })
      //end login()
    }
}