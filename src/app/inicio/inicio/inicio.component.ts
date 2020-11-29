import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CorreoService } from '../../servicios/correo.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  @ViewChild('menuMoviles', {static:  true}) menuMoviles: ElementRef<HTMLElement>;
  @ViewChild('navMovil', {static:  true}) navMovil: ElementRef<HTMLElement>;
  @ViewChild('divSlider', {static:  true}) divSliders: ElementRef<HTMLElement>;
  @ViewChild('loadgin', {static:  true}) loadgin: ElementRef<HTMLElement>;
  bandera = true;
  banderaLoader = false;
  sliders: any[];
  contadorSlider = 0;
  anio: any;
  nombre: string;
  correo: string;
  mensaje: string;
  forma: FormGroup;

  // tslint:disable-next-line: quotemark
  patternCorreo = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$";

  banderaNombre: boolean;
  banderaCorreo: boolean;
  banderaMensaje: boolean;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private correoService: CorreoService
  ) { }

  ngOnInit(): void {

    // this.cargarSliders();
    // this.animacionSlider();
    this.crearFormulario();

    const date = new Date();
    this.anio = date.getFullYear();
  }

  crearFormulario(): any {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      // tslint:disable-next-line: quotemark
      correo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(this.patternCorreo)]],
      mensaje: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]]
    });
  }

  toggleMenu(e): any {
    const menuMoviles = this.menuMoviles.nativeElement;
    const navMovil = this.navMovil.nativeElement;

    if (this.bandera === false) {
      navMovil.style.display = 'none';
      this.bandera = true;
    } else {
      navMovil.style.display = 'flex';
      navMovil.classList.add('animate__bounceInDown');
      this.bandera = false;
    }
  }

  enviarMensaje(): any {
    // console.log(this.forma)
    const nombre = this.forma.controls.nombre.status;
    const correo = this.forma.controls.correo.status;
    const mensaje = this.forma.controls.mensaje.status;

    if (this.forma.status === 'INVALID') {

      // caso nombre
      if (nombre === 'INVALID') {
        this.banderaNombre = false;
      } else {
        this.banderaNombre = true;
      }
      // caso correo
      if (correo === 'INVALID') {
        this.banderaCorreo = false;
      } else {
        this.banderaCorreo = true;
      }
      // caso mensaje
      if (mensaje === 'INVALID') {
        this.banderaMensaje = false;
      } else {
        this.banderaMensaje = true;
      }
    } else if (this.forma.status === 'VALID') {
      const name = this.forma.controls.nombre.value;
      const message = this.forma.controls.mensaje.value;
      const email = this.forma.controls.correo.value;

      const data = new FormData();

      data.append('nombre', name);
      data.append('correo', email);
      data.append('mensaje', message);

      const anchoDiv = window.innerHeight;
      const offSet = window.scrollY;
      const body = document.body;

      body.style.overflowY = 'hidden';

      // loading
      const loader = this.loadgin.nativeElement;
      loader.style.position = 'absolute';
      loader.style.backgroundColor = 'rgba(226, 226, 226, 0.3)';
      loader.style.width = '100%';
      loader.style.height = `${anchoDiv}px`;
      loader.style.top = `${offSet}px`;
      loader.style.display = 'flex';
      loader.style.justifyContent = 'center';
      loader.style.alignItems = 'center';

      this.correoService.enviarCorreo(data).subscribe((resp: any) => {
        if (resp.ok === true) {
          loader.style.display = 'none';
          body.style.overflow = 'auto';
          Swal.fire(
            'Mensaje',
            'Correo enviado, muy pronto te contactaremos',
            'info'
          );
          this.forma.reset();
        } else {
          loader.style.display = 'none';
          Swal.fire(
            'Mensaje',
            'No se pudo enviar el correo, intentelo más tarde',
            'error'
          );
        }
      });
    }
  }

  desplazarInicio(elemento: HTMLHtmlElement): any {
    window.scrollTo(0, 0);
  }

  desplazarSobre(elemento: HTMLHtmlElement): any {
    const heightElemento = elemento.clientHeight;
    window.scrollTo(0, heightElemento);
  }
  desplazarContacto(elemento1: HTMLHtmlElement, elemento2: HTMLHtmlElement): any {
    const heightElemento1 = elemento1.clientHeight;
    const heightElemento2 = elemento2.clientHeight;

    const totalHeight = heightElemento1 + heightElemento2;
    window.scrollTo(0, totalHeight);
  }
}
