import { Component } from '@angular/core';
import {  NavController, NavParams , LoadingController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PostProvider } from '../../providers/post.service';
import { HomePage } from '../home/home';



@Component({
  selector: 'page-add-post-description',
  templateUrl: 'add-post-description.html',
})
export class AddPostDescriptionPage {
  public param: string;
  public sale: string = null;
  buttonColor1: string = '#8649a5';
  buttonColor2: string = '#8649a5';
  buttonColor3: string = '#8649a5';
  buttonColor4: string = '#8649a5';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public postProvider:PostProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController    
  ) {
    this.param = navParams.get("imageBase64");
  }

  filterSalesPosts(sale) {
    this.sale = sale;
    if(sale == '25%') {
      this.buttonColor1 = '#33FF33';
      this.buttonColor2 = this.buttonColor3 = this.buttonColor4 = '#8649a5';
    } else if (sale == '50%') {
      this.buttonColor2 = '#33FF33';
      this.buttonColor1 = this.buttonColor3 = this.buttonColor4 = '#8649a5';
    } else if (sale == '75%') {
      this.buttonColor3 = '#33FF33';
      this.buttonColor1 = this.buttonColor2 = this.buttonColor4 = '#8649a5';
    } else if (sale == '100%') {
      this.buttonColor4 = '#33FF33';
      this.buttonColor1 = this.buttonColor2 = this.buttonColor3 = '#8649a5';
    }
  }

  publish(desc){
    
     let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
    
      console.log("description is: ", desc);
      console.log("param is: ", this.param);
      this.storage.get('token').then(token=> {
        console.log('sale value: ', this.sale);
        this.postProvider.addPost(token,this.param,desc, this.sale)
        .subscribe((res) => {
          if(res){ 
            loader.dismiss();
            console.log("success ", JSON.stringify(res));
            this.navCtrl.push(HomePage, {'flag': 'first'});
          }
          else{
            loader.dismiss();
            console.log("error from api", JSON.stringify(res));
            let toast = this.toastCtrl.create({
              message: 'Please Enter Valid Description',
              duration: 3000,
              position: 'bottom'
            }); toast.present();
          }
        },
        (err) => {
          loader.dismiss();
          console.log("error cause dosen't access api is: ", JSON.stringify(err));
          // alert("Server Error Connection");
        })

      });
    });
    
  }
}
