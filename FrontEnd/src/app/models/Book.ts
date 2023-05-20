export class Book {
title: string;
authors: string[];
year: number;
id: string; //s3 path of file
subject?: string;
courseId?: string;
image: string;
courses = [];//todo delete this field, only courses and teachers reference books
page?: number;
views?: number;
}

export class LastReadBook {
  id: string;
  pageNo: number;
  constructor(id: string, pageNo: number) {
    this.id = id;
    this.pageNo = pageNo;
  }
}

