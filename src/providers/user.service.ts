import {Observable} from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { Http, Response,Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { LoadingController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";

@Injectable()
export class UserProvider {

    private cacheData: any;
    userPosts: any = [];
    userFollowers: any = [];
    userFollowing: any = [];
    public token: any;
    profile_user_id;
    public flag:any;
    public rate;
    
    userProfileDetails: any = {
        id: '',
        name: '',
        photo: '',
        phone: '',
        email: '',
        gender: '',
        isBase64:'',
        isCurrentUser: '',
        token: ''
    };

    registerUrl = "http://fashion.fatimabalhaddad.com/public/api/register";
    loginUrl = "http://fashion.fatimabalhaddad.com/public/api/login";
    facebookLoginUrl = "http://fashion.fatimabalhaddad.com/public/api/facebook";  
    twitterLoginUrl = "http://fashion.fatimabalhaddad.com/public/api/twitter"; 
    notificationUrl = "http://fashion.fatimabalhaddad.com/public/api/notifications/";
    deleteNotificationUrl = "http://fashion.fatimabalhaddad.com/public/api/notification";
    userProfileUrl = "http://fashion.fatimabalhaddad.com/public/api/user/";
    FollowUserUrl = "http://fashion.fatimabalhaddad.com/public/api/followUser";
    unfollowUserUrl = "http://fashion.fatimabalhaddad.com/public/api/unfollowUser";
    isFollowUrl = "http://fashion.fatimabalhaddad.com/public/api/isFollow";
    otherUserProfileUrl = "http://fashion.fatimabalhaddad.com/public/api/profile/";
    editUserProfileUrl = "http://fashion.fatimabalhaddad.com/public/api/updateUserProfile";
    addProfileImgUrl="http://fashion.fatimabalhaddad.com/public/api/addUserPhoto";
    changePassword = "http://fashion.fatimabalhaddad.com/public/api/updateOldPassword";
    getUserRatingUrl = "http://fashion.fatimabalhaddad.com/public/api/getRates/";
    saveUserRatingUrl = "http://fashion.fatimabalhaddad.com/public/api/saveRates";

    constructor(public loadingCtrl: LoadingController, 
               private cache: CacheService, 
               public http: Http, 
               public storage: Storage) {  
        this.storage.get('token').then((token)=> {
            this.token = token;
            //console.log("token from user service ", this.token);
        })
    }

    setProfileUSerId(user_id) {
        this.profile_user_id = user_id;
    }

    getProfileUserId() {
        return this.profile_user_id;
    }

    registerUser(name, email, password) {
        let userObject = {
            "name": name,
            "email": email,
            "password": password
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        console.log('objectttttttt: ',userObject);
        return this.http.post(this.registerUrl, userObject, {headers:headers})
        .map((response: Response) => response.json())
            
    }

    loginUser(email, password, macId, token) {
        let userObject = {
            "login": email,
            "password": password,
            "mac" : macId,
            "token" : token
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:8100');
        console.log('object: ',userObject);
        return this.http.post(this.loginUrl, userObject, {headers:headers})
        .map(response => response.json())  
    }

    facebookLogin(facebook_id, mac, token, gender, fname, lname){
        let userObject = {
            "facebook_id": facebook_id,
            "mac" : mac,
            "token" : token,
            "gender": gender, 
            "fname": fname,
            "lname" : lname
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        console.log('object id is: ',userObject.facebook_id);
        console.log('object mac is: ',userObject.mac);
        return this.http.post(this.facebookLoginUrl, userObject, {headers:headers})
        .map(response => response.json()) 
    }

    twitterLogin(twitter_id, name, mac, token){
       console.log("from service ", twitter_id);
       console.log ("mac", mac);
       console.log("token", token)
        let userObject = {
            "twitter_id": twitter_id,
            "name": name,
            "mac" : mac,
            "token" : token
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.twitterLoginUrl, userObject, {headers:headers})
        .map(response => response.json()) 
    }

    getAllNotification(token) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        //alert("service")
        return this.http.get(this.notificationUrl+token, {headers: headers})
        .map((response: Response) => response.json())
    }

    deleteNotification(id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let userObject = {
            unique_id: id
        }

        return this.http.post(this.deleteNotificationUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    getProfileDetails() {
        
        this.userProfileDetails = {
            id: '',
            name: '',
            photo: '',
            phone: '',
            email: '',
            gender: '',
            isBase64:''
        };
        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Loading...'
        });

        loader.present().then(() => {
            return this.http.get(this.userProfileUrl+this.token, {headers: headers})
            .map((response: Response) =>response.json())
            .subscribe(data => {
                loader.dismiss();
                console.log('data: ', data);
                this.userProfileDetails.id = data.result.data[0].id;
                this.userProfileDetails.name = data.result.data[0].name;
                this.userProfileDetails.photo = data.result.data[0].photo;
                this.userProfileDetails.phone = data.result.data[0].phone;
                this.userProfileDetails.email = data.result.data[0].email;
                this.userProfileDetails.gender = data.result.data[0].gender;
                this.userProfileDetails.isBase64 = data.result.data[0].isBase64;
                this.userProfileDetails.token = data.result.data[0].tokens;
                this.userPosts = data.result.data[0].post;
                this.userFollowers = data.result.data[0].follower;
                this.userFollowing = data.result.data[0].following;
                this.flag = "second";
                this.subscribeUserRating(data.result.data[0].id);
            },
            (err) => {
                loader.dismiss();
                console.log('error: ',err);
            })
        })

            // if (this.flag != "second"){
            //     loader.present().then(() => {
            //         // alert("flag"+ this.flag);
            //         let req = this.http.get(this.userProfileUrl+this.token, {headers: headers})
            //         .map((response: Response) =>response.json())
            //         this.cacheData = this.cache.loadFromObservable(this.userProfileUrl+this.token, req);
            //         console.log("data cache", this.cacheData);
            //         return this.cacheData.subscribe(data => {
            //             loader.dismiss();
            //             console.log("data", data);
                        
            //             this.userProfileDetails.id = data.result.data[0].id;
            //             this.userProfileDetails.name = data.result.data[0].name;
            //             this.userProfileDetails.photo = data.result.data[0].photo;
            //             this.userProfileDetails.phone = data.result.data[0].phone;
            //             this.userProfileDetails.email = data.result.data[0].email;
            //             this.userProfileDetails.gender = data.result.data[0].gender;
            //             this.userProfileDetails.isBase64 = data.result.data[0].isBase64;
            //             this.userProfileDetails.token = data.result.data[0].tokens;
            //             this.userPosts = data.result.data[0].post;
            //             this.userFollowers = data.result.data[0].follower;
            //             this.userFollowing = data.result.data[0].following;
            //             this.flag = "second";
            //             this.subscribeUserRating(data.result.data[0].id);
            //             //console.log("flag", this.flag);
            //         },
            //         (err) => {
                        
            //             loader.dismiss();
            //         //    alert("error: "+err);
            //         })
            //     })
            // }//end if flag
            // else if (this.flag == "second"){
            //     // alert("flag");
            //     return this.cacheData.subscribe(data => { 
            //         console.log("data",data);
            //         this.userProfileDetails.id = data.result.data[0].id;
            //         this.userProfileDetails.name = data.result.data[0].name;
            //         this.userProfileDetails.photo = data.result.data[0].photo;
            //         this.userProfileDetails.phone = data.result.data[0].phone;
            //         this.userProfileDetails.email = data.result.data[0].email;
            //         this.userProfileDetails.gender = data.result.data[0].gender;
            //         this.userProfileDetails.isBase64 = data.result.data[0].isBase64;
            //         this.userProfileDetails.token = data.result.data[0].tokens;
            //         this.userPosts = data.result.data[0].post;
            //         this.userFollowers = data.result.data[0].follower;
            //         this.userFollowing = data.result.data[0].following;
            //         this.subscribeUserRating(data.result.data[0].id);
            //         console.log(this.userProfileDetails.photo, "photo")  
            //     },
            //     (err) => {
            //         loader.dismiss();
            //         // alert("error else: "+err);
                    
            //     })
            // } 
    }

    getNextCurrentProfileDetails(page) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.userProfileUrl+this.token+'?page='+page, {headers: headers})
        .map((response: Response) => response.json())
        .subscribe(data => {
            console.log(data);
            if(data.result.data.length > 0) {
                for (var i = 0; i < data.result.data[0].post.length; i++) {
                    this.userPosts.push(data.result.data[0].post[i]);
                }

                for (var i = 0; i < data.result.data[0].follower.length; i++) {
                    this.userFollowers.push(data.result.data[0].follower[i]);
                }

                for (var i = 0; i < data.result.data[0].following.length; i++) {
                    this.userFollowing.push(data.result.data[0].following[i]);
                }
            }
        },
        (err) => {
            console.log("error: ",err);
        })
    }

    getUserProfileDetails(user_id) {

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Loading...'
        });
        
        loader.present().then(() => {
            return this.http.get(this.otherUserProfileUrl+user_id+'/'+this.token, {headers: headers})
            .map((response: Response) => response.json())
            .subscribe(data => {
                this.userProfileDetails.id = data.data[0].id;
                this.userProfileDetails.name = data.data[0].name;
                this.userProfileDetails.photo = data.data[0].photo;
                this.userProfileDetails.phone = data.data[0].phone;
                this.userProfileDetails.isBase64 = data.data[0].isBase64;
                this.userProfileDetails.isCurrentUser = data.data[0].isCurrentUser;
                this.userProfileDetails.token = data.data[0].tokens;
                this.userPosts = data.data[0].post;
                this.userFollowers = data.data[0].follower;
                this.userFollowing = data.data[0].following;
                console.log('hiiiiiii', data.data[0]);
                loader.dismiss();
            },
            (err) => {
                console.log("error: ",err);
                loader.dismiss();
            })
        })
    }

    getNextUserProfileDetails(page, user_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.otherUserProfileUrl+user_id+'/'+this.token+'?page='+page, {headers: headers})
        .map((response: Response) => response.json())
        .subscribe(data => {
            console.log(data);
            if(data.data.length > 0) {
                for (var i = 0; i < data.data[0].post.length; i++) {
                    this.userPosts.push(data.data[0].post[i]);
                }

                for (var i = 0; i < data.data[0].follower.length; i++) {
                    this.userFollowers.push(data.data[0].follower[i]);
                }

                for (var i = 0; i < data.data[0].following.length; i++) {
                    this.userFollowing.push(data.data[0].following[i]);
                }
            }
        },
        (err) => {
            console.log("error: ",err);
        })
    }

    getUserPosts() {
        return this.userPosts;
    }

    getUserFollowers() {
        return this.userFollowers;
    }

    getUserFollowing() {
        return this.userFollowing;
    }

    getUserObject() {
        return this.userProfileDetails;
    }

    followUser(followr_id) {

        let userObject = {
            'token': this.token,
            'follower_id': followr_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.FollowUserUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    unfollowUser() {
        let userObject = {
            'token': this.token,

        }
    }

    isFollowUser(user_id) {
        let userObject = {
            token: this.token,
            user_id: user_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.isFollowUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    editUserData(token, gender, phone, email, name) {
        let userObject = {
            'token': token,
            'gender': gender,
            'phone': phone,
            'email': email,            
            'name': name,
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        //alert("photo "+ image);
        return this.http.post(this.editUserProfileUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    addProfileImage(token, image){
        let userObject = {
            'token': token,
            'image': image
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.addProfileImgUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    editPassword(token, password, confirmPassword){
        let userObject = {
            'token': token,
            'password': password,
            'confirmPassword' : confirmPassword
        }
        console.log("from service ", password);
       // alert("from service"+ token);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.changePassword, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

    getUserRating(user_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getUserRatingUrl+user_id, {headers: headers})
        .map((response: Response) => response.json())
    }

    subscribeUserRating(user_id) {
        
        this.getUserRating(user_id)
        .subscribe(data => {
            this.rate = data.average;
            console.log('rate: ', data);
        },
        (err) => {
            console.log('error: ', err);
        })
    }

    getRate() {
        return this.rate;
    }

    saveUserRating(user_id) {
        let userObject = {
            'token': this.token,
            'id': user_id
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(this.saveUserRatingUrl, userObject, {headers: headers})
        .map((response: Response) => response.json())
    }

}