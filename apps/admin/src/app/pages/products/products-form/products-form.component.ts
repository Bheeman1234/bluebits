import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {MessageService} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Product, ProductsService } from '@bluebits/products';
import { timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit {
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  categories = [];
  imageDisplay: string | ArrayBuffer;
  currentProductId: string;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private location: Location,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode()
  }

  private _initForm() {
    this.form = this.formBuilder.group({
        name: ['', Validators.required],
        brand: ['', Validators.required],
        price: ['', Validators.required],
        category: ['', Validators.required],
        countInStock: ['', Validators.required],
        description: ['', Validators.required],
        richDescription: [''],
        image: ['', Validators.required],
        isFeatured: [false]
    })
  }

  onCancel() {
    this.location.back()
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid)
    return;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      // console.log(key);
      // console.log(this.productForm[key].value);
      productFormData.append(key, this.productForm[key].value);
    });
    if(this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData).subscribe((product: Product) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`Product ${product.name} is created`});
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
     }, () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Product is not created'});
     });
  }

  private _updateProduct(productFormData: FormData) {
    this.productsService.updateProduct(productFormData, this.currentProductId).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Success', detail:'Product is updated'});
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
     }, () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Product is not updated'});
     });
  }


  onImageUpload(event) {
    const file = event.target.files[0];
    if(file) {
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file);
    }
  }


  private _getCategories() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if(params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.category.setValue(product.category.id);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }
    })
  }

  get productForm() {
    return this.form.controls;
  }

}
