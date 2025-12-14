import { Component, OnInit } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Person, PersonPayload } from '../../models/person';
import { PersonService } from '../../services/person.service';
import { UserService } from '../../services/user.service';

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
    MatProgressBarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
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
  protected readonly form = new FormGroup({
    nombre: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(30)]
    }),
    apellido: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(30)]
    }),
    edad: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0), Validators.max(100)]
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email]
    }),
    telefono: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(20)]
    }),
    ciudad: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(20)]
    })
  });

  protected isLoading = false;
  protected isSaving = false;
  protected editingPerson: Person | null = null;

  constructor(
    private readonly personService: PersonService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar, //mensaje "flotante"
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue(); //obtiene todos los valores del formulario
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

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open(
          this.editingPerson ? 'Member updated' : 'Member added',
          'Close',
          { duration: 2500 }
        );
        this.resetForm();
        this.loadMembers();
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('An error occurred while saving', 'Close', { duration: 3000 });
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
        this.snackBar.open('Member deleted', 'Close', { duration: 2500 });
        this.loadMembers();
      },
      error: () => {
        this.snackBar.open('Unable to delete the record', 'Close', { duration: 3000 });
      }
    });
  }

  protected logout(): void {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  private loadMembers(): void {
    this.isLoading = true;
    this.personService.getAll().subscribe({
      next: (people) => {
        this.isLoading = false;
        this.dataSource.data = people;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Unable to load data', 'Close', { duration: 3000 });
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
