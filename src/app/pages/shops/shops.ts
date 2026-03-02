import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShopService } from '../../services/shop';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  selectedCatalogueProductId: number | null = null;

  editingItem: any = null;
  editSellingPrice: number | null = null;
  editStockCount: number | null = null;

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
    public auth: Auth
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
    alert("Fill all fields");
    return;
  }

  const selectedProduct = this.catalogueProducts.find(
    p => p.id === this.selectedCatalogueProductId
  );

  if (this.catalogueSellingPrice > selectedProduct.mrp) {
    alert("Selling price cannot exceed MRP");
    return;
  }

  if (this.catalogueSellingPrice <= 0 ||
      this.catalogueStockCount < 0) {
    alert("Values must be positive");
    return;
  }

  this.http.post(`${this.baseUrl}/inventory/`, {
    shop: this.selectedShop.id,
    product_id: this.selectedCatalogueProductId,
    selling_price: this.catalogueSellingPrice,
    stock_count: this.catalogueStockCount
  }).subscribe(() => {

    this.showAddExistingProductModal = false;

    this.selectedCatalogueProductId = null;
    this.catalogueSellingPrice = null;
    this.catalogueStockCount = null;

    this.loadProducts(this.selectedShop.id);
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
      alert("Fill all fields");
      return;
    }

    this.http.post(`${this.baseUrl}/products/`, {
      name: this.newProductName,
      mrp: this.newProductMRP,
      weight: this.newProductWeight
    }).subscribe((product: any) => {

      this.http.post(`${this.baseUrl}/inventory/`, {
        shop: this.selectedShop.id,
        product_id: product.id,
        selling_price: this.newSellingPrice,
        stock_count: this.newStockCount
      }).subscribe(() => {

        this.showAddNewProductModal = false;
        this.loadProducts(this.selectedShop.id);
      });
    });
  }


  openEdit(item: any) {
    this.editingItem = item;
    this.editSellingPrice = item.selling_price;
    this.editStockCount = item.stock_count;
    this.showEditModal = true;
  }

  saveEdit() {

    this.http.patch(
      `${this.baseUrl}/inventory/${this.editingItem.id}/`,
      {
        selling_price: this.editSellingPrice,
        stock_count: this.editStockCount
      }
    ).subscribe(() => {
      this.showEditModal = false;
      this.loadProducts(this.selectedShop.id);
    });
  }


  deleteItem(id: number) {

    if (!confirm("Delete this product from shop?")) return;

    this.http.delete(`${this.baseUrl}/inventory/${id}/`)
      .subscribe(() => {
        this.loadProducts(this.selectedShop.id);
      });
  }
}