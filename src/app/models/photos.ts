export class Post{
albumId?: number
id?: number
title: string
url: string


constructor(id: number,albumId:number,title:string,url:string){
    this.albumId = albumId;
    this.id = id;
    this.title =title;
    this.url = url;
}
}