import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  form: FormGroup;
  paises: string[] = [];
  filteredPaises!: Observable<string[]>;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      pais: ['', Validators.required],
      tipoUsuario: ['', Validators.required],
      activo: [true]
    });
    this.userService.getContries().subscribe((paises: string[]) => {
      this.paises = paises;

      // Importante: aplicar el filtro SOLO DESPUÉS de tener la lista
      this.filteredPaises = this.form.get('pais')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });

    // Si viene data para editar, llenamos el formulario (omitimos password si no se quiere cambiar)
    if (this.data) {
      this.form.patchValue({
        nombreCompleto: this.data.nombreCompleto,
        email: this.data.email,
        pais: this.data.pais,
        tipoUsuario: this.data.tipoUsuario,
        activo: this.data.activo
      });

      // Si no quieres que edite el email:
      this.form.get('email')?.disable();

      // Si no quieres que edite la contraseña:
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.paises.filter(pais => pais.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    const payload = this.form.getRawValue(); // para incluir campos deshabilitados como el email
    payload.activo = this.form.value.activo=='true'?true:false; // Aseguramos que sea booleano
    payload.permisoIds = [1,2,3,4,5,6,7,8,9]; // Si necesitas manejar permisos, puedes inicializarlo aquí
    if (this.form.valid) {


      if (this.data) {
        // EDICIÓN
        this.userService.update(this.data.id, payload).subscribe(() => {
          const dialogRef = this._fuseConfirmationService.open(
            {
              "title": "Completado",
              "message": "Ususario Actualizado con éxito: " + this.form.value.nombreCompleto,
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
          this.dialogRef.close(true);
        });
      } else {
        // CREACIÓN
        this.userService.post(payload).subscribe(() => {
          const dialogRef = this._fuseConfirmationService.open(
            {
              "title": "Completado",
              "message": "Ususario creado con éxito: " + this.form.value.nombreCompleto,
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
          this.dialogRef.close(true);
        });
      }
    }
  }


  onCancel() {
    this.dialogRef.close();
  }
}
