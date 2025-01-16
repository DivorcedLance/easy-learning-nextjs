Esta es una página en Next para la gestión de evaluaciones y tareas.

Lo primero será una vista de Login que pedirá Usuario y Contraseña.

# Vista principal de Docente
Tendrá una sidebar con 2 opciones:

## Datos (Seleccionada por defecto)

Le dara la bienvenida al docente. Mostrará Foto de Perfil, Apellidos, Nombres y Código

## Cursos

Será una grid responsive que contendrá cards, cada card representa un curso
y mostrará el nombre, grado y sección (Ej: Matemática, 4to, B) y tendrá un botón que nos rederigirá a la vista de Gestión de Curso
La grid tendrá un filtro para nombre, grado y sección.

## Vista de Gestión de Curso

Tendrá una sidebar con las siguientes opciones:

### Gestión de preguntas

Mostrará una grid responsive que contendrá preguntas. Cada pregunta será representada por un ícono con un nombre abajo (Ej: Pregunta 08)

Cada pregunta es un Markdown con un título.

Habrá un botón para crear una pregunta que nos llevará a otra vista.
Habrá un botón para eliminar una pregunta.
Al darle click a una pregunta nos llevará a una vista para ver su contenido desde esta vista tmb se podrá editar la pregunta.

### Gestión de evaluaciones

Mostrará una grid responsive que contendrá evaluaciones. Cada evaluación será representada por un ícono con un nombre abajo (Ej: Evaluación Semana 05)

Cada evaluación será una lista de preguntas

Habrá un botón para crear una evaluación que nos llevará a otra vista.
Habrá un botón para eliminar una evaluación.
Al darle click a una evaluación nos llevará a una vista para ver sus preguntas y hab´ra un botón para asignarla. Al asignar una evaluación nos pedirá fecha y hora de entrega.

### Reportes

Estará en blanco


