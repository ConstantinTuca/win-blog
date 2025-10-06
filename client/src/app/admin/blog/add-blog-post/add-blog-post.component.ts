import axios from 'axios';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../../components/admin-footer/admin-footer.component';
import { FileUploadService } from '../../../common/services/file-upload.service';
import { LoginService } from '../../../common/authentication/services/login.service';
import { getImagePath } from '../../../common/utils/utils';
import { PostImageService } from '../../../common/services/post-image.service';

@Component({
  selector: 'app-add-blog-post',
  imports: [
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent,
    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './add-blog-post.component.html'
})
export class AddBlogPostComponent {
  isEditMode = false;
  postId!: number;

  activeSidebar: boolean = true;
  flagSubmitted: boolean = false;
  user = {} as any;
  blog_post = {
    id: null as number | null,
    title: '',
    content: '',
    category: null as string | null,
    tags: '',
    publish_date: '',
    id_file: null as number | null,
    id_user: null as number | null,
    time_to_read: 1 as number | null
  };
  categories = ['Technology', 'Finance', 'Lifestyle', 'Health'];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private _fileUploadService: FileUploadService,
    private _loginService: LoginService,
    private _postImageService: PostImageService
  ) {
    this._loginService.userValue.pipe().subscribe(u => this.user = u);
  }

  ngOnInit(): void {
    // Check if we are editing
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = +id;
        this.loadPostData(this.postId);
      }
    });
  }

  loadPostData(id: number) {
    this.spinner.show();
    axios.get(`/api/admin/post/find/${this.postId}`).then(({ data }) => {
      this.blog_post = {
        id: this.postId,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        publish_date: data.publish_date.split('T')[0], // format date
        id_file: data.id_file,
        id_user: data.id_user,
        time_to_read: data.time_to_read
      };

      // componding the post image
      data.post_pic.file_blob = data.file_blob;
      this._postImageService.setImageBlob(data.post_pic);

      this.imagePreview = getImagePath(data.post_pic);
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the blog post');
      this.spinner.hide();
    });
  }

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = null;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  validation = () => {
    this.flagSubmitted = true;
    if(!this.blog_post.title) {
      this.toast.error('The title of the blog post is mandatory');
      return false;
    }
    if(!this.blog_post.content) {
      this.toast.error('The content of the blog post is mandatory');
      return false;
    }
    if(!this.blog_post.category) {
      this.toast.error('The category of the blog post is mandatory');
      return false;
    }
    if(!this.blog_post.tags) {
      this.toast.error('The tags of the blog post is mandatory');
      return false;
    }
    if(!this.blog_post.publish_date) {
      this.toast.error('The publish date of the blog post is mandatory');
      return false;
    }
    if(!this.blog_post.time_to_read) {
      this.toast.error('The time to read of the blog post is mandatory');
      return false;
    }
    if(!this.imagePreview) {
      this.toast.error('The image of the blog post is mandatory');
      return false;
    }
    return true;
  }

  save() {
    if(this.validation()) {
      this.spinner.show();
      this.blog_post.id_user = this.user.id;

      if (this.isEditMode) {
        if(this.selectedFile) {
          // add new file plus update the blog post
          this._fileUploadService.saveFile(this.selectedFile, this.blog_post, '/api/admin/post/uploadFile', (err: any, data: any) => {
            if (err) {
              this.toast.error(`Error at the uploading of the file!`);
            } else {
              this.blog_post.id_file = data.id;
              this.doUpdate();
            }
          })
        } else {
          // only update
          this.doUpdate();
        }
      } else {
        //create a new blog post
        if(this.selectedFile) {
          this._fileUploadService.saveFile(this.selectedFile, this.blog_post, '/api/admin/post/uploadFile', (err: any, data: any) => {
            if (err) {
              this.toast.error(`Error at the uploading of the file!`);
            } else {
              this.blog_post.id_file = data.id;
              axios.post(`/api/admin/post`, this.blog_post).then(() => {
                this.toast.success(`The blog was posted with sucess!`);
                this.spinner.hide();
                this.router.navigate(['/admin/manage-posts']);
              }).catch(() => this.toast.error(`Error at the creating the blog post!`));
            }
          })
        }
      }
    }
  }

  doUpdate = () => {
    axios.put(`/api/admin/post`, this.blog_post).then(() => {
      this.toast.success(`The blog was updated with sucess!`);
      this.spinner.hide();
      this.router.navigate(['/admin/manage-posts']);
    }).catch(() => this.toast.error(`Error at the updating the blog post!`));
  }
}
