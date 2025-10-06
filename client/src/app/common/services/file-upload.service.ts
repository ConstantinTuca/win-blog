import axios from 'axios';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private sanitizer: DomSanitizer) { }

  saveFile = (file: File, details: any, uploadUrl: string, cb: any) => {
    const fd = new FormData();
    fd.append('file', file);

    for (let key in details) {
      if (details.hasOwnProperty(key) && details[key] != undefined) {
        fd.append(key, details[key]);
      }
    }

    axios.post(uploadUrl, fd, {
      headers: { 'Content-Type': "multipart/form-data" }
    }).then(({ data }) => cb(null, data)).catch(e => cb(e));
  };

  saveFiles = (files: File[], data: any, uploadUrl: string, cb: any) => {
    const fd = new FormData();

    // Loop through all the files and append them to the FormData
    files.forEach(file => {
      fd.append('file', file);  // 'file' is the field name for each file on the backend
    });

    // add also the modal
    fd.append('data', JSON.stringify(data));

    axios.post(uploadUrl, fd, {
      headers: { 'Content-Type': "multipart/form-data" }
    }).then(({ data }) => cb(null, data)).catch(e => cb(e));
  };

  fromBufferToBlob = (buffer: Iterable<number>) => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(new Blob([new Uint8Array(buffer).buffer], { type: 'image/png' })));
  };

  fromBufferToBlobFile = (type: any, buffer: Iterable<number>) => {
    let content = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } as any;
    return window.URL.createObjectURL(new Blob([new Uint8Array(buffer).buffer], { type: 'application/' + content[type] }));
  };

  fromBufferToBase64 = (buffer: Iterable<number>) => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpg;base64,' + window.btoa(binary);
  };

  fromFileToBlob = (file: any) => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(new Blob([file], { type: file.type })));
  }
}
