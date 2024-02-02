import {Component, ViewChild} from '@angular/core';
import {DepensesService} from "../../services/depenses/depenses.service";
import {StorageService} from "../../services/storage/storage.service";
import {User} from "../../models/User";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DepenseFormComponent} from "../../form/depense-form/depense-form.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {UploadPopupComponent} from "../../form/upload-popup/upload-popup.component";

@Component({
  selector: 'app-depenses',
  standalone: true,
    imports: [NgForOf, NgIf, DatePipe, MatPaginatorModule, DecimalPipe],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css',
})
export class DepensesComponent {

  depenses: any[] = [];
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
  depensesTotal = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: any;

  constructor(private depensesService: DepensesService, private storageService: StorageService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getAllDepenses();
  }

  /***************  DISPLAY *****************/
  getAllDepenses(){
    this.depensesService.getDepenses().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.depenses = data;

        this.dataSource = new MatTableDataSource<Element>(data);
        this.dataSource.paginator = this.paginator;
        this.length = data.length;
        this.iterator();

        this.depenses.forEach((depense: any) => {
          this.depensesTotal += depense.montant;
        })

        // const datePipe = new DatePipe('en-US');
        // this.depenses.forEach((depense) => {
        //   depense.date = datePipe.transform(depense.date, 'dd/MM/yyyy ');
        // });

      },
      error: (err) => {
        this.error = err.error.message
      }
    })
  }

  /*************** CRUD *******************/
  addDepense() {
    this.dialog
      .open(DepenseFormComponent, {
        data: {
          addOrEdit: 'add',
        },
        width: '80vw',
        height: '85vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllDepenses();
      });
  }

  editDepense(depense: any){
    this.dialog
      .open(DepenseFormComponent, {
        data: {
          depense: depense,
          addOrEdit: 'edit',
        },
        width: '80vw',
        height: '85vh',
      })
      .afterClosed()
      .subscribe(() => {
        this.getAllDepenses();
      });
  }

  openConfirmation(depense: any) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Etes vous sûr de vouloir supprimer cette opération ?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDepense(depense);
      }
    });
  }

  deleteDepense(depense: any){
    this.depensesService.deleteDepense(depense.id).subscribe(()=>{
      this.isLoading = true;
      this.getAllDepenses()
    })
  }

  /****************** PAGINATOR **********************/

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
    const part = this.depenses.slice(start, end);
    this.dataSource = part;
  }

  /****************** UPLOAD **********************/
  openUploadDialog(){
    this.dialog.open(UploadPopupComponent, {
      data: {
        type: 'depense'
      },
      width: '80vw',
      height: '50vh'
    })
      .afterClosed()
      .subscribe(() => {
        this.getAllDepenses();
      });
  }
}
