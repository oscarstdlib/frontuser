import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IoptionTable, TableComponent } from 'app/shared/table/table.component';

@Component({
  selector: 'app-productos-servicios',
  standalone: true,
  imports: [CommonModule,
    MatMenuModule,
    TableComponent,
  
    RouterOutlet,
   
    MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink,],
  templateUrl: './productos-servicios.component.html',
  styleUrl: './productos-servicios.component.scss'
})
export class ProductosServiciosComponent {


  public encabezados: IoptionTable[] = [
   
    { name: "primer_nombre", text: "", typeField: 'imagen' },
    { name: "nombre_completo", text: "Nombre", typeField: 'text' },
    { name: "email", text: "Email", typeField: 'text' },
    { name: "celular", text: "Celular", typeField: 'text' },
    { name: "estatus", text: "Estatus", typeField: 'statusStyle', classTailwind: "status_clases" },


   









  ]

}
