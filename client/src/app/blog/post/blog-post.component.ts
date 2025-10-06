import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { getImagePath } from '../../common/utils/utils';
import { PostImageService } from '../../common/services/post-image.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

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
  selector: 'app-blog-post',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './blog-post.component.html'
})
export class BlogPostComponent implements OnInit {
  post!: BlogPost;
  safeContent!: SafeHtml;
  loading = true;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _postImageService: PostImageService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: number): void {
    this.spinner.show();
    axios.get(`/api/post/find/${id}`).then(({ data }) => {
      this.post = data;

      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(data.content);

      // componding the post image
      data.post_pic.file_blob = data.file_blob;
      this._postImageService.setImageBlob(data.post_pic);

      this.imagePreview = getImagePath(data.post_pic);

      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the blog post');
      this.spinner.hide();
    });
  }
}
