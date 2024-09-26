import {ChangeDetectorRef, Component, inject, input, ViewChild} from '@angular/core';
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
import {ExportService} from "../../services/export/export.service";
import {Moto} from "../../models/Moto";
import {MotoService} from "../../services/moto/moto.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {DepenseType} from "../../models/DepenseType";
import {DepensesTypeService} from "../../services/depensesType/depenses-type.service";

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [NgForOf, NgIf, DatePipe, MatPaginatorModule, DecimalPipe, ReactiveFormsModule, MatFormFieldModule, MatOptionModule, MatInputModule, MatSelectModule],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css',
})
export class DepensesComponent {

  depenses: any[] = [];
  displayedDepenses: any[] = [];
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
  motos: Moto[] = [];
  depensesTypes: DepenseType[] = [];

  formMotoFiltered!: FormGroup;
  selectedMoto: string = "";

  formYearFiltered!: FormGroup;
  selectedYear: number;
  availableYears: number[] = []

  formTypeFiltered!: FormGroup;
  selectedType: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: any;

  motoService = inject(MotoService);
  depensesService = inject(DepensesService);
  depensesTypesService = inject(DepensesTypeService);
  storageService = inject(StorageService);
  dialog = inject(MatDialog);
  exportService = inject(ExportService);
  fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.user = this.storageService.getUser();

    this.getAllMotos()
    this.getAllDepensesTypes()
    this.getAvailableYears()

    this.formMotoFiltered = this.fb.group({
      moto: this.selectedMoto
    });

    this.formYearFiltered = this.fb.group({
      year: this.selectedYear
    });

    this.formTypeFiltered = this.fb.group({
      type: this.selectedType
    });

    this.getAllDepenses();
  }

  /***************  DISPLAY *****************/
  getAllDepenses(){
    this.depensesService.getDepenses().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.depenses = data;

        this.updatePaginator(this.depenses);

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

  updatePaginator(data: any){
    this.displayedDepenses = data;

    this.depensesTotal = 0;
    this.displayedDepenses.forEach((depense: any) => {
      this.depensesTotal += depense.montant;
    })

    this.dataSource = new MatTableDataSource<Element>(this.displayedDepenses);
    this.dataSource.paginator = this.paginator;

    this.length = this.displayedDepenses.length;
    this.iterator();
  }

  getAllMotos(){
    this.motoService.getAllMotos().subscribe({
      next: (data) => {
        this.motos = data;
      },
      error: (err) => {
        this.error = err.error.message
      }
    });
  }

  getAvailableYears() {
    const todayYear = new Date().getFullYear();
    for (let i = 2000; i <= todayYear; i++) {
      this.availableYears.unshift(i);
    }
  }

  getAllDepensesTypes(){
    this.depensesTypesService.getDepensesTypes().subscribe({
      next: (data) => {
        this.depensesTypes = data;
        this.depensesTypes = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        this.error = err.error.message
      }
    });
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
    const part = this.displayedDepenses.slice(start, end);
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

  /****************** EXPORT **********************/
  export(){
    this.exportService.exportDepenses().subscribe(response => {
      this.exportService.handleCsvDownload(response, 'depenses');
    })
  }

  /****************** FILTERS **********************/
  onSubmitMotoFilter(){
    this.selectedMoto = this.formMotoFiltered.value.moto;
    this.filter();
  }

  onSubmitYearFilter(){
    this.selectedYear = Number(this.formYearFiltered.value.year);
    this.filter();
  }

  onSubmitTypeFilter(){
    this.selectedType = this.formTypeFiltered.value.type;
    this.filter();
  }

  filter() {
    const depensesFiltered = this.depenses.filter(depense => {
      const motoMatch = !this.selectedMoto || depense.moto.id == this.selectedMoto;
      const yearMatch = !this.selectedYear || this.selectedYear == 0 || new Date(depense.date).getFullYear() == this.selectedYear;
      const typeMatch = !this.selectedType || depense.depenseType.id == this.selectedType;
      return motoMatch && yearMatch && typeMatch;
    });

    this.updatePaginator(depensesFiltered);
  };

  resetAllFilters(){
    this.selectedMoto = "";
    this.formMotoFiltered.get('moto')?.setValue("");

    this.selectedYear = 0;
    this.formYearFiltered.get('year')?.setValue(0);

    this.selectedType = "";
    this.formTypeFiltered.get('type')?.setValue("");

    this.updatePaginator(this.depenses);
  }


}
