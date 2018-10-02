import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageuploadService {

  constructor(private http:HttpClient) { }


  imgUpload(fd){
    return this.http.post<any>("/api/user/image/upload",fd);
  }

  imgUploadDB(img){
    return this.http.post("/api/user/image/name",{"image":img,"username":sessionStorage.getItem("username")});
  }
}
