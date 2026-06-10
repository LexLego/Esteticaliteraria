function cambiarSala(idSala, boton) {
    const salas = document.querySelectorAll('.sala');
    const botones = document.querySelectorAll('.boton-sala');
    
    salas.forEach(sala => sala.classList.remove('activa'));
    botones.forEach(btn => btn.classList.remove('activa'));
    
    document.getElementById(idSala).classList.add('activa');
    boton.classList.add('activa');
}

let audioIniciado = false;
let intervaloSubtitulos;
let archivoAudio = new Audio('audioguia_organo_expanso.mp3');

// Mapeo de tiempos para sincronizar subtítulos con el audio
const sincronizacionAudio = [
    { tiempo: 0, texto: "Bienvenido a Cartografía del Órgano Expanso. No busque una cronología; habite la simultaneidad del pálpito." },
    { tiempo: 8, texto: "Deténgase ante la Vitrina de la Caverna. El cuchillo de piedra fue la primera llave de entrada a la carne." },
    { tiempo: 20, texto: "Ha ingresado al teatro anatómico del siglo XVII. Aquí el doctor William Harvey intenta convencerlo de que el corazón es una máquina." },
    { tiempo: 35, texto: "El aire aquí es gélido, escaso. Se encuentra en el habitáculo orbital, donde el moho primitivo devora los circuitos cibernéticos." },
    { tiempo: 50, texto: "Al salir de la muestra, el latido que percibe es el mismo que habitó la piedra y el metal. Gracias por su tránsito." }
];

// Sincronización de subtítulos durante la reproducción
archivoAudio.addEventListener('timeupdate', () => {
    const tiempoActual = archivoAudio.currentTime;
    const cajaSubtitulos = document.getElementById('subtitulos');
    
    for (let i = sincronizacionAudio.length - 1; i >= 0; i--) {
        if (tiempoActual >= sincronizacionAudio[i].tiempo) {
            cajaSubtitulos.innerText = sincronizacionAudio[i].texto;
            break;
        }
    }
});

// Finalización automática
archivoAudio.addEventListener('ended', () => {
    const boton = document.getElementById('botonAudio');
    const cajaSubtitulos = document.getElementById('subtitulos');
    boton.innerText = "Iniciar Audio-Guía";
    cajaSubtitulos.innerText = "Fin de la audio-guía.";
    audioIniciado = false;
});

function reproducirAudioSimulado() {
    const boton = document.getElementById('botonAudio');
    const cajaSubtitulos = document.getElementById('subtitulos');
    
    if (!audioIniciado) {
        audioIniciado = true;
        boton.innerText = "Detener Audio-Guía";
        
        archivoAudio.play().catch(error => {
            console.log("Nota: No se encontró archivo de audio. Usando subtítulos sincronizados.");
            // Fallback: mostrar subtítulos sin audio
            let contador = 0;
            cajaSubtitulos.innerText = sincronizacionAudio[contador].texto;
            
            intervaloSubtitulos = setInterval(() => {
                contador++;
                if (contador < sincronizacionAudio.length) {
                    cajaSubtitulos.innerText = sincronizacionAudio[contador].texto;
                } else {
                    clearInterval(intervaloSubtitulos);
                    cajaSubtitulos.innerText = "Fin de la audio-guía.";
                    boton.innerText = "Iniciar Audio-Guía";
                    audioIniciado = false;
                }
            }, 6000);
        });
    } else {
        audioIniciado = false;
        archivoAudio.pause();
        archivoAudio.currentTime = 0;
        boton.innerText = "Iniciar Audio-Guía";
        cajaSubtitulos.innerText = "Audio-guía pausada.";
        clearInterval(intervaloSubtitulos);
    }
}