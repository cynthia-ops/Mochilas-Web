import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoCarrito, Producto } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  data: any[];
  alert = {
    type: 'success',
    message: 'This is an success alert',
  };


  mochila: any = {}
  carrito: any = {}
  producto: Producto;

  usuario: any;
  pedidos: PedidoCarrito;
  articulos: any[];
  total: number;
  cantidad: number;

  idFirebase: String;
  toast = false

  toastHide() {
    this.toast = false;
  }

  public user$: Observable<any> = this.authServ.afServ.user;
  vacio: any;

  lista: string[] = ["MXN", "USD", "EUR"];
  dolar: number;
  euro: number;
  mxn: number;
  precio: number;
  opt: any
  constructor(
    private firebaseServ: FirebaseService,
    private router: Router,
    private carritoServ: CarritoService,
    private authServ: AuthService
  ) { }


  ngOnInit(): void {
    this.cargarCarrito();
    this.getId();

    this.firebaseServ.$getObjecjtSorce.subscribe(data => this.mochila = data).unsubscribe();
    // this.firebaseServ.$getObjecjtSorce.subscribe(data =>  = data).unsubscribe();

    this.precio = this.mochila.precio;
    // console.log("Este es el precio original ", this.precio);
    // console.log("mochila recibida", this.mochila);


  }



  cargarCarrito() {
    this.carritoServ.getCarrito().subscribe(resp => {
      if (!resp.producto.length) {
        this.vacio = true
        // console.log("Esta vacio");

      } else {
        this.vacio = false
        this.pedidos = resp
        this.articulos = this.pedidos.producto
        this.getCantidad();
        this.getTotat();
        // console.log("Nooooo Esta vacio");
      }
    })
  }

  getId() {
    this.firebaseServ.getMochila().subscribe(
      resp => {
        this.data = resp.map((e: any) => {
          return {
            idFirebase: e.payload.doc.id,
          }
        })
        // console.log('cargando ids ', this.data[5]);
      }
    )

  }

  agregarCarrito(producto: any) {

    if (producto != undefined) {
      this.producto = {
        descripcion: producto.descripcion,
        material: producto.material,
        color: producto.color,
        medidas: producto.medidas,
        precio: producto.precio,
        cantidad: producto.cantidad,
        calificacion: producto.calificacion,
        tiposMochila: producto.tiposMochila,
        genero: producto.genero,
        url: producto.url,
        idFirebase: producto.idFirebase
      }
      this.toast = true
      // console.log('cargando ids ', this.data[5]);
      // console.log('agregar carrito->>>',this.producto);
      this.carritoServ.addProducto(this.producto);
      setTimeout(() => {
        this.toast = false
        console.log('estamos en el delay');

      }, 5000)
    } else {
      this.router.navigate['login'];
    }

    // this.carritoServ.addProducto(smartphone)

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

  comprar(prod:any) {
    this.agregarCarrito(prod);
    this.router.navigate(['Pagos'])
  }

  verMochila(item: any) {
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['Pagos', item.marca])
  }

  convert(obj: any) {
    if (!'USD'.indexOf(this.opt)) {
      this.dolar = this.precio / 19.87;
      obj.precio = this.dolar;
    } else
      if (!'MXN'.indexOf(this.opt)) {
        this.mxn = this.precio;
        obj.precio = this.mxn;
      } else
        if (!'EUR'.indexOf(this.opt)) {
          this.euro = this.precio / 20.03;
          obj.precio = this.euro;
        }


    // obj.precio=this.monto
    // console.log('este es el monto',obj.precio)
  }

}
