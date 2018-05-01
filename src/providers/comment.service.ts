import { Injectable } from "@angular/core";
import { Http, Response     ,Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { LoadingController } from "ionic-angular";
import { Storage } from '@ionic/storage';

@Injectable()
export class CommentProvider {

    token;

    allCommentsUrl = "http://fashion.fatimabalhaddad.com/public/api/getComments/";
    addCommentURL = "http://fashion.fatimabalhaddad.com/public/api/addComment";

    constructor(public http: Http, public storage: Storage) {  
        this.storage.get('token').then((token)=> {
            this.token = token;
        })
    }

    getAllComments(post_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.get(this.allCommentsUrl+post_id, {headers: headers})
        .map((response: Response) => response.json())
    }

    getNextPageComments(page, post_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.allCommentsUrl+post_id+'?page='+page)
        .map((response: Response) =>response.json())
    }

    addComment(post_id,comment) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let commentObject = {
            'token': this.token,
            'post_id': post_id,
            'comment': comment
        }

        return this.http.post(this.addCommentURL, commentObject, {headers: headers})
        .map((response: Response) => response.json())
    }

}