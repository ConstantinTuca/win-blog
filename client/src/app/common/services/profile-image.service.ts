import { Injectable } from "@angular/core";
import { getImagePath } from "../utils/utils";

@Injectable({ providedIn: 'root' })
export class ProfileImageService {
  private img: any = null;

  setImageBlob(profileImage: any) {
    if (this.img) {
       this.img = null; // cleanup old image
    }
    if(profileImage) {
        this.img = profileImage;
    }
  }

  getImageUrl(): string | null {
    return this.img ? getImagePath(this.img) : null;
  }
}
