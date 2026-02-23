import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shops.html',
  styleUrls: ['./shops.css']
})
export class Shops implements OnInit {

  shops: any[] = [];

  showForm = false;
  isEditing = false;
  editingId: number | null = null;

  selectedFile: File | null = null;

  formData: any = {
    name: '',
    description: ''
  };

  constructor(
    private shopService: ShopService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public auth: Auth
    
  ) {}

  ngOnInit() {
    this.loadShops();
  }


  loadShops() {
    this.shopService.getShops().subscribe({
      next: (data: any[]) => {
        this.shops = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log("Error loading shops:", err.error)
    });
  }

  goToProducts(shopId: number) {
    this.router.navigate(['/products', shopId]);
  }


  openAdd() {
    this.showForm = true;
    this.isEditing = false;
    this.editingId = null;
    this.selectedFile = null;

    this.formData = {
      name: '',
      description: ''
    };
  }


  openEdit(shop: any) {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = shop.id;
    this.selectedFile = null;

    this.formData = {
      name: shop.name,
      description: shop.description
    };
  }
  


deleteShop(id: number) {
    if (confirm("Are you sure you want to delete this shop?")) {
      this.shopService.deleteShop(id).subscribe({
        next: () => this.loadShops(),
        error: (err) => console.error(err)
      });
    }
  }

  


  cancel() {
    this.showForm = false;
    this.selectedFile = null;
  }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveShop() {

    const formData = new FormData();

    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editingId) {

      this.shopService.updateShop(this.editingId, formData)
        .subscribe({
          next: () => {
            this.loadShops();
            this.showForm = false;
          },
          error: (err) => console.error(err)
        });

    } else {

      this.shopService.addShop(formData)
        .subscribe({
          next: () => {
            this.loadShops();
            this.showForm = false;
          },
          error: (err) => console.error(err)
        });
    }
  }
}