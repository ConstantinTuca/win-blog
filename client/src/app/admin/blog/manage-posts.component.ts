import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../components/admin-footer/admin-footer.component';
import { getImagePath } from '../../common/utils/utils';
import { PostImageService } from '../../common/services/post-image.service';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  featured_image: string;
  publish_date: string;
  active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-manage-posts',
  imports: [
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './manage-posts.component.html'
})
export class ManagePostsComponent implements OnInit {
  activeSidebar: boolean = true;
  posts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  loading = true;

  constructor(
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _postImageService: PostImageService
  ) {}

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.spinner.show();
    this.loading = true;
    axios.get(`/api/admin/post/findAll`).then(({ data }) => {
      for(let row of data) {
        // componding the post image
        row.post_pic.file_blob = row.file_blob;
        this._postImageService.setImageBlob(row.post_pic);

        row.featured_image = getImagePath(row.post_pic);
      }

      this.posts = data;
      this.filteredPosts = data;

      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the blog posts');
      this.loading = false;
      this.spinner.hide();
    });
  }

  filterPosts() {
    this.filteredPosts = this.posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || (post.active && this.selectedStatus === 'active') || (!post.active && this.selectedStatus === 'inactive');
      return matchesSearch && matchesStatus;
    });
  }

  editPost(postId: number) {
    this.router.navigate(['/admin/edit-blog-post', postId]);
  }

  changeStatus(blog_post: BlogPost) {
    blog_post.active = !blog_post.active;

    const updateObject = {
      id: blog_post.id,
      active: blog_post.active
    };
    this.spinner.show();
    axios.put(`/api/admin/post`, updateObject).then(() => {
      this.toast.success('The post was changed status with success');
      this.spinner.hide();
    }).catch(() => this.toast.error('Error at the changing of status of the post'));
  }

  deletePost(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    axios.delete(`/api/admin/post/${postId}`).then(() => {
      this.toast.success('The post was deleted with success');
      this.spinner.hide();
      this.loadPosts();
    }).catch(() => this.toast.error('Error at the deleting of the post'));
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
