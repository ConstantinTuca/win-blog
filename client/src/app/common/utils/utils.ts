import axios from "axios";
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from "../../common/authentication/services/login.service";

const _spinner = new NgxSpinnerService();

export const updateToken = (obj: any, path: string | null, router: Router, _loginService: LoginService, toastr: ToastrService) => {
  return new Promise<void>((res, rej) => {
    if (obj) {
      _spinner.show();
      let _user: any;
      _loginService.userValue.pipe().subscribe(u => _user = u);

      delete obj.token;
      axios.post('/api/refreshToken/updateToken', obj).then(({ data }) => {
        if (data.token) {
          axios.defaults.headers.common['x-access-token'] = data.token;
          _loginService.setValue({ ..._user, ...obj, token: data.token });

          if (path) {
            if (router.url === path) {
              router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => router.navigateByUrl(path));
              res();
            } else {
              router.navigateByUrl(path).then(() => {});
              res();
            }
          } else {
            res();
          }
        } else {
          toastr.error('Token neactualizat!');
          router.navigateByUrl('/');
          rej();
        }
      }).catch(() => {
        toastr.error('Eroare la actualizarea token-ului');
        router.navigateByUrl('/');
        rej();
      });
    } else {
      router.navigateByUrl('/');
      rej();
    }
  });
}

export const updateTokenLogin = (obj: any, path: string | null, router: Router, _loginService: LoginService) => {
  return new Promise<void>((res, rej) => {
    if (obj) {
      _spinner.show();

      axios.post('/api/refreshToken/updateTokenLogin', cloneDeep(obj)).then(({ data }) => {
        if (data.token) {
          axios.defaults.headers.common['x-access-token'] = data.token;

          _loginService.setValue({ ...obj, token: data.token });
          if (path) {
            if (router.url === path) {
              router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => router.navigateByUrl(path));
              res();
            } else {
              router.navigateByUrl(path).then(() => {
                // window.location.reload();
              });
              res();
            }
          } else {
            res();
          }
        } else {
        //   toastr.error('Token neactualizat!');
          console.log('Token neactualizat!')
          router.navigateByUrl('/');
          rej();
        }

      }).catch(() => {
        // toastr.error('Eroare la actualizarea token-ului');
        console.log('Eroare la actualizarea token-ului');
        router.navigateByUrl('/');
        rej();
      });
    } else {
      router.navigateByUrl('/');
      rej();
    }
  });
}

export const replaceRomanianChars = (val:any) => {
  const romanianChars = {
    'ă': 'a',
    'Ă': 'A',
    'â': 'a',
    'Â': 'A',
    'î': 'i',
    'Î': 'I',
    'ș': 's',
    'ş': 's',
    'Ș': 'S',
    'ț': 't',
    'Ț': 'T'
  } as any;
  return val.replace(/[ăĂâÂîÎșȘțȚ]/g, (char:any) => romanianChars[char] || char);
}

export const saveFile = (blobType: any, data: any, fileName: any) => {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.href = blobType ? window.URL.createObjectURL(new Blob([data], {'type': 'application/' + blobType})) : data;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(a.href);
}

export const round = (value: number, decimals?: number) => {
  if (decimals) {
    let factor = Math.pow(10, decimals);
    return value = Math.round(value * factor) / factor;
  } else {
    return value = Math.round(parseFloat(value.toFixed(2)));
  }
};

export const round2 = (value: number): number => {
  return value = Math.round(value * 100) / 100;
};

export const roundDown = (value: number, decimals?: number) => {
  if (decimals) {
    let factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  } else {
    return Math.floor(parseFloat(value.toFixed(2)));
  }
};

export const roundUp = (value: number, decimals?: number) => {
  if (decimals) {
    let factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  } else {
    return Math.ceil(parseFloat(value.toFixed(2)));
  }
};

export const cloneDeep = (obj: any) => {
  if(typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if(obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if(obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = structuredClone(item);
      return arr;
    }, []);
  }

  if(obj instanceof Object) {
    return Object.keys(obj).reduce((newObj: any, key) => {
      newObj[key] = structuredClone(obj[key]);
      return newObj;
    }, {});
  }
};

export const minBy = (arr: any[], fn: Function) => arr.reduce((p: any, n: any) => (fn(p) <= fn(n)) ? p : n);

export const maxBy = (arr: any[], fn: Function) => arr.reduce((p: any, n: any) => (fn(p) >= fn(n)) ? p : n);

export const sumBy = (arr: any[], fn: Function | string): number => arr.reduce((p: any, n: any) => p + ((typeof fn === 'string' ? n[fn] : fn(n)) ?? 0), 0);

export const groupBy = (arr: any[], fn: Function | string) => arr.reduce((p: any, n: any) => {
  let key = typeof fn === 'string' ? n[fn] : fn(n);
  p[key] = p[key] || [];
  p[key].push(n);
  return p;
}, {});

export const uniqWith = (arr: any[], fn: Function): any[] => arr.reduce((p: any, n: any) => {
  if (!p.some((x: any) => fn(x, n))) {
    p.push(n);
  }
  return p;
}, []);

export const uniqBy = (arr: any[], fn: Function | string): any[] => arr.reduce((p: any, n: any) => {
  if (!p.some((x: any) => typeof fn === 'string' ? x[fn] === n[fn] : fn(x) === fn(n))) {
    p.push(n);
  }
  return p;
}, []);

export const sortedIndexBy = (arr: any[], value: any, fn: Function | string): number => {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (typeof fn === 'string' ? arr[mid][fn] < value[fn] : fn(arr[mid]) < fn(value)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
};

export const orderBy = (arr: any[], fns: (Function | string)[], orders?: ('asc' | 'desc')[]): any[] => {
  let result = cloneDeep(arr).sort((a: any, b: any) => {
    for (let i = 0, ln = fns.length; i < ln; i++) {
      let fn = fns[i];
      let order = orders ? orders[i] : 'asc';
      let result = 0;

      if (typeof fn === 'string') {
        if (a[fn] !== b[fn]) {
          result = a[fn] > b[fn] ? 1 : -1;
        }
      } else {
        if (fn(a) !== fn(b)) {
          result = fn(a) > fn(b) ? 1 : -1;
        }
      }

      if (order === 'desc') {
        result = result * -1;
      }

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });

  return result;
};

export const isEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  if (a instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  if (a instanceof Object) {
    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }

    return keys.every((k) => isEqual(a[k], b[k]));
  }

  return false;
};

export const isMatch = (obj: any, src: any): boolean => {
  if (obj === src) {
    return true;
  }

  if (!obj || !src || (typeof obj !== 'object' && typeof src !== 'object')) {
    return obj === src;
  }

  if (obj.prototype !== src.prototype) {
    return false;
  }

  if (obj instanceof Array) {
    if (obj.length !== src.length) {
      return false;
    }

    for (let i = 0; i < obj.length; i++) {
      if (!isMatch(obj[i], src[i])) {
        return false;
      }
    }

    return true;
  }

  if (obj instanceof Object) {
    return Object.keys(src).every((key) => isMatch(obj[key], src[key]));
  }

  return false;
};

export const merge = (obj: any, src: any): any => {
  if (obj instanceof Array) {
    return src;
  }

  if (obj instanceof Object) {
    Object.keys(src).forEach(key => {
      if (obj[key] && src[key]) {
        obj[key] = merge(obj[key], src[key]);
      } else {
        obj[key] = src[key];
      }
    });

    return obj;
  }

  return src;
};

export const chunk = (arr: any[], size: number): any[] => {
  const result = [];

  for (let i = 0, ln = arr.length; i < ln; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
};

export const nestedKeysValue = (obj: any, key: string) => {
  const nestedKeys = key.split('.');
  let value = obj;

  for (let i = 0, ln = nestedKeys.length; i < ln; i++) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value !== 'object') return value;

    value = value[nestedKeys[i]];
  }

  return value;
};

export const randomUUID = (): string => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return uuid;
};

export const calcTextWidth = (text: string, canvas: any, font: string = `13px "Times New Roman", serif`) => {
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width + 30;
};

export const base64ToString = (str: string) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

export const base64toBlob = (base64Data: string, contentType: string = ''): Blob => {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const bufferToBlob = (buffer: any, mimeType: any) => {
  const arrayBuffer = new Uint8Array(buffer).buffer;
  return new Blob([arrayBuffer], { type: mimeType });
};

export const bufferToBase64 = (buffer: any, mimeType: string): string => {
  const bytes = new Uint8Array(buffer.data);
  const binaryString = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
  const base64String = btoa(binaryString);
  return `data:${mimeType};base64,${base64String}`;
};

export const makeBlobFromArray = (arr: any[]) => {
  let buf = new ArrayBuffer(arr.length);
  let view = new Uint8Array(buf);
  for(let i = 0, ln = arr.length; i < ln; i++) {
    view[i] = arr[i] & 0xFF;
  }
  return buf;
};

export const getImagePath = (file: any): string | null => {
  if (file.file_blob && file.file_blob.data) {
    const blob = new Blob([new Uint8Array(file.file_blob.data)], { type: `image/${file.extension}` });
    const fileObj = new File([blob], file.name || `file-${file.id}.${file.extension}`, { type: `image/${file.extension}` });
    return URL.createObjectURL(fileObj);
  }
  return null;
}

export const getCurrencyId = (type: string): number => {
  let id_currency = 2;
   if (type === 'RON') {
      id_currency = 1;
    } else if (type === 'EUR') {
      id_currency = 2;
    } else if (type === 'USD') {
      id_currency = 3;
    }
  return id_currency;
};
