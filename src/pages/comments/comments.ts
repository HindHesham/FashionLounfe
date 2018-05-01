import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { CommentProvider } from '../../providers/comment.service';


@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  
  post_id;
  allComments;
  page_number:any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public commentProvider: CommentProvider, public loadingCtrl: LoadingController, public platform: Platform) {
    this.post_id = this.navParams.get('post_id');
    this.getAllComments();
    // this.platform.registerBackButtonAction(() => {
    //   console.log('baaaaaack');
    // });
    
  }

  getAllComments() {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      this.commentProvider.getAllComments(this.post_id)
      .subscribe(data => {
        console.log("data: ", data);
        this.allComments = data.data;
        loader.dismiss();
      },
      (err)=> {
        console.log("error: ",err);
        loader.dismiss();
      })
    });
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.page_number += 1;
        this.commentProvider.getNextPageComments(this.page_number, this.post_id)
        .subscribe(data => {
          for (var i = 0; i < data.data.length; i++) {
            this.allComments.push(data.data[i]);
          }
          console.log('data: ', data);
        },
        (err) => {
          console.log('error: ',err);
        })

        console.log('End async operation');
        resolve();
      }, 200);
    })
  }

  listComments() {
    return this.allComments;
  }

  get Comments() {
    return this.allComments;
  }

  addComment(comment) {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });

    loader.present().then(() => {
      if(comment.length ==0){
        console.log('empty');
      } else {
        console.log("postId: ",this.post_id);
        this.commentProvider.addComment(this.post_id, comment)
        .subscribe(data => {
          console.log("data: ",data);
          this.getAllComments();
          loader.dismiss();
        },
        (err) => {
          console.log("error: ",err);
          loader.dismiss();
        })
      }
    });
  }
    

}
