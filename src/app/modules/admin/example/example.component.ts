import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent {
    nombreCompleto: string = '';
      images: string[] = [
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-1.jpg',
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-4.jpg',
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-0.jpg',
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-5.jpg',
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-3.jpg',
        'https://serfinanzavirtual.bancoserfinanza.com/Personal/assets/img/BannerLogin/banner-portal-transaccional-1.jpg'
    ];
    mostrarImagen: number = 0;
    /**
     * Constructor
     */
    constructor() {
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            try {
                const usuarioObj = JSON.parse(usuario);
                this.nombreCompleto = usuarioObj.nombreCompleto || '';
            } catch (e) {
                this.nombreCompleto = '';
            }
        }
         setInterval(() => {
            this.mostrarImagen= (this.mostrarImagen + 1) % this.images.length;
        }, 5000);
    }
    
}
