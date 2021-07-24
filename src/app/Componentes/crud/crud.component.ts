import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, pipe, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  collection = { data: [] }
  mochilaForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  config: any
  closeResult = "";
  admin:any

  //
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlFInd: Subscription;

  constructor(
    public fb: FormBuilder,
    private modalService: NgbModal,
    private fibaseService: FirebaseService,
    private readonly storage: AngularFireStorage,
    private router:Router
    ) { }

  onUpload(e) {
    /* console.log(e.target.files[0]); */
    /* const id = Math.random().toString(36).substring(2); */
    const file = e.target.files[0];
    const filePath = `img/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(
        () => this.urlImage = ref.getDownloadURL())).subscribe();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  ngOnInit(): void {
    this.fibaseService.$getObjecjtSorce.subscribe(resp => this.admin = resp).unsubscribe();
    console.log('es admin? ', this.admin);

    if (this.admin != true) {
      this.router.navigate(['Inicio'])
    }

    this.idFirebaseUpdate = "";

    this.config = {
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    this.mochilaForm = this.fb.group({
      tiposMochila: ['', Validators.required],
      descripcion: ['', Validators.required],
      genero: ['', Validators.required],
      color: ['', Validators.required],
      precio: ['', Validators.required],
      medidas: ['', Validators.required],
      material: ['', Validators.required],
      cantidad: ['', Validators.required],
      calificacion: ['', Validators.required],
      url: ['', Validators.required]
    });

    this.fibaseService.getMochila().subscribe(
      resp => {
        this.collection.data = resp.map((e: any) => {
          return {
            tiposMochila: e.payload.doc.data().tiposMochila,
            genero: e.payload.doc.data().genero,
            descripcion: e.payload.doc.data().descripcion,
            color: e.payload.doc.data().color,
            precio: e.payload.doc.data().precio,
            medidas: e.payload.doc.data().medidas,
            material: e.payload.doc.data().material,
            cantidad: e.payload.doc.data().cantidad,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id
          }
        })
      },
      error => {
        console.error(error);
      }
    );
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.fibaseService.eliminarMochila(item.idFirebase)
/*   this.collection.data.pop(item);
 */};

  guardar(url: string) {
    this.mochilaForm.value.url = url;
    this.fibaseService.createMochila(this.mochilaForm.value).
      then(resp => {
        this.mochilaForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })

  };

  actualizar(url: string) {
    if (this.idFirebaseUpdate != null) {
      this.mochilaForm.value.url = url;
      this.fibaseService.updateMochila(this.idFirebaseUpdate, this.mochilaForm.value).then(resp => {
        this.mochilaForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
        .catch(error => {
          console.error(error);

        });
    }
  }


  //esto es codigo del modal
  editarMaterial(content, item: any) {
    this.updSave = true;
    //llenando formulario con los datos a editar
    this.mochilaForm.setValue({
      tiposMochila: item.tiposMochila,
      genero: item.genero,
      descripcion: item.descripcion,
      color: item.color,
      precio: item.precio,
      medidas: item.medidas,
      material: item.material,
      cantidad: item.cantidad,
      calificacion: item.calificacion,
      url: item.url
    });
    this.idFirebaseUpdate = item.idFirebase;
    console.log(this.idFirebaseUpdate)    //**//
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  nuevoMaterial(content) {
    this.updSave = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}