import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import download from 'image-downloader';

type Data = {
  data: Array<Object>;
  currentPage: number;
  totalPage: number;
};

dotenv.config();
const serverUrl: string = process.env.SERVER_URL || '';
const keywords: string[] = ['world', 'league', 'euro', 'championship', 'cup', 'olympics'];

class Utils {
  convertDataSequelize(data: Data) {
    return {
      totalPage: data.totalPage,
      currentPage: data.currentPage,
      data: data.data.map((items) => {
        // @ts-ignore
        return items.toJSON();
      }),
    };
  }

  pagination(c: number, m: number) {
    const current = c;
    const last = m;
    const delta = 2;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
      if ((i === 1 || i === last || i >= left) && i < right) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    // console.log(c, m, rangeWithDots)
    rangeWithDots;

    const template = `
    <nav aria-label="Page navigation">
    <ul class="pagination">
       ${
         c !== 1
           ? `<li class="page-item">
       <a class="page-link" href="?page=${c - 1}" aria-label="Previous">
           <span aria-hidden="true">&laquo;</span>
       </a>
   </li>`
           : ''
       }
       
        ${rangeWithDots
          .map((e) => {
            if (e !== '...') {
              return `<li class="page-item"><a class="page-link ${
                c === e ? 'active' : ''
              }"  href="?page=${e}">${e}</a></li>`;
            } else {
              return `<li class="page-item"><a class="page-link">${e}</a></li>`;
            }
          })
          .toString()
          .replace(/\,/g, '')}
       
        ${
          c !== m
            ? `<li class="page-item">
        <a class="page-link" href="?page=${c + 1}" aria-label="Previous">
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>`
            : ''
        }
      
        
    </ul>
</nav>`;

    return template;
  }

  checkFileExit(fileName: string) {
    const pathFileCheck: string = path.join(global.__basedir, `public/other-image/${fileName}`);
    const check = fs.existsSync(pathFileCheck);
    return check;
  }

  async saveFile(url: string) {
    if (!fs.existsSync(path.join(global.__basedir, 'public/other-image'))) {
      fs.mkdirSync(path.join(global.__basedir, 'public/other-image'));
    }

    const options = {
      url,
      dest: path.join(global.__basedir, 'public/other-image'),
    };

    try {
      const result = await download.image(options);
      console.log('Saved image to', result);
    } catch (error) {
      console.log('Error => ' + error);
    }
  }

  async saveAllFile(listUrl: string[]) {
    if (!fs.existsSync(path.join(global.__basedir, 'public/other-image'))) {
      fs.mkdirSync(path.join(global.__basedir, 'public/other-image'));
    }

    const listPromise = listUrl.map(async (url: string) => {
      const options = {
        url,
        dest: path.join(global.__basedir, 'public/other-image'),
      };

      try {
        const result = await download.image(options);
        console.log('Saved image to', result);
      } catch (error) {
        console.log('Error => ' + error);
      }
    });

    await Promise.all(listPromise);
  }

  handleImageDownload(fileName: string, url: string) {
    const splitFileName: string[] = fileName?.split('/');
    let result: string = '';
    let resultFileName: string = '';
    if (splitFileName) {
      resultFileName = splitFileName.length > 1 ? splitFileName[1] : splitFileName[0];
      result = `${serverUrl}/assets/other-image/${resultFileName}`;
    }

    if (!this.checkFileExit(resultFileName)) {
      this.saveFile(url);
    }

    return result;
  }

  checkIsCountry(value: string): boolean {
    const rs = keywords.filter((item: string) => value.toLowerCase().includes(item));
    if (rs.length > 0) return false;
    else return true;
  }

  getImageUrl(fileName: string, url: string, imageUrls: string[]): string {
    const serverUrl: string = process.env.SERVER_URL || '';
    const errName: string[] = ['undefined.jpg', 'undefined.png', 'undefined'];
    // kiem tra neu hinh anh khong co hoac bi loi thi bo qua cai nay
    if (errName.includes(fileName)) return '';

    const splitFileName: string[] = fileName?.split('/');
    let result: string = '';
    let resultFileName: string = '';
    if (splitFileName) {
      resultFileName = splitFileName.length > 1 ? splitFileName[1] : splitFileName[0];
      result = `${serverUrl}/assets/other-image/${resultFileName}`;
      if (!this.checkFileExit(resultFileName)) {
        imageUrls.push(url);
      }
    }

    return result;
  }
}

export default new Utils();
