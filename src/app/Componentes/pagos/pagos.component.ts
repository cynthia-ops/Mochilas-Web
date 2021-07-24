import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PedidoCarrito, Producto } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  smartPhone: any = {}
  closeResult: string;

  usuario: any;
  pedidos: PedidoCarrito;
  articulos: any[];
  total: number;
  cantidad: number;
  carrito: any = {}
  pagado: boolean = true;

  public isMenuCollapsed = true;
  public isCollapsed = true;


  public user$: Observable<any> = this.authServ.afServ.user;
  vacio: any;


  constructor(
    private modalService: NgbModal,
    private authServ: AuthService,
    private router: Router,
    private carritoServ: CarritoService,
    private firebaseServ: FirebaseService
  ) { }

  ngOnInit(): void {
    // this.firebaseServ.$getObjecjtSorce.subscribe(data => this.smartPhone = data).unsubscribe();
    // console.log(this.smartPhone)
    this.cargarCarrito();
    this.authServ.getUserCurrent().subscribe(user => {
      if (user) {
        console.log(user.displayName);
      } else {
        console.log("No estas logueado");
      }
    });
  }

  comprar() {
    if (!this.pedidos.producto.length) {
      this.vacio = true;
      return
    }
    this.pedidos.precioTotal = this.total
    this.pedidos.estado = "Empacando"
    this.pedidos.id = this.firebaseServ.getId();
    const uid = this.carritoServ.getUid();
    const path = "Usuarios/" + uid + "/Pedidos"
    this.firebaseServ.crearDoc(path, this.pedidos, this.pedidos.id).then(() => {
      this.carritoServ.clearCarrito();
      console.log("Guardado con exito");
      this.router.navigate(['Pedidos'])
      this.carrito = null

    })
    console.log("comprar-> ", this.pedidos, uid)

  }

  cargarCarrito() {
    this.carritoServ.getCarrito().subscribe(resp => {
      if (!resp.producto.length) {
        this.vacio = true
        console.log("Esta vacio");
        
      } else {
        this.vacio = false
        this.pedidos = resp
        this.articulos = this.pedidos.producto
        this.getCantidad();
        this.getTotat();
        console.log("Nooooo Esta vacio -> ", this.articulos);
      }
    })
  }

  add(producto: Producto) {
    this.cargarCarrito();
    this.carritoServ.addProducto(producto);

  }

  delete(producto: Producto) {
    this.carritoServ.removeProducto(producto);
    this.cargarCarrito();
  }

  getTotat() {
    this.total = 0
    this.pedidos.producto.forEach(producto => {
      this.total = ((producto.producto.precio) * producto.cantidad) + this.total;
    });
    this.pedidos.precioTotal = this.total
  }

  getCantidad() {
    this.cantidad = 0
    this.pedidos.producto.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad
    });
  }

  nuevoPago(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cerrar() {
    this.modalService.dismissAll();
  }

  validarPago() {
    this.pagado = false;
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
