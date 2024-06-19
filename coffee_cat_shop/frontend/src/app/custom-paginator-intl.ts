import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Số mục trên mỗi trang';

  getRangeLabel = function(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return `0 trên ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} trên ${length}`;
  };
}