import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShopService } from '../../services/shop';
import { Auth } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDeleteDialog } from '../../components/confirmdelete/confirmdelete';
@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './shops.html',
  styleUrls: ['./shops.css']
})
export class Shops implements OnInit {

  private baseUrl = 'http://127.0.0.1:8000/api';

  currentView: 'list' | 'detail' = 'list';

  shops: any[] = [];
  selectedShop: any = null;

  products: any[] = [];

  catalogueProducts: any[] = [];

  showAddExistingProductModal = false;
  showAddNewProductModal = false;
  showEditModal = false;
  newProductImage: File | null = null;

  selectedCatalogueProductId: number | null = null;

  editingItem: any = null;
  editSellingPrice: number | null = null;
  editStockCount: number | null = null;
  editImage: File | null = null;
  newProductName = '';
  newProductMRP: number | null = null;
  newProductWeight = '';
  newSellingPrice: number | null = null;
  newStockCount: number | null = null;
  catalogueSellingPrice: number | null = null;
  catalogueStockCount: number | null = null;
  constructor(
    private shopService: ShopService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public auth: Auth,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.http.get<any>(`${this.baseUrl}/shops/`)
      .subscribe(res => {
        this.shops = res.results ? res.results : res;
        this.cdr.detectChanges();
      });
  }

  enterShop(shop: any) {
    this.selectedShop = shop;
    this.currentView = 'detail';
    this.loadProducts(shop.id);
  }

  backToList() {
    this.currentView = 'list';
    this.selectedShop = null;
  }

  loadProducts(shopId: number) {
    this.http.get<any[]>(`${this.baseUrl}/inventory/?shop=${shopId}`)
      .subscribe(data => {
        this.products = data;
        this.cdr.detectChanges();
      });
  }

  onEditImageSelected(event: any) {

  const file = event.target.files[0];

  if (file) {
    this.editImage = file;
  }

}
  onImageSelected(event: any) {

  const file = event.target.files[0];

  if (file) {
    this.newProductImage = file;
  }

}


  openAddExistingProduct() {
    this.showAddExistingProductModal = true;

    this.http.get<any>(`${this.baseUrl}/products/`)
      .subscribe(res => {

        const allProducts = res.results ? res.results : res;

        const existingIds = this.products.map(
          item => item.product?.id
        );

        this.catalogueProducts = allProducts.filter(
          (p: any) => !existingIds.includes(p.id)
        );

        this.cdr.detectChanges();
      });
  }

addProductToShop() {

  if (!this.selectedCatalogueProductId ||
      this.catalogueSellingPrice === null ||
      this.catalogueStockCount === null) {

    this.snackBar.open(
      'Please fill all fields',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  const selectedProduct = this.catalogueProducts.find(
    p => p.id === this.selectedCatalogueProductId
  );

  if (this.catalogueSellingPrice > selectedProduct.mrp) {

    this.snackBar.open(
      'Selling price cannot exceed MRP',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  if (this.catalogueSellingPrice <= 0 ||
      this.catalogueStockCount < 0) {

    this.snackBar.open(
      'Values must be positive',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  this.http.post(`${this.baseUrl}/inventory/`, {
    shop: this.selectedShop.id,
    product_id: this.selectedCatalogueProductId,
    selling_price: this.catalogueSellingPrice,
    stock_count: this.catalogueStockCount
  }).subscribe({
    next: () => {

      this.snackBar.open(
        'Product added to shop successfully',
        'OK',
        {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }
      );

      this.showAddExistingProductModal = false;

      this.selectedCatalogueProductId = null;
      this.catalogueSellingPrice = null;
      this.catalogueStockCount = null;

      this.loadProducts(this.selectedShop.id);
    },
    error: () => {

      this.snackBar.open(
        'Error adding product to shop',
        'Close',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }
      );

    }
  });
}
get selectedCatalogueProductMRP(): number | null {

  if (!this.selectedCatalogueProductId) return null;

  const product = this.catalogueProducts.find(
    p => p.id === this.selectedCatalogueProductId
  );

  return product ? product.mrp : null;
}


  createNewProduct() {

  if (!this.newProductName ||
      this.newProductMRP === null ||
      this.newSellingPrice === null ||
      this.newStockCount === null) {

    this.snackBar.open(
      'Please fill all fields',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  if (this.newSellingPrice > this.newProductMRP) {

    this.snackBar.open(
      'Selling price cannot exceed MRP',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  if (this.newSellingPrice <= 0 ||
      this.newProductMRP <= 0 ||
      this.newStockCount < 0) {

    this.snackBar.open(
      'Values must be positive',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
    return;
  }

  const formData = new FormData();

formData.append('name', this.newProductName);
formData.append('mrp', this.newProductMRP!.toString());
formData.append('weight', this.newProductWeight);

if (this.newProductImage) {
  formData.append('image', this.newProductImage);
}

this.http.post(`${this.baseUrl}/products/`, formData).subscribe({
    next: (product: any) => {

      this.http.post(`${this.baseUrl}/inventory/`, {
        shop: this.selectedShop.id,
        product_id: product.id,
        selling_price: this.newSellingPrice,
        stock_count: this.newStockCount
      }).subscribe({
        next: () => {

          this.snackBar.open(
            'New product created and added successfully',
            'OK',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );

          this.showAddNewProductModal = false;
          this.loadProducts(this.selectedShop.id);
        },
        error: () => {

          this.snackBar.open(
            'Error adding product to shop',
            'Close',
            {
              duration: 4000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );

        }
      });

    },
    error: () => {

      this.snackBar.open(
        'Error creating product',
        'Close',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }
      );

    }
  });
}

  openEdit(item: any) {

  this.editingItem = item;

  this.editSellingPrice = item.selling_price;
  this.editStockCount = item.stock_count;

  this.editImage = null;

  this.showEditModal = true;

}

  saveEdit() {

  if (this.editSellingPrice === null || this.editStockCount === null) {

    this.snackBar.open(
      'Please fill all fields',
      'Close',
      { duration: 3000, panelClass: ['error-snackbar'], verticalPosition: 'top', horizontalPosition: 'right' }
    );

    return;
  }

  const mrp = this.editingItem.product.mrp;

  if (this.editSellingPrice > mrp) {

    this.snackBar.open(
      'Selling price cannot exceed MRP',
      'Close',
      { duration: 3000, panelClass: ['error-snackbar'], verticalPosition: 'top', horizontalPosition: 'right' }
    );

    return;
  }

  if (this.editSellingPrice < 0 || this.editStockCount < 0) {

    this.snackBar.open(
      'Values must be positive',
      'Close',
      { duration: 3000, panelClass: ['error-snackbar'], verticalPosition: 'top', horizontalPosition: 'right' }
    );

    return;
  }


  /* UPDATE INVENTORY */

  this.http.patch(
    `${this.baseUrl}/inventory/${this.editingItem.id}/`,
    {
      selling_price: this.editSellingPrice,
      stock_count: this.editStockCount
    }
  ).subscribe({
    next: () => {

      /* UPDATE PRODUCT IMAGE (optional) */

      if (this.editImage) {

        const formData = new FormData();
        formData.append('image', this.editImage);

        this.http.patch(
          `${this.baseUrl}/products/${this.editingItem.product.id}/`,
          formData
        ).subscribe(() => {

          this.finishEdit();

        });

      } else {

        this.finishEdit();

      }

    }
  });

}
finishEdit() {

  this.snackBar.open(
    'Product updated successfully',
    'OK',
    {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    }
  );

  this.showEditModal = false;

  this.loadProducts(this.selectedShop.id);

}


 deleteItem(id: number) {

  const dialogRef = this.dialog.open(ConfirmDeleteDialog);

  dialogRef.afterClosed().subscribe(result => {

    if (!result) return;

    this.http.delete(`${this.baseUrl}/inventory/${id}/`)
      .subscribe({
        next: () => {

          this.snackBar.open(
            'Product removed successfully',
            'OK',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );

          this.loadProducts(this.selectedShop.id);
        },
        error: () => {

          this.snackBar.open(
            'Error deleting product',
            'Close',
            {
              duration: 4000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );

        }
      });

  });
}
}