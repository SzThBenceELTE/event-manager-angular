import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/person/person.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PersonModel } from '../../../models/person.model';
import { RoleTypeEnum } from '../../../models/enums/role-type.enum';
import { GroupTypeEnum } from '../../../models/enums/group-type.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-user-list',
  templateUrl: './person-list.component.html',
//   styleUrls: ['./user-list.component.css',],
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmationDialogComponent,
    MatProgressSpinnerModule,
  ],
})
export class PersonListComponent implements OnInit {
  public RoleTypeEnum = RoleTypeEnum;
  public GroupTypeEnum = GroupTypeEnum;

  people: PersonModel[] = [];
  searchTerm: string = '';
  filteredPeople: PersonModel[] = [];
  paginatedPeople: PersonModel[] = [];

  roles: RoleTypeEnum[] = Object.values(RoleTypeEnum);
  groups: GroupTypeEnum[] = Object.values(GroupTypeEnum);

  selectedRole: RoleTypeEnum | null = null;
  selectedGroup: GroupTypeEnum | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  isDeveloper: boolean = false;

  loading: boolean = true;


  constructor(private personService: PersonService,
     private router: Router, 
     private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService : AuthService) {}

  ngOnInit() {
    this.fetchPeople();
    this.checkUserRole();
    this.totalPages = Math.ceil(this.people.length / this.itemsPerPage);
  }

  fetchPeople(): void {
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.people = data;
        this.filteredPeople = data;
        this.calculatePagination();
        this.checkIfLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching people:', err);
        this.snackBar.open('Failed to load people.', 'Close', {
          duration: 3000,
        });
        this.checkIfLoadingComplete();
      }
    });
  }

  checkUserRole(): void {
    this.authService.currentPerson$.subscribe((person: PersonModel | null) => {
      console.log('Current person:', person);
      if (person?.role === 'DEVELOPER') {
        this.isDeveloper = true;
      } else {
        this.isDeveloper = false;
      }
      this.checkIfLoadingComplete();
    });
  }

  private loadingTasksCompleted: boolean = false;

  private checkIfLoadingComplete(): void {
    if (!this.loadingTasksCompleted) {
      this.loadingTasksCompleted = true;
      this.loading = false;
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const role = this.selectedRole;
    
    //check if group is aplicable to the role
    if (role === RoleTypeEnum.MANAGER){
      this.selectedGroup = null;
    }

    const group = this.selectedGroup;

    this.filteredPeople = this.people.filter((person) => {
      const fullName = `${person.firstName} ${person.surname}`.toLowerCase().includes(term);
      const roleMatch = role ? person.role === role : true;
      const groupMatch = group ? person.group === group : true;
      return fullName && roleMatch && groupMatch;
    });

    this.currentPage = 1;
    this.calculatePagination();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = null;
    this.selectedGroup = null;
    this.filteredPeople = this.people;
  }

  createPerson() {
    this.router.navigate(['/people/create']);
  }

  editPerson(id: number) {
    this.router.navigate([`/people/edit/${id}`]);
  }

  deletePerson(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this person?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.personService.deletePerson(id).subscribe({
          next: (response) => {
            this.snackBar.open('Person deleted successfully!', 'Close', {
              duration: 3000,
            });
            this.people = this.people.filter((person) => person.id !== id);
            this.filteredPeople = this.filteredPeople.filter(
              (person) => person.id !== id
            );
            this.onSearch(); // Re-apply filters after deletion
          },
          error: (err) => {
            console.error('Person deletion failed', err);
            this.snackBar.open('Failed to delete person.', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  // Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPeople.length / this.itemsPerPage);
    this.paginatedPeople = this.filteredPeople.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginatedPeople = this.filteredPeople.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  




  

}