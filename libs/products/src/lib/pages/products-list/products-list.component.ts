import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage = false;
  endSubs$: Subject<any> = new Subject()

  constructor(
    private prodService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      params['categoryId'] ? this._getProducts([params['categoryId']]) : this._getProducts();
      params['categoryId'] ? this.isCategoryPage = true: (this.isCategoryPage) = false
    })
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.prodService.getProducts(categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe((resProducts) => {
      this.products = resProducts;
    })
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((resCats) => {
      this.categories = resCats;
    })
  }

  categoryFilter() {
    const selectedCategories: any = this.categories.filter((category) => category.checked).map(category => category.id);
    this._getProducts(selectedCategories)
  }

  ngOnDestroy(): void {
      this.endSubs$.next(true);
      this.endSubs$.complete();
  }

}
