import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {

  usuario: Usuario = {
    nombre: '',
    uid: '',
  }

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
  });

  constructor(
    private autServ: AuthService,
    private router: Router,
    public fireServ: FirebaseService
  ) { }

  ngOnInit(): void {
  }


  async onRegister() {
    const { email, password } = this.registerForm.value;
    const { nombre, apellidos } = this.registerForm.value;
    try {
      const user = await this.autServ.register(email, password);
      if (user) {

        user.user.updateProfile({
          displayName: nombre + ' ' + apellidos
        })


        this.usuario = {
          nombre: nombre + ' ' + apellidos,
          uid: user.user.uid
        };
        this.fireServ.crearDoc('Usuarios', this.usuario, this.usuario.uid);

        //redireccionar a:
        this.router.navigate(['Inicio']);
      }
    }
    catch (error) {
      console.log(error);

    }

  }

}
