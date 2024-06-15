import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastSend, ToastService } from '../../services/share/toast.service';
import { CommonModule } from '@angular/common';
import { ToastState } from '../../enums/toast.state';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  toasts: Toast[] = [];
  private toastId: number = 0;

  toastState = ToastState;

  constructor(private toastService : ToastService){
  }

  ngOnInit(): void {
    this.toastService.toastMess$.subscribe({ 
      next: (toast : ToastSend | null) => {
        if(toast != null)
          this.showToast( toast.state ,toast.title, toast.message );
      }
    });
  }

  showToast(state : ToastState, title: string, message: string): void {

    const toast: Toast = { title, message, state , id: this.toastId++ };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t.id !== toast.id);
  }

}

interface Toast {
  title: string;
  message: string;
  state : ToastState;
  id: number;
}