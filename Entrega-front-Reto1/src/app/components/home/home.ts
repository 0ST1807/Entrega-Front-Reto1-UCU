import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Person, PersonPayload } from '../../models/person';
import { PersonService } from '../../services/person.service';
import { UserService } from '../../services/user.service';

type PersonFormShape = {
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  edad: FormControl<number | null>;
  email: FormControl<string | null>;
  telefono: FormControl<string | null>;
  ciudad: FormControl<string | null>;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSortModule,
    MatProgressBarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit {
  protected readonly displayedColumns = [
    'nombre',
    'apellido',
    'edad',
    'email',
    'telefono',
    'ciudad',
    'actions'
  ];

  protected readonly dataSource = new MatTableDataSource<Person>([]);
  protected readonly form = new FormGroup<PersonFormShape>({
    nombre: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    apellido: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    edad: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0), Validators.max(120)]
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email]
    }),
    telefono: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(20)]
    }),
    ciudad: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(50)]
    })
  });

  protected isLoading = false;
  protected isSaving = false;
  protected editingPerson: Person | null = null;

  @ViewChild(MatSort) private sort!: MatSort;

  constructor(
    private readonly personService: PersonService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  protected get currentUser(): string | null {
    return this.userService.getCurrentUser();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.edad === null) {
      return;
    }

    const payload: PersonPayload = {
      nombre: value.nombre?.trim() ?? '',
      apellido: value.apellido?.trim() ?? '',
      edad: value.edad,
      email: value.email?.trim() ?? '',
      telefono: value.telefono?.trim() ?? '',
      ciudad: value.ciudad?.trim() ?? ''
    };

    this.isSaving = true;

    const request$ = this.editingPerson
      ? this.personService.update(this.editingPerson.id, payload)
      : this.personService.create(payload);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.editingPerson ? 'Persona actualizada' : 'Persona agregada',
            'Cerrar',
            { duration: 2500 }
          );
          this.resetForm();
          this.loadPeople();
        },
        error: () => {
          this.snackBar.open('Ocurrió un error al guardar', 'Cerrar', { duration: 3000 });
        }
      });
  }

  protected startEdit(person: Person): void {
    this.editingPerson = person;
    this.form.patchValue({
      nombre: person.nombre,
      apellido: person.apellido,
      edad: person.edad,
      email: person.email,
      telefono: person.telefono,
      ciudad: person.ciudad
    });
  }

  protected cancelEdit(): void {
    this.resetForm();
  }

  protected delete(person: Person): void {
    this.personService.delete(person.id).subscribe({
      next: () => {
        this.snackBar.open('Persona eliminada', 'Cerrar', { duration: 2500 });
        this.loadPeople();
      },
      error: () => {
        this.snackBar.open('No fue posible eliminar el registro', 'Cerrar', { duration: 3000 });
      }
    });
  }

  protected trackById(_: number, item: Person): number {
    return item.id;
  }

  protected logout(): void {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  private loadPeople(): void {
    this.isLoading = true;
    this.personService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (people) => {
          this.dataSource.data = people;
        },
        error: () => {
          this.snackBar.open('No fue posible cargar los datos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private resetForm(): void {
    this.editingPerson = null;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
