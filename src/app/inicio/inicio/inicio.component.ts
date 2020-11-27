import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CorreoService } from '../../servicios/correo.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  @ViewChild('menuMoviles', {static:  true}) menuMoviles: ElementRef<HTMLElement>;
  @ViewChild('navMovil', {static:  true}) navMovil: ElementRef<HTMLElement>;
  @ViewChild('divSlider', {static:  true}) divSliders: ElementRef<HTMLElement>;
  // @ViewChild('descSlider', {static:  true}) descSlider: ElementRef<HTMLElement>;
  bandera = true;
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

    this.cargarSliders();
    this.animacionSlider();
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

  cargarSliders(): any {
    const slider = [];

    const rutaImg1 = '../../../assets/recortadas/car1.jpg';
    const rutaImg2 = '../../../assets/recortadas/car2.jpg';
    const rutaImg3 = '../../../assets/recortadas/car3.jpg';

    for (let i = 0; i < 3; i++) {

      const objetoSlider = {
        rutaImg: null,
        titulo: null,
        texto: null,
      };

      switch (i) {
        case 0:
          objetoSlider.rutaImg = rutaImg1;
          objetoSlider.titulo = 'Titulo 1';
          objetoSlider.texto = 'Texto de ejemplo 1';
          slider.push(objetoSlider);
          break;
        case 1:
          objetoSlider.rutaImg = rutaImg2;
          objetoSlider.titulo = 'Titulo 2';
          objetoSlider.texto = 'Texto de ejemplo 2';
          slider.push(objetoSlider);
          break;
        case 2:
          objetoSlider.rutaImg = rutaImg3;
          objetoSlider.titulo = 'Titulo 3';
          objetoSlider.texto = 'Texto de ejemplo 3';
          slider.push(objetoSlider);
          break;
      }
    }

    this.sliders = slider;
    // console.log(this.sliders);
  }

  animacionSlider(): any {

    let backUpSlider = [];
    const sliderIndividual = [];
    const divSliders = this.divSliders.nativeElement;
    // const descSlider = this.descSlider.nativeElement;
    let intervalo;

    intervalo = setInterval(() => {
      backUpSlider = this.sliders.splice(0, 1);
      sliderIndividual.push(backUpSlider[0]);

      if (sliderIndividual.length >= 3) {
        this.sliders = [];
        this.sliders = sliderIndividual;
        // clearInterval(intervalo);
      }
    }, 5000);

    divSliders.addEventListener('mouseover', (e) => {
      clearInterval(intervalo);
    }, false);

    divSliders.addEventListener('mouseleave', (e) => {
      intervalo = setInterval(() => {
        backUpSlider = this.sliders.splice(0, 1);
        sliderIndividual.push(backUpSlider[0]);

        if (sliderIndividual.length >= 3) {
          this.sliders = [];
          this.sliders = sliderIndividual;
          // clearInterval(intervalo);
        }
      }, 5000);
    }, false);
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
      } else {;
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

      this.correoService.enviarCorreo(data).subscribe((resp: any) => {
        console.log(resp);
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
