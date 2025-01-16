Pendiente: 20/11

Iniciar sesión:
	- Recuperar contraseña

Profesor:
	- Información
		- Añadir más información (pendiente)
		- Cambiar contraseña
	- Cursos

Topics:
	- Se deben agrupar por semana
	- Están definidos por el silbus con antelación

Curso
	- [Course-School] Silabus 
	- [Course-Grade] Temas por semana
	- Mostrar las evaluaciones asignadas

Question:
	- Añadir dificultad (Básico, Intermedio, Avanzado)
	- 4 estilos de aprendizaje (1 estilo de aprendizaje por dimensión)

QuestionBank:
	- Añadir favoritos
	- Filtros: Grado (disponible para el profesor), Semana, Tema, Estilos de aprendizaje

Evaluaciones:
	- Semanales
		- 5 preguntas
		- 0 a 20
		- La escoge el profesor
		- Al presentarse tiene orden aleatorio
		- Duración fija: 20 min
		- El profesor marca a que hora empieza la prueba
		- Para marcar (calificables automáticamente)
	- Tareas
		- se escoje fecha de entrega
		- 0 a 20
		- 10 preguntas: 3P 3P 2S 2S
		- Se escojen automaticamente para cada alumno (Sistema experto)
	- Reforzamiento
		- 15 preguntas: 5 x semana (2P 1S) (Avanzado)
			- Se escojen automaticamente para cada alumno (Sistema experto)
		- Mostrar la respuesta correcta
		- 0 a 20

Alumno
	- 2 estilos principales ( 	a, b 	) (   c, d    )
	- 2 estilos secundarios ( 1-a, 1-b 	) ( 1-c, 1-d  )

-- Capa de alumnos
-- Capa de asignación de evaluaciones
-- 4 plantillas

-- Rol Administrador

- Plantilla1: SelecciónÚnica

Estilos: Sensitivos, Visuales, Reflexivos, Secuenciales

	Enunciado: TextArea
	Imagen?: Subir una imagen
	Opciones: De 2 a más opciones, donde solo 1 es la opción correcta

	Obs: Se puede calificar automáticamente


- Plantilla 2: SeleccionarImagen

Estilos: Sensitivos, Visuales, Reflexivos, Secuenciales

	Enunciado: TextArea
	Opciones: Cada opción es una imagen, donde solo 1 es la opción correcta

	Obs: Se puede calificar automáticamente

- Plantilla 3: RedactarRespuesta

Estilos: Intuitivo, Verbales, Reflexivos, Globales
	
	Enunciado: TextArea
	Imagen?: Subir una imagen
	Respuesta: TextArea

	Obs: No se puede calificar automáticamente, tendrá la respuesta almacenada

