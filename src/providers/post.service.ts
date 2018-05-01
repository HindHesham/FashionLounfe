import { Injectable } from "@angular/core";
import { Http, Response     ,Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { LoadingController } from "ionic-angular";
import { Storage } from '@ionic/storage';
//import { Token } from "@angular/compiler";
import { CacheService } from "ionic-cache";

@Injectable()
export class PostProvider {

    public token:any;
    public flag:any = 'first';
    public allPostsData:any= [];
    public cacheData: any;
    // allPostsUrl = "http://fashion.fatimabalhaddad.com/public/api/getPosts";
    allPostsUrl = "http://fashion.fatimabalhaddad.com/public/api/allPosts/";
    isFavouritePostUrl = "http://fashion.fatimabalhaddad.com/public/api/isfavourite";
    addPostLikeUrl = "http://fashion.fatimabalhaddad.com/public/api/likePost";
    addPostFavouriteUrl = "http://fashion.fatimabalhaddad.com/public/api/addFavourite";
    postDetailsUrl = "http://fashion.fatimabalhaddad.com/public/api/retreivePost/";
    favouritePostsUrl = "http://fashion.fatimabalhaddad.com/public/api/getFavourite/";
    searchPostUrl = "http://fashion.fatimabalhaddad.com/public/api/getPostsBySearch";
    getPostTagsUrl = "http://fashion.fatimabalhaddad.com/public/api/getPopularHashTags";
    setPostTagsUrl = "http://fashion.fatimabalhaddad.com/public/api/getPostsByTag/";    
    filterManicanImageUrl = "http://www.fashion.fatimabalhaddad.com/public/api/filterImages";
    cropImageUrl = "http://fashion.fatimabalhaddad.com/public/api/crop/";
    addPostUrl = "http://fashion.fatimabalhaddad.com/public/api/addCroppedPost";
    deletePostURL = "http://fashion.fatimabalhaddad.com/public/api/deletePost";
    getSalesURL = "http://fashion.fatimabalhaddad.com/public/api/getPostsWithSale";
    filterPostSalesURL = "http://fashion.fatimabalhaddad.com/public/api/filterPostsWithSale";

    constructor(public http: Http, 
        public storage: Storage,
        public loadingCtrl: LoadingController,
        private cache: CacheService){
            this.storage.get('token').then((token)=> {
            this.token = token;
            console.log("token from const post", this.token);
        })
    }

    getTokenFromStorage() {
        return this.token
    }

    caaache(token) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Loading...'
        });
        alert('flag from service: '+ this.flag)
        if(this.flag != "second"){
            alert('flag first: '+ this.flag);
            loader.present().then(() => {
                 let req = this.http.get(this.allPostsUrl+token, {headers:headers})
                .map((response: Response) =>response.json());
                this.cacheData =  this.cache.loadFromObservable(this.allPostsUrl+token, req);
                this.cacheData.subscribe(data => {
                    loader.dismiss();
                    // alert("token "+token);
                    this.flag = "second";
                    console.log("kh ", this.flag);
                    alert(data.msg);
                    alert(JSON.stringify(data));
                    this.allPostsData = data.data;
                    console.log("this all posts data ", this.allPostsData)
                  }, 
                  (err) =>{
                    loader.dismiss();
                    console.log("error: ", err);
                    // alert("Connection Server Error");
                });
            });
        }else{
            alert('flag second: '+ this.flag);
            console.log("flag from else ", this.flag);
            this.cacheData.subscribe(data => {
                this.allPostsData = data.data;
                console.log("this all posts data ", this.allPostsData)
                return this.allPostsData;
              }, 
              (err) =>{
                console.log("error: ", err);
                // alert("Connection Server Error");
              });        
            }
    }

    getAllPostsData() {
        return this.allPostsData;
    }

    setFlag() {
        this.flag = 'first';
    }

    getNextPagePosts(page) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.allPostsUrl+this.token+'?page='+page)
        .map((response: Response) =>response.json())
    }

    pushToAllPostsData(post_object) {
        this.allPostsData.push(post_object);
    }

    getAllPosts(token) {
        let loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Loading...'
        });
    
        loader.present().then(() => {
            this.flag = 'first';
            this.token = token;
            
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Access-Control-Allow-Origin', '*');

            return this.http.get(this.allPostsUrl+token, {headers:headers})
            .map((response: Response) => response.json())
            .subscribe(data => {
                loader.dismiss();
                console.log('data: ', data);
                this.allPostsData = data.data;
            },
            (err) => {
                loader.dismiss();
                console.log('error: ', err);
            })
        })
    }

    addPost(token, image, description, sale) {
        var headers = new Headers();
        headers.append('Content-Type', 'applocation/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let postObject = {
            "token": token,
            "image": image,
            "description": description,
            "sale": sale
        }
        console.log("from service "+ postObject.description);
        console.log("from service "+ postObject.image);
        return this.http.post(this.addPostUrl,postObject,{headers:headers})
        .map((response: Response) => response.json())
    }

    deletePost(post_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'applocation/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let postObject = {
            "token": this.token,
            "post_id": post_id
        }

        return this.http.post(this.deletePostURL,postObject,{headers:headers})
        .map((response: Response) => response.json())
    }

    isFavouritePost(post_id) {
        let postObject = {
            "token": this.token,
            "post_id": post_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.isFavouritePostUrl, postObject , {headers: headers})
        .map((response: Response) => response.json())
    }

    addPostLike(post_id) {
        let postObject = {
            "token": this.token,
            "post_id": post_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.addPostLikeUrl, postObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    addPostFavourite(post_id) {
        let postObject={
            "token": this.token,
            "post_id": post_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.addPostFavouriteUrl, postObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    getPostDetails(post_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.postDetailsUrl+post_id+'/'+this.token, {headers: headers})
        .map((response: Response) => response.json())
    }

    getAllFavouritePosts() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.favouritePostsUrl+this.token, {headers: headers})
        .map((response: Response) => response.json())
    }

    getNextPageFavourite(page) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.favouritePostsUrl+this.token+'?page='+page, {headers: headers})
        .map((response: Response) => response.json())
    }

    getPostsBySearch(srch) {
        let postObject = {
            "srch": srch
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.searchPostUrl,postObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    getPostTags() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getPostTagsUrl, {headers: headers})
        .map((response: Response) => response.json())
    }

    setPostTags(input) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.setPostTagsUrl+input, {headers: headers})
        .map((response: Response) => response.json())
    }

    getNextPagePostSearch(page, srch) {
        let postObject = {
            "srch": srch
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.searchPostUrl+'?page='+page,postObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    getNextPageTagsSearch(page, srch) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getPostTagsUrl+'?page='+page, {headers: headers})
        .map((response: Response) => response.json())
    }

    filterImage(value){
        var headers = new Headers();
        let filterObject={
            "type":value
        }
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        console.log("from service ",value);
        return this.http.post(this.filterManicanImageUrl,filterObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    sendCropImage(token,image){
        
        var headers = new Headers();
        let cropObject={
            "image":image
        }
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        console.log("token is", token);
        console.log("base from service is ", image);
        
        // return this.http.post(this.cropImageUrl,this.cropImageUrl, {headers: headers})
       return this.http.post(this.cropImageUrl+token,cropObject, {headers: headers}).map(res => res.json());
    
    }

    getPostsWithSales() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getSalesURL, {headers: headers})
        .map((response: Response) => response.json())
    }

    getPostsWithSalesNextPage(page) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getSalesURL+'?page='+page, {headers: headers})
        .map((response: Response) => response.json())
    }

    filterPostSales(average) {
        console.log(average);
        let postObject = {
            'sale': average
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.filterPostSalesURL, postObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    filterPostSalesNextPage(average, page) {
        console.log(average);
        let postObject = {
            'sale': average
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.filterPostSalesURL+'?page='+page, postObject, {headers: headers})
        .map((response: Response) => response.json())
    }
}
