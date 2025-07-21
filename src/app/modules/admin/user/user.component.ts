import { CommonModule, NgFor, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { IoptionTable, TableComponent } from 'app/shared/table/table.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,
    MatMenuModule,
    TableComponent,
    RouterOutlet,
    MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink,],

  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  loading = false;
  public encabezados: IoptionTable[] = [
    {
      name: 'Eliminar',
      text: 'Eliminar',
      typeField: 'function',
      callback: (data) => {

        this.deleteUser(data)

      },
      iconSGV: 'heroicons_outline:trash',
    },
    {
      name: 'Editar',
      text: 'Editar',
      typeField: 'function',
      callback: (data) => {

        this.editUser(data)

      },
      iconSGV: 'heroicons_outline:pencil',
    },
    { name: "nombreCompleto", text: "Nombre", typeField: 'text' },
    { name: "email", text: "Email", typeField: 'text' },
    { name: "pais", text: "País", typeField: 'text' },
    { name: "tipoUsuario", text: "Tipo de Usuario", typeField: 'text' },
    { name: "fechaCreacion", text: "Fecha de Creación", typeField: 'text' },
    { name: "activo", text: "Estado", typeField: 'statusStyle' },

  ]
  public listado: User[] = [];
  usuarioLogeado: User = {} as User;
  constructor(private userService: UserService, private dialog: MatDialog,
    private _authService: AuthService,
    private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit(): void {
    if (this._authService.usuarioLogeado) {
      this.usuarioLogeado = this._authService.usuarioLogeado;
      debugger
    }
    this.buscarListado();

  }

  buscarListado(): void {
    // Cargar el usuario actual al iniciar el componente
    this.userService.get().subscribe({
      next: (user) => {
        this.listado = user;
        if (this.usuarioLogeado.tipoUsuario === 'Cliente') {
          this.encabezados.splice(0, 2);
          this.listado = this.listado.filter(user => user.id === this.usuarioLogeado.id);
        }
        if (this.usuarioLogeado.tipoUsuario === 'Operador') {
          this.listado = this.listado.filter(user => user.tipoUsuario === 'Cliente');

        }
      },
      error: (err) => {
        // Manejo de errores
        console.error('Error al obtener usuario', err);
      }
    });
  }

  // Método para abrir el modal
  openCreateUserModal(): void {
    this.dialog.open(CreateUserComponent, {
      width: '500px', // Ajusta el tamaño si lo deseas
      // data: {}, // Puedes pasar datos si es necesario
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.buscarListado(); // Refrescar la lista después de cerrar el modal
    });
  }

  // ...existing code...
  editUser(row: any) {
    this.dialog.open(CreateUserComponent, {
      width: '500px', // Ajusta el tamaño si lo deseas
      data: row, // Puedes pasar datos si es necesario
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.buscarListado(); // Refrescar la lista después de cerrar el modal
    });
  }

  deleteUser(row: any) {
    const dialogRef = this._fuseConfirmationService.open(
      {
        "title": "Usuario",
        "message": "¿Esta seguro de elimminar el usuario " + row.nombreCompleto + " ?",
        "icon": {
          "show": true,
          "name": "heroicons_outline:exclamation-triangle",
          "color": "accent"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Eliminar usuario",
            "color": "primary"
          },
          "cancel": {
            "show": true,
            "label": "Cancelar"
          }
        },
        "dismissible": true
      }
    );


    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.userService.delete(row.id).subscribe(() => {
          this.buscarListado(); // Refrescar la lista después de eliminar el usuario
          const dialogRef = this._fuseConfirmationService.open(
            {
              "title": "Completado",
              "message": "Usuario eliminado con éxito " + row.nombreCompleto,
              "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "success"
              },
              "actions": {
                "confirm": {
                  "show": false,
                },
                "cancel": {
                  "show": true,
                  "label": "Aceptar"
                }
              },
              "dismissible": true
            }
          );
        }, error => {
          // Manejo de errores al eliminar el usuario
          console.error('Error al eliminar el usuario', error);
        });


        this.buscarListado();
      }
    });
  }


}
