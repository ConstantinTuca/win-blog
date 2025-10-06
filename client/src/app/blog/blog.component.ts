import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostImageService } from '../common/services/post-image.service';
import { getImagePath } from '../common/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';
// import { BlogService, BlogPost } from '../../services/blog.service';

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
  selector: 'app-blog',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './blog.component.html'
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  loading = true;

  constructor(
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private _postImageService: PostImageService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.spinner.show();
    this.loading = true;
    axios.get(`/api/post/findAll`).then(({ data }) => {
      for(let row of data) {
        // componding the post image
        row.post_pic.file_blob = row.file_blob;
        this._postImageService.setImageBlob(row.post_pic);

        row.featured_image = getImagePath(row.post_pic);

        row.content = this.getExcerpt(row.content, 500);
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

  getExcerpt(content: string, length: number = 120): SafeHtml {
    const textOnly = content.replace(/<[^>]+>/g, ''); // strip HTML
    const result = textOnly.length > length ? textOnly.slice(0, length) + '...' : textOnly;
    return this.sanitizeContent(result);
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
