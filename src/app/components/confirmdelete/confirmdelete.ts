import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  template: `
    <div class="confirm-box">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this product from the shop?</p>

      <div class="actions">
        <button class="cancel" (click)="close(false)">Cancel</button>
        <button class="delete" (click)="close(true)">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-box {
      padding: 25px;
      width: 320px;
    }
    h2 {
      margin-bottom: 10px;
      font-size: 18px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .cancel {
      background: #e5e7eb;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .delete {
      background: #dc2626;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class ConfirmDeleteDialog {

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteDialog>) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}