import { Component, ViewChild } from '@angular/core';
import { FullSizeDownloadManicanPage } from '../full-size-download-manican/full-size-download-manican';
import { AddPostDescriptionPage } from '../add-post-description/add-post-description';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PostProvider } from '../../providers/post.service';
import { NavController, NavParams, LoadingController, ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { DomSanitizer } from '@angular/platform-browser';

declare var cordova: any;
@Component({
  selector: 'page-download-manican',
  templateUrl: 'download-manican.html',
  providers: [Camera]  
})
export class DownloadManicanPage {
  filterValue:string;
  status:any;
  filterPhoto:any;
  base64Image:any;
  token:any;
  imgUrl: any;
  storageDirectory: string = '';
  resImg :String;
  
  constructor(private photoLibrary: PhotoLibrary,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public postProvider:PostProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public storage: Storage,

    private DomSanitizer: DomSanitizer,

    ) {
      this.platform.ready().then(() => {
        // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
        if(!this.platform.is('cordova')) {
          return false;
        }
  
        if (this.platform.is('ios')) {
          this.storageDirectory = cordova.file.documentsDirectory;
        }
        else if(this.platform.is('android')) {
          this.storageDirectory = cordova.file.dataDirectory;
        }
        else {
          // exit otherwise, but you could add further types here e.g. Windows
          return false;
        }
      });
    this.status='download';
    this.filterValue = "all";
    this.base64Image = "none";
    
    this.storage.get('token').then(token=> {
      this.token = token;
    })
    
    
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
    loader.present().then(() => {
    this.postProvider.filterImage(this.filterValue)
    .subscribe((res) => {
      console.log("data msg ", res);
      if(res){ 
        loader.dismiss();     
        this.filterPhoto = res.data;
        console.log("res ", this.filterPhoto)
      }
      else{
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Please check your connection',
          duration: 3000,
          position: 'bottom'
        }); toast.present();
      }
    },
    (err)=>{
      console.log("err ",err);
    })
    
  });
  
  }
   
  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadManicanPage');
  }
  gotoImageFullSize(photoObj:any){
    console.log(photoObj);
    
    this.navCtrl.push(FullSizeDownloadManicanPage, {
    photoObjPass: photoObj 
  })
  }

  genderChange(val) {
    this.filterValue = val
    console.log('filter value Change:', this.filterValue);
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading...'
    });
    loader.present().then(() => {
      this.postProvider.filterImage(this.filterValue)
      .subscribe((res) => {
        console.log("data msg ", res);
        if(res){ 
          loader.dismiss();     
          this.filterPhoto = res.data;
          console.log("res ", this.filterPhoto)
        }
        else{
          
        }
      },
      (err)=>{
        console.log("err ",err);
      }
        
      )
    })
  }

  /* git picture from library and crop it*/
  uploadImage(){
    var status = 'upload';
    
    this.storage.get('token').then(token=> {
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
        
        let loader = this.loadingCtrl.create({
          spinner: 'crescent',
          content: 'Loading...'
        });
        loader.present().then(() => {
          this.postProvider.sendCropImage(token,this.base64Image)
          .subscribe((res) => {
            console.log("data msg ", JSON.stringify(res));
            if(res){ 
              loader.dismiss();
              console.log("success", JSON.stringify(res.image));
              this.resImg = res.image;
            }
            else{
              loader.dismiss();
              let toast = this.toastCtrl.create({
                message: 'Please Select Image',
                duration: 3000,
                position: 'bottom'
              }); toast.present();
            }
          },
            (err) => {
            console.log("error", JSON.stringify(err));
            loader.dismiss();
            // alert("Server Connection Error")
            }
          )
        })
      })
    })   
  }
saveCropImg(){
 //navigate to add-post-description Page
 this.navCtrl.push(AddPostDescriptionPage, {
    imageBase64: this.resImg
  })
}
/*
  saveCropImg(){
    var myBaseString = this.base64Image;
    let imgWithMeta = myBaseString.split(",") 
    // base64 data
    let imgData = imgWithMeta[1].trim();
    // content type
    let imgType = imgWithMeta[0].trim().split(";")[0].split(":")[1];

    console.log("imgData:",imgData);
    console.log("imgMeta:",imgType);
    console.log("aftergetpic:");
    let folderName = "fashion lounge";
    // this.fs is correctly set to cordova.file.externalDataDirectory
    let folderpath = "file:///storage/emulated/0/";
    let filename = "img.png";

    this.file.resolveLocalFilesystemUrl(folderpath).then( (dirEntry) => {
        console.log("resolved dir with:", dirEntry);
        this.savebase64AsImageFile(dirEntry.nativeURL,filename,imgData,imgType);
    });
  }
  */
// convert base64 to Blob
/*
b64toBlob(b64Data, contentType, sliceSize) {
  
            //console.log("data packet:",b64Data);
            //console.log("content type:",contentType);
            //console.log("slice size:",sliceSize);
  
            let byteCharacters = atob(b64Data);
  
            let byteArrays = [];
  
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let slice = byteCharacters.slice(offset, offset + sliceSize);
  
                let byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
  
                let byteArray = new Uint8Array(byteNumbers);
  
                byteArrays.push(byteArray);
  
            }
  
          console.log("size of bytearray before blobbing:", byteArrays.length);
          console.log("blob content type:", contentType);
  
          let blob = new Blob(byteArrays, {type: contentType});
  
          // alternative way WITHOUT chunking the base64 data
          // let blob = new Blob([atob(b64Data)],  {type: contentType});
  
          return blob;
    }
    */
  // save the image with File.writeFile()
  /*
savebase64AsImageFile(folderpath,filename,content,contentType){
  
        // Convert the base64 string in a Blob
        let data:Blob = this.b64toBlob(content,contentType,512);
  
        console.log("file location attempt is:",folderpath + filename);

        this.imgUrl = folderpath+filename,

       this.file.writeFile(
          folderpath,
          filename,
          data,
          {replace: true}
        ).then(
          _ => (
            this.imgUrl = folderpath+filename,
            console.log("Url",this.imgUrl),
            this.sendImgUrlToService()
          )
        ).catch(
          err => console.log("file create failed:",JSON.stringify(err))
        );
          
    }
    */
  /*
    sendImgUrlToService(){
      
      var image =  this.imgUrl // >>>file:///storage/emulated/0/img.png
      var cropImageUrl = "http://fashion.fatimabalhaddad.com/public/api/crop/"+this.token;
     
      this.postProvider.sendCropImage(image,this.token)
      
      .subscribe((res) => {
        console.log("data msg ", JSON.stringify(res));
        if(res){ 
         
          console.log("data ", JSON.stringify(res));
        }
        else{
       
        console.log("error ")
        }
      })
      
     
      console.log("before file transfer");
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: image.substr(image.lastIndexOf('/') + 1),
        httpMethod : "POST",
        headers : {
          'Content-Type' : 'application/json',
          'Access-Control-Allow-Origin' : '*'
      }
    }
    this.file_transfer.upload(image, (cropImageUrl),options)

     .then((data) => {
      // success
      console.log("data: ", JSON.stringify(data))
    }, (err) => {
      // error
      console.log("err",JSON.stringify(err))
    })
   
  }
  */
}
