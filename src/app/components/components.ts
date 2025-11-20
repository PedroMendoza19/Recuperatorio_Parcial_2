import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Post } from '../models/photos';
import { Service } from '../app_service/services';
import { VoidExpression } from '@angular/compiler';

declare var bootstrap: any;
@Component({
  selector: 'app-components',
  imports: [FormsModule],
  templateUrl: './components.html',
  styleUrl: './components.css',
})
export class AppComponents implements OnInit{
posts: Post[] = [];
postToShow: Post[] = [];
newPost: Post = {title: '',url: ''};
editPost: Post = {title:'', url:''};
modal: any;
errorMessage = '';
loading: boolean = false;
pageSize = 50;


constructor(private services: Service, private cdr: ChangeDetectorRef){}

ngOnInit():void {
  this.get();
}

get(): void {
  this.loading = true;
  this.services.get().subscribe({
    next: (data: Post[])=>{
      this.posts = data.slice(0,this.pageSize);
      this.updateDisplayPost();
      this.loading = false;
      this.cdr.detectChanges();
    }, error:(error)=>{
      alert('Error al obtener la api ' + error)
      this.posts = [];
      this.loading = false;
    }
  });
}

updateDisplayPost(): void{
  this.postToShow = [...this.posts];
}

save(): void{
  const newS = {...this.newPost, albumId: 1};
  if (!newS.title|| !newS.url) {
    alert("Completa los campos.")
    return;
  }
  this.services.add(newS).subscribe({
    next:(createdPost)=>{
      const maxId = this.posts.length >0 ? Math.max(...this.posts.map(p=> p.id ||0)):0;
      createdPost.id = maxId +1;

      this.posts.push(createdPost);

      this.updateDisplayPost();

      this.newPost = {title: '', url:''};

      this.cdr.detectChanges();

      this.scrollToBottom();
    },error: (error)=>{
      console.error('Error al guardar post: ',error)
    }
  })
}

update(): void{
  if(!this.editPost)return;
  if (this.editPost.id && this.editPost.id <=100) {
    this.services.update(this.editPost.id!,this.editPost).subscribe({
      next: (response)=>{
        const i = this.posts.findIndex((p)=> p.id === response.id);
        if(i> -1) {
          this.posts[i] = response;
          this.updateDisplayPost();
        }
        this.cdr.detectChanges();
        console.log("hasta aca funciona");
        
        this.closeModal();
      },error:(error)=>{
        alert('Error al editar el post' + this.errorMessage + '' + error)
        this.closeModal();
      }
    });
  }else{
    const i = this.posts.findIndex((p=> p.id == this.editPost.id));
    if(i> -1) {
      this.posts[i] = {...this.editPost};
      this.updateDisplayPost();
    }
    this.closeModal();
    alert("Foto actualizada correctamente")
  }
}

delete(id:number):void{
if(!confirm('Seguro que quiere eliminar este post?'))return;

this.services.delete(id).subscribe({
  next:()=>{
    this.posts = this.posts.filter(p=> p.id !== id);
    this.updateDisplayPost();
    this.cdr.detectChanges();
  },error:(error)=>{
    alert('Error al eliminar el post: ' + this.errorMessage + ' ' + error)
    console.error('Error al eliminar el post: ', error)
  }
})
}

openEditModal(post: Post):void{
this.editPost = {...post};
const modalElement = document.getElementById('editModal');
if(modalElement){
  this.modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  this.modal.show();
}
}

closeModal(): void {
  const modalElement = document.getElementById('editModal');
  if(modalElement){
    const modal = bootstrap.Modal.getInstance(modalElement);
    if(modal){
      modal.hide();
    }
  }
}

scrollToBottom():void{
  window.scrollTo({
    top:document.body.scrollHeight,
    behavior: 'smooth'
  })
}

openModal(post: Post): void{
  try {
    this.editPost = {...post};
    const modalEd = document.getElementById('editModal');
    if (modalEd) this.modal = new(window as any).bootstrap.Modal(modalEd);
  } catch (error) {
    console.error("Error", error)
  }
}

prepareForEditionPost(post:Post): void{
  this.editPost = {...post};
  this.openModal(this.editPost);
}
}
