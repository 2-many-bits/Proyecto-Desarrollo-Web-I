# Objetos de Cursos - Documentación

## Resumen

Se han creado objetos JavaScript con la información de todos los cursos basados en las empresas encontradas en la carpeta `html/cursos`.

## Archivos Creados/Modificados

### 1. `js/cursosData.js` (NUEVO)

Este archivo contiene todos los objetos de cursos siguiendo la plantilla de `nuevoCurso`:

#### Cursos Incluidos:

1. **cursoAbaco** - Facturación Electrónica
2. **cursoApplaudo** - Desarrollo de Software y Metodologías Ágiles
3. **cursoBoxful** - Logística y E-commerce
4. **cursoFiado** - Fintech y Pagos (Buy Now, Pay Later)
5. **cursoJobbi** - Desarrollo Profesional y Búsqueda de Empleo
6. **cursoN1co** - Banca Digital
7. **cursoPropi** - Bienes Raíces Digitales
8. **cursoSostengo** - Fintech y Microcréditos para PYMES
9. **cursoTilopay** - Pasarela de Pagos Digitales
10. **cursoWeris** - Delivery Digital para Restaurantes

### 2. `js/crearCursos.js` (MODIFICADO)

Se actualizó este archivo para:

- Importar todos los cursos desde `cursosData.js`
- Incluir función `insertarTodosLosCursos()` para insertar todos los cursos en Firebase
- Incluir función `insertarCurso(curso)` para insertar cursos individuales
- Exportar todos los cursos y funciones para uso en otros módulos

## Estructura de Cada Curso

Cada objeto de curso contiene:

```javascript
{
    Certificado: "De finalización",
    ContenidoDelCurso: [
        {
            ContenidosModulo: [...],
            DescripcionModulo: "...",
            TituloModulo: "..."
        },
        // 3 módulos por curso
    ],
    Descripcion: "...",
    Duracion: "X horas de contenido",
    Formato: "Videos",
    Imagen: "../img/[empresa].png",
    LoQueAprenderás: [...],
    Nivel: "Principiante/Intermedio",
    Nombre: "...",
    Prerrequisitos: [...],
    Subtitulo: "...",
    Titulo: "..."
}
```

## Cómo Usar

### Opción 1: Insertar todos los cursos en Firebase

```javascript
import { insertarTodosLosCursos } from "./crearCursos.js";

// Ejecutar en la consola del navegador o en tu código
await insertarTodosLosCursos();
```

### Opción 2: Insertar un curso específico

```javascript
import { insertarCurso, cursoAbaco } from "./crearCursos.js";

// Insertar solo el curso de Abaco
await insertarCurso(cursoAbaco);
```

### Opción 3: Acceder a todos los cursos como array

```javascript
import { todosCursos } from "./cursosData.js";

// Iterar sobre todos los cursos
todosCursos.forEach((curso) => {
  console.log(curso.Nombre);
});
```

## Imágenes Utilizadas

- **abaco.png** - Curso de Abaco
- **applaudo.png** - Curso de Applaudo
- **boxful.png** - Curso de Boxful
- **fiado.png** - Curso de Fiado
- **jobbi.png** - Curso de Jobbi
- **n1co.png** - Curso de N1CO
- **propi.png** - Curso de Propi
- **icono_crecimiento.png** - Curso de Sostengo (no había imagen específica)
- **tilopay.png** - Curso de Tilopay
- **weris.png** - Curso de Weris

## Notas Importantes

1. Los cursos de **Fiado** y **Sostengo** utilizan imágenes genéricas ya que no había imágenes específicas en la carpeta `img/`.

2. Cada curso tiene contenido educativo realista basado en el tipo de servicio que ofrece cada empresa.

3. Todos los cursos siguen el mismo formato de 3 módulos con 4 contenidos cada uno.

4. Las duraciones varían entre 3.5 y 6 horas dependiendo de la complejidad del tema.

5. La mayoría de los cursos son nivel "Principiante", excepto el de Applaudo que es "Intermedio".

## Próximos Pasos

1. Revisar el contenido de cada curso para asegurar que sea apropiado
2. Actualizar las imágenes de Fiado y Sostengo si se obtienen las correctas
3. Ejecutar `insertarTodosLosCursos()` para poblar Firebase
4. Verificar que los cursos se muestren correctamente en la interfaz web
