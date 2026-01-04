import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '@shared.components/sidebar/sidebar';
import { Footer } from '@shared.components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, Sidebar, Footer],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
