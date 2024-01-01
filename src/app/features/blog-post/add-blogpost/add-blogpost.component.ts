import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit,OnDestroy{
  model:AddBlogPost;
  categories$?:Observable<Category[]>;
  isImageSelectorVisible:boolean = false;

  imageSelectorSubcription?:Subscription;

  constructor(private blogpostService: BlogPostService,
    private router: Router, private categoryService: CategoryService,
    private imageService:ImageService
    ){
    this.model = {
      title:'',
      urlHandle:'',
      shortDescription:'',
      content:'',
      featuredImageUrl:'',
      pubishedDate: new Date(),
      author:'',
      isVisible:true,
      categories: [],
    }
  }
  ngOnDestroy(): void {
    this.imageSelectorSubcription?.unsubscribe();
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.imageSelectorSubcription = this.imageService.onSelectImage().subscribe({
      next: (selectedImage)=>{
        this.model.featuredImageUrl= selectedImage.url;
        this.closeImageSelector();
      }
    })
  }

  openImageSelector():void{
    this.isImageSelectorVisible=true;
  }

  closeImageSelector():void{
    this.isImageSelectorVisible=false;
  }

  onFormSubmit():void{
    this.blogpostService.creatBlogPost(this.model)
    .subscribe({
      next:(response)=>{
        this.router.navigateByUrl('/admin/blogposts');
      }
    })
  }

}
