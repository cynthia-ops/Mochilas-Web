import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {

  numero=0

  constructor() { }

  ngOnInit(): void {
  }


  setValor(a:any){
    this.numero=a;
  }

}
