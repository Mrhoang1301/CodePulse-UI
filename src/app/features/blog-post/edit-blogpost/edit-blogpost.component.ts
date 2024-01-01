import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy{
  id:string | null = null;
  model?:BlogPost
  categories$? :Observable<Category[]>
  selectedCategories?: string[];
  isImageSelectorVisible: boolean = false;
  
  routeSubcription?: Subscription;
  updateBlogPostSubcription?:Subscription;
  getBlogPostSubcription?:Subscription;
  deleteBlogPostSubcription?:Subscription;
  imageSelectSubcription?:Subscription;


  constructor(private route: ActivatedRoute,
    private blogPostService:BlogPostService,
    private categoryService:CategoryService,
    private router:Router,
    private imageService:ImageService
    ){

  }
  
  //Lấy data từ database
  ngOnInit(): void {
  this.categories$ = this.categoryService.getAllCategories();

    this.routeSubcription = this.route.paramMap.subscribe({
      next:(params)=>{
        this.id = params.get('id');
        // get blogpost from API
        if (this.id){
          this.getBlogPostSubcription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next:(response)=>{
              this.model=response;
              this.selectedCategories = response.categories.map(x=>x.id);
            }
          })
        }
        this.imageSelectSubcription = this.imageService.onSelectImage()
        .subscribe({
          next:(response)=>{
            if(this.model){
              this.model.featuredImageUrl = response.url;
              this.isImageSelectorVisible=false;
            }
          }
        })
      }
    })
  }

  onFormSubmit():void{
    //Convert this model to request object
    if(this.model && this.id){
      var updateBlogPost: UpdateBlogPost = {
        author:this.model.author,
        content:this.model.content,
        shortDescription:this.model.shortDescription,
        featuredImageUrl:this.model.featuredImageUrl,
        isVisible:this.model.isVisible,
        pubishedDate:this.model.pubishedDate,
        title:this.model.title,
        urlHandle:this.model.urlHandle,
        categories:this.selectedCategories ?? [] //Nếu seletedCategories = null thì trả lại mảng rỗng
      };

      this.updateBlogPostSubcription = this.blogPostService.updateBlogPost(this.id,updateBlogPost)
      .subscribe({
        next:(response) =>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  onDelete():void{
    if(this.id){
      //call service and delete blogpost
      this.deleteBlogPostSubcription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next:(response)=>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  openImageSelector():void{
    this.isImageSelectorVisible=true;
  }

  closeImageSelector():void{
    this.isImageSelectorVisible=false;
  }

  ngOnDestroy(): void {
    this.routeSubcription?.unsubscribe();
    this.updateBlogPostSubcription?.unsubscribe();
    this.getBlogPostSubcription?.unsubscribe();
    this.deleteBlogPostSubcription?.unsubscribe();
    this.imageSelectSubcription?.unsubscribe();
  }


}
