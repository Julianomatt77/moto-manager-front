import {Component, ViewChild} from '@angular/core';
import {User} from "../../models/User";
import {StorageService} from "../../services/storage/storage.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EntretiensService} from "../../services/entretiens/entretiens.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {DepenseFormComponent} from "../../form/depense-form/depense-form.component";
import {CommonModule} from "@angular/common";
import {EntretienFormComponent} from "../../form/entretien-form/entretien-form.component";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-entretien',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  templateUrl: './entretien.component.html',
  styleUrl: './entretien.component.css'
})
export class EntretienComponent {
  entretiens: any[] = [];
  user: User;
  isLoading = true;
  error: string;
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;


  length = 50;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];
  pageEvent: PageEvent;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: any;

  constructor(private entretiensService: EntretiensService, private storageService: StorageService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getAllEntretiens();
  }

  /***************  DISPLAY *****************/
  getAllEntretiens(){

    this.entretiensService.getEntretiens().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.entretiens = data;

        this.dataSource = new MatTableDataSource<Element>(data);
        this.dataSource.paginator = this.paginator;
        this.length = data.length;
        this.iterator();
        // console.log(this.entretiens)
      },
      error: (err) => {
        this.error = err.error.message
      }
    })

  }

  /*************** CRUD *******************/
  addEntretien() {

    this.dialog
      .open(EntretienFormComponent, {
        data: {
          addOrEdit: 'add',
        },
        width: '80vw',
        height: '75vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllEntretiens();
      });

  }

  editEntretien(entretien: any){

    this.dialog
      .open(EntretienFormComponent, {
        data: {
          entretien: entretien,
          addOrEdit: 'edit',
        },
        width: '80vw',
        height: '75vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllEntretiens();
      });

  }

  openConfirmation(entretien: any) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Etes vous sûr de vouloir supprimer cet entretien ?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntretien(entretien);
      }
    });
  }

  deleteEntretien(entretien: any){

    this.entretiensService.deleteEntretien(entretien.id).subscribe(()=>{
      this.isLoading = true;
      this.getAllEntretiens()
    })

  }
  /****************************************/
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;

    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.entretiens.slice(start, end);
    this.dataSource = part;
  }
}
