import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { forkJoin } from 'rxjs';
import { ShopService } from '../../services/shop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  totalShops: number = 0;
  totalProducts: number = 0;
  totalValue: number = 0;
  lowStockCount: number = 0;

  ownerName: string | null = null;

  lowStockProducts: any[] = [];

  loading = true;
  showAddShopModal = false;

  selectedShopId: number | null = null;
  selectedShopName: string | null = 'All Shops';
  shopList: any[] = [];

  dropdownOpen = false;

  shopForm: any = {
    name: '',
    description: '',
    address: ''
  };

  selectedFile: File | null = null;

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public auth: Auth,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }



  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectShop(shop: any | null) {

    if (shop === null) {
      this.selectedShopId = null;
      this.selectedShopName = 'All Shops';
      this.ownerName = null;
    } else {
      this.selectedShopId = shop.id;
      this.selectedShopName = shop.name;
      this.ownerName = shop.owner;   
    }

    this.dropdownOpen = false;
    this.onShopChange();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const clickedInside = event.target.closest('.custom-select');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      shops: this.http.get<any[]>(`${this.baseUrl}/shops/`),
      products: this.http.get<any[]>(`${this.baseUrl}/products/`)
    }).subscribe({
      next: (res) => {

        this.shopList = res.shops;

        this.totalShops = res.shops.length;
        this.totalProducts = res.products.length;

        this.loadInventoryStats();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadInventoryStats() {

    let url = `${this.baseUrl}/inventory/`;

    if (this.selectedShopId) {
      url += `?shop=${this.selectedShopId}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (inventory) => {

      

        if (this.selectedShopId) {
    
          this.totalProducts = inventory.length;
        }

        this.totalValue = inventory.reduce(
          (sum, item) => sum + (item.selling_price * item.stock_count),
          0
        );

        this.lowStockProducts = inventory.filter(
          item => item.stock_count < 5
        );

        this.lowStockCount = this.lowStockProducts.length;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onShopChange() {
    this.loading = true;
    this.loadInventoryStats();
  }



openAddShop() {
  this.showAddShopModal = true;
  this.shopForm = { name: '', description: '', address: '' };
  this.selectedFile = null;
}

closeAddShop() {
  this.showAddShopModal = false;
}

onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}

saveShop() {

  const formData = new FormData();

  formData.append('name', this.shopForm.name);
  formData.append('description', this.shopForm.description);
  formData.append('address', this.shopForm.address);

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.shopService.addShop(formData)
    .subscribe({
      next: () => {
        this.showAddShopModal = false;
        this.loadDashboardData();
      },
      error: (err) => console.error(err)
    });
}

}