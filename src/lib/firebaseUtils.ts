import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { Classroom, NewClassroom } from "@/types/classroom";
import { School } from "@/types/school";
import { Teacher } from "@/types/teacher";
import { Material } from "@/types/material";
import { Question } from "@/types/question";
import { Course } from "@/types/course";
import { Evaluation } from "@/types/evaluation";
import { Template } from "@/types/template";
import { v4 as uuidv4 } from "uuid";
import { LearningStyle } from "@/types/learningStyle";
import { Student } from "@/types/student";
import { Principal } from "@/types/principal";
import { User } from "@/types/user";
import { Silabo } from "@/types/silabo";

// Función para buscar un maestro por email
export async function getTeacherByEmail(email: string): Promise<Teacher & { password: string } | null> {
  const teachersRef = collection(db, "Teacher");
  const q = query(teachersRef, where("email", "==", email));
  console.log('verifica 2')
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const teacherDoc = querySnapshot.docs[0];
  return { id: teacherDoc.id, ...teacherDoc.data() } as Teacher & { password: string };
}

// Función para obtener un usuario por ID
export async function getTeacherById(teacherId: string) {
  const teachersRef = doc(db, "Teacher", teacherId);
  console.log('verifica 3')
  const teacherSnap = await getDoc(teachersRef);

  if (!teacherSnap.exists()) {
    return null
  }

  return { id: teacherId, ...teacherSnap.data() } as Teacher;
}

// Función para obtener una escuela por ID
export async function getSchoolById(schoolId: string) {
  const schoolRef = doc(db, "School", schoolId);
  console.log('verifica 4')
  const schoolSnap = await getDoc(schoolRef);

  if (!schoolSnap.exists()) {
    throw new Error("School not found in database");
  }

  return { id: schoolId, ...schoolSnap.data() } as School;
}

// Función para obtener un salón por ID
export async function getClassroomById(classroomId: string) {
  const classroomRef = doc(db, "Classroom", classroomId);
  console.log('verifica 5')
  const classroomSnap = await getDoc(classroomRef);

  if (!classroomSnap.exists()) {
    throw new Error("Classroom not found in database");
  }
  const classroomData = classroomSnap.data() as Classroom;


  const courseDocRef = doc(db, 'Course', classroomData.courseId);
  console.log('verifica 6')
  const courseDoc = await getDoc(courseDocRef);

  if (courseDoc.exists()) {
    const courseData = courseDoc.data();
    classroomData.courseName = courseData.courseName || '';
    classroomData.codCourse = courseData.codCourse || null;
  } else {
    classroomData.courseName = '';
    classroomData.codCourse = null;
  }

  return { ...classroomData, id: classroomId } as Classroom;
}

// Función para obtener salones por escuela y maestro
export async function getClassroomsBySchoolAndTeacher(schoolId: string, teacherId: string): Promise<Classroom[]> {
  const classroomsRef = collection(db, 'Classroom');
  const q = query(
    classroomsRef,
    where('schoolId', '==', schoolId),
    where('teacherId', '==', teacherId)
  );
  console.log('verifica 7')
  const querySnapshot = await getDocs(q);
  const classrooms: Classroom[] = [];

  for (const docSnap of querySnapshot.docs) {
    const classroomData = docSnap.data() as Classroom;

    // Obtener información del curso a partir del courseId
    if (classroomData.courseId) {
      const courseDocRef = doc(db, 'Course', classroomData.courseId);
      console.log('verifica 8')
      const courseDoc = await getDoc(courseDocRef);

      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        classroomData.courseName = courseData.courseName || '';
        classroomData.codCourse = courseData.codCourse || null;
      } else {
        classroomData.courseName = '';
        classroomData.codCourse = null;
      }
    }

    classrooms.push({ ...classroomData, id: docSnap.id });
  }

  return classrooms;
}

export async function getClassroomsByCourse(courseId: string): Promise<Classroom[]> {
  const classroomsRef = collection(db, 'Classroom');
  const q = query(
    classroomsRef,
    where('courseId', '==', courseId)
  );
  console.log('verifica 9')
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return [];
  //devolver classrooms
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Classroom[];
}

export async function getClassroomsBySchool(schoolId: string): Promise<Classroom[]> {
  const classroomsRef = collection(db, 'Classroom');
  const q = query(
    classroomsRef,
    where('schoolId', '==', schoolId)
  );
  console.log('verifica 10')
  const querySnapshot = await getDocs(q);
  const classrooms: Classroom[] = [];
  console.log('verifica 11')

  for (const docSnap of querySnapshot.docs) {
    const classroomData = docSnap.data() as Classroom;

    // Obtener información del curso a partir del courseId
    if (classroomData.courseId) {
      //obtener informacion del profesor
      const teacherDocRef = doc(db, 'Teacher', classroomData.teacherId);
      const teacherDoc = await getDoc(teacherDocRef);
      console.log('verifica 11X')

      const courseDocRef = doc(db, 'Course', classroomData.courseId);

      const courseDoc = await getDoc(courseDocRef);
      console.log('verifica 11Y')

      if (courseDoc.exists() && teacherDoc.exists()) {
        const courseData = courseDoc.data();
        const teacherData = teacherDoc.data();
        classroomData.courseName = courseData.courseName || '';
        classroomData.codCourse = courseData.codCourse || null;
        classroomData.teacherName = teacherData.firstName + " " + teacherData.lastName || '';
      } else {
        classroomData.teacherName = '';
        classroomData.courseName = '';
        classroomData.codCourse = null;
      }
    }


    classrooms.push({ ...classroomData, id: docSnap.id });
  }

  return classrooms;
}

// Función para obtener el material de un salón
export async function getMaterialByClassroom({ courseId, grade, schoolId }: { courseId: string, grade: number, schoolId: string }) {
  const materialRef = collection(db, 'Material');
  const q = query(
    materialRef,
    where('courseId', '==', courseId),
    where('grade', '==', grade),
    where('schoolId', '==', schoolId)
  );
  const querySnapshot = await getDocs(q);
  console.log('verifica 12')

  if (querySnapshot.empty) {
    return null;
  }

  const materialDoc = querySnapshot.docs[0];
  const materialData = materialDoc.data();

  return { ...materialData, id: materialDoc.id } as Material;
}

export async function getQuestionsBySchoolCourse(schoolId: string, courseId: string) {
  const questionsRef = collection(db, 'Question');
  const q = query(
    questionsRef,
    where('schoolId', '==', schoolId),
    where('courseId', '==', courseId)
  );
  const querySnapshot = await getDocs(q);
  console.log('verifica 13')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
}

export async function getTemplates(): Promise<Template[]> {
  const questionsRef = collection(db, 'QuestionTemplate');
  const querySnapshot = await getDocs(questionsRef);
  console.log('verifica 14')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
}

export async function getTemplateById(templateId: string) {
  const templateRef = doc(db, 'QuestionTemplate', templateId);
  const templateDoc = await getDoc(templateRef);
  console.log('verifica 15')

  if (!templateDoc.exists()) {
    throw new Error("Template not found in database");
  }

  return { id: templateId, ...templateDoc.data() } as Template;
}



export async function getCourseByClassroomId(classroomId: string) {
  const classroom = await getClassroomById(classroomId);

  const courseDocRef = doc(db, 'Course', classroom.courseId);
  const courseDoc = await getDoc(courseDocRef);
  console.log('verifica 16')

  if (!courseDoc.exists()) {
    throw new Error("Course not found in database");
  }

  const courseData = courseDoc.data();
  return { id: classroom.courseId, ...courseData } as Course;
}

export async function getCourseById(courseId: string) {
  const courseDocRef = doc(db, 'Course', courseId);
  const courseDoc = await getDoc(courseDocRef);
  console.log('verifica 17')

  if (!courseDoc.exists()) {
    throw new Error("Course not found in database");
  }

  const courseData = courseDoc.data();
  return { id: courseId, ...courseData } as Course;
}

export async function getQuestionById(questionId: string) {
  const questionDocRef = doc(db, 'Question', questionId);
  const questionDoc = await getDoc(questionDocRef);
  console.log('verifica 18')

  if (!questionDoc.exists()) {
    throw new Error("Question not found in database");
  }

  return { id: questionId, ...questionDoc.data() } as Question;
}

export async function getQuestionsById(questionIds: string[]) {
  if (!questionIds.length) return [];

  const questionsRef = collection(db, 'Question');
  const q = query(questionsRef, where('__name__', 'in', questionIds));
  const querySnapshot = await getDocs(q);
  console.log('verifica 19')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
}

// Función para obtener pruebas semanales por IDs
export async function getEvaluationsByIds(evaluationIds: string[]) {
  if (!evaluationIds?.length) return [];

  const evaluationsRef = collection(db, 'Evaluation');
  const q = query(evaluationsRef, where('__name__', 'in', evaluationIds));
  const querySnapshot = await getDocs(q);
  console.log('verifica 20')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Evaluation[];
}

export async function getEvaluationById(evaluationId: string) {
  const evaluationDocRef = doc(db, 'Evaluation', evaluationId);
  const evaluationDoc = await getDoc(evaluationDocRef);
  console.log('verifica 21')

  if (!evaluationDoc.exists()) {
    throw new Error("Weekly Test not found in database");
  }

  return { id: evaluationId, ...evaluationDoc.data() } as Evaluation;
}

export async function getEvaluationAndQuestionsById(evaluationId: string) {
  const evaluation = await getEvaluationById(evaluationId);
  const questions = await getQuestionsById(evaluation.questionIds);
  evaluation.questions = questions;

  return evaluation;
}


const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export async function uploadImage(file: File | null): Promise<{ downloadURL: string | null; metadata: { width: number; height: number } } | null> {
  if (!file) return null;

  try {
    // Get image dimensions
    const dimensions = await getImageDimensions(file);

    // Create a reference to the storage location
    const storageRef = ref(storage, `images/${uuidv4()}`);

    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, {
      customMetadata: {
        width: dimensions.width.toString(),
        height: dimensions.height.toString()
      }
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      downloadURL,
      metadata: dimensions
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function createQuestion(
  question: Omit<Question, 'id'>
) {
  const docRef = doc(db, "Question", uuidv4());
  await setDoc(docRef, question);

  return docRef.id;
}

export async function getCoursesBySchool(schoolId: string) {
  const coursesRef = collection(db, 'Course');
  const q = query(coursesRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);
  console.log('verifica 22')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
}

export async function getSilabusBySchool(schoolId: string) {
  const silabusRef = collection(db, 'CourseGrade');
  const q = query(silabusRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);
  console.log('verifica 23')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Silabo[];
}

export async function getSilabusById(silabusId: string) {
  const silabusRef = doc(db, 'CourseGrade', silabusId);
  const silabusDoc = await getDoc(silabusRef);
  console.log('verifica getSilabusById')

  if (!silabusDoc.exists()) {
    throw new Error("Silabus not found in database");
  }

  return { id: silabusId, ...silabusDoc.data() } as Silabo;
}

export async function getSilabusByCourse(courseId: string) {
  const silabusRef = collection(db, 'CourseGrade');
  const q = query(silabusRef, where('courseId', '==', courseId));
  const querySnapshot = await getDocs(q);
  console.log('verifica getSilabusByCourse')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Silabo[];
}

export async function updateSilaBus(silabusId: string, silabus: Omit<Silabo, 'id'>) {
  const docRef = doc(db, 'CourseGrade', silabusId);
  await setDoc(docRef, silabus, { merge: true });
}

export async function deleteSilabus(silabusId: string) {
  const docRef = doc(db, 'CourseGrade', silabusId);
  await deleteDoc(docRef);
}

export async function createCourse(course: Omit<Course, 'id'>, grades: { courseId: string; grade: number }[], availableCourses: Course[], silabus: (Silabo | null)[]) {
  try {
    if (!course.courseName) {
      throw new Error("Course name is required");
    }
    const cursosNombres = availableCourses.map((c) => c.courseName);
    const courseExist = cursosNombres.find((c) => c === course.courseName);
    if (courseExist) {
      throw new Error("Course already exists in the school");
    }

    // Obtener los cursos y aulas en paralelo para mejorar la eficiencia
    const school = await getSchoolById(course.schoolId);

    // Generar código del curso
    const cantidad = cursosNombres.length;
    const codCourse = course.codCourse || String(school.code * 100 + cantidad + 1);

    // Referencia y datos del curso
    const courseRef = doc(collection(db, "Course"));
    const courseSend = {
      codCourse,
      courseName: course.courseName,
      schoolId: course.schoolId,
    };

    // Guardar el curso en Firestore
    await setDoc(courseRef, courseSend);

    // Crear los silabus en paralelo
    await Promise.all(
      grades.map((grad) => {
        const silabos = {
          courseId: courseRef.id, // Usar el ID del curso recién creado
          schoolId: course.schoolId,
          grade: grad.grade,
          silabusData: {
            description: silabus.find((s) => s?.grade === grad.grade)?.silabusData.description || "",
            goals: silabus.find((s) => s?.grade === grad.grade)?.silabusData.goals || "",
            topics: silabus.find((s) => s?.grade === grad.grade)?.silabusData.topics || {},
            method: silabus.find((s) => s?.grade === grad.grade)?.silabusData.method || "",
            bibliography: silabus.find((s) => s?.grade === grad.grade)?.silabusData.bibliography || "",
          },
        };
        return setDoc(doc(collection(db, "CourseGrade")), silabos);
      })
    );

    return courseRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }
}


export async function createSilabus(silabus: Omit<Silabo, 'id'>) {
  try {
    // validar si ya existe un silabus con el mismo grado y curso
    const silabusExist = await getSilabusByCourse(silabus.courseId as string);
    const silabusExistGrade = silabusExist.find((s) => s.grade === silabus.grade);
    if (silabusExistGrade) {
      throw new Error("Silabus already exists");
    }

    const docRef = doc(collection(db, "CourseGrade"));
    await setDoc(docRef, silabus);

    return docRef.id;
  } catch (error) {
    console.error("Error creating silabus:", error);
    throw new Error("Failed to create silabus");
  }
}

export async function createEvaluation(
  evaluation: Omit<Evaluation, 'id'>
) {
  const docRef = doc(db, "Evaluation", uuidv4());
  await setDoc(docRef, evaluation);

  console.log("evaluation");
  console.log(evaluation);

  // Add the evaluation ID to the corresponding material
  const materialRef = collection(db, 'Material');
  const q = query(
    materialRef,
    where('courseId', '==', evaluation.courseId),
    where('grade', '==', evaluation.grade),
    where('schoolId', '==', evaluation.schoolId)
  );
  const querySnapshot = await getDocs(q);
  console.log('verifica 24')


  if (!querySnapshot.empty) {
    const materialDoc = querySnapshot.docs[0];
    const materialData = materialDoc.data() as Material;

    console.log("materialData");
    console.log(materialData);

    if (evaluation.evaluationType === 'weeklyTest') {
      materialData.weeklyTestIds = [...(materialData.weeklyTestIds || []), docRef.id];
    } else if (evaluation.evaluationType === 'homework') {
      materialData.homeworkIds = [...(materialData.homeworkIds || []), docRef.id];
    } else if (evaluation.evaluationType === 'reinforcement') {
      materialData.reinforcementIds = [...(materialData.reinforcementIds || []), docRef.id];
    }

    await setDoc(materialDoc.ref, materialData, { merge: true });
  }
}

export async function getLearningStyles() {
  const learningStylesRef = collection(db, 'LearningStyle');
  const querySnapshot = await getDocs(learningStylesRef);
  console.log('verifica 25')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LearningStyle[];
}

export async function getLearningStyleById(learningStyleId: string) {
  const learningStyleRef = doc(db, 'LearningStyle', learningStyleId);
  const learningStyleDoc = await getDoc(learningStyleRef);
  console.log('verifica 26')

  if (!learningStyleDoc.exists()) {
    throw new Error("Learning Style not found in database");
  }

  return { id: learningStyleId, ...learningStyleDoc.data() } as LearningStyle;
}

// updateQuestion(question!.id as string, newQuestion as Question);
export async function updateQuestion(questionId: string, question: Omit<Question, 'id'>) {
  const docRef = doc(db, 'Question', questionId);
  await setDoc(docRef, question, { merge: true });
}

export async function updateEvaluation(evaluationId: string, evaluation: Omit<Evaluation, 'id'>) {
  const docRef = doc(db, 'Evaluation', evaluationId);
  await setDoc(docRef, evaluation, { merge: true });
}

export async function updateCourse(courseId: string, course: Omit<Course, 'id'>, grades: { courseId: string; grade: number }[]) {
  const docRef = doc(db, 'Course', courseId);
  await setDoc(docRef, course, { merge: true });

}

// extraer student por id
export async function getStudentById(studentId: string) {
  const studentRef = doc(db, 'Student', studentId);
  const studentSnap = await getDoc(studentRef);
  console.log('verifica 27')

  if (!studentSnap.exists()) {
    return null
  }

  return { id: studentId, ...studentSnap.data() } as Student;
}

export async function getStudentsBySchool(schoolId: string) {
  console.log('getStudentsBySchool')
  const studentsRef = collection(db, 'Student');
  const q = query(studentsRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
}

export async function getStudentsByClassroomGrade(classroomId: string) {
  console.log('getStudentsByClassroomGrade')
  //obtener clase
  const classroom = await getClassroomById(classroomId);

  const studentsRef = collection(db, 'Student');
  const q = query(studentsRef, where('currentGrade', '==', classroom.grade));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
}

// PRINCIPAL
// extraer director por email
export async function getPrincipalByEmail(email: string): Promise<Principal & { password: string } | null> {
  const principalsRef = collection(db, "Principal");
  const q = query(principalsRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  console.log('verifica 28')

  if (querySnapshot.empty) {
    return null;
  }

  const principalDoc = querySnapshot.docs[0];
  return { id: principalDoc.id, ...principalDoc.data() } as Principal & { password: string };
}

export async function getUserById(id: string) {

  let user: User | null = null;
  // Intentar encontrar al usuario en cada tabla
  const teacher = await getTeacherById(id);
  if (teacher) {
    user = { ...teacher, role: "teacher" };
  } else {
    const principal = await getPrincipalById(id);
    if (principal) {
      user = { ...principal, role: "principal" };
    } else {
      const student = await getStudentById(id);
      if (student) {
        user = { ...student, role: "student" };
      } else {
        throw new Error("User not found in database");
      }
    }
  }

  return user as User;
}

// extraer director por id
export async function getPrincipalById(principalId: string) {
  const principalRef = doc(db, 'Principal', principalId);
  const principalSnap = await getDoc(principalRef);
  console.log('verifica 29')

  if (!principalSnap.exists()) {
    return null
  }

  return { id: principalId, ...principalSnap.data() } as Principal;
}

export async function getUserByEmail(email: string) {
  console.log('VERIFICANDO getuseremail')
  const teacher = await getTeacherByEmail(email);
  if (teacher) return { ...teacher, role: "teacher" };

  const principal = await getPrincipalByEmail(email);
  if (principal) return { ...principal, role: "principal" };

  const student = await getStudentByEmail(email);
  if (student) return { ...student, role: "student" };

  return null; // Si no se encuentra en ninguna tabla
}

// extraer estudiante por email
export async function getStudentByEmail(email: string): Promise<Student & { password: string } | null> {
  const studentsRef = collection(db, "Student");
  const q = query(studentsRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  console.log('verifica 30')

  if (querySnapshot.empty) {
    return null;
  }

  const studentDoc = querySnapshot.docs[0];
  return { id: studentDoc.id, ...studentDoc.data() } as Student & { password: string };
}

export async function getTeachersBySchool(schoolId: string) {
  const teachersRef = collection(db, 'Teacher');
  const q = query(teachersRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);
  console.log('verifica 31')

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[];
}

export async function getCourseGradeAndCourseBySchool(schoolId: string) {
  const resp: {
    course: Course;
    courseGrade: Silabo;
  }[] = [];
  const coursesRef = collection(db, 'Course');
  const q = query(coursesRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);
  console.log('verifica 32')

  // obtener los cursos más los grados
  const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];

  const silabus = await getSilabusBySchool(schoolId);

  for (const silab of silabus) {

    const curso = courses.find((c) => c.id === silab.courseId);

    if (curso) {
      const response = {
        course: curso,
        courseGrade: silab
      }

      resp.push(response);
    }
  }
  console.log('aa', resp)
  return resp;
}

export async function createClassroom(classroom: Omit<Classroom, 'id'>) {
  const docRef = doc(collection(db, "Classroom"));
  await setDoc(docRef, classroom);

  return docRef.id;
}

export async function deleteClassroom(classroomId: string) {
  const docRef = doc(db, 'Classroom', classroomId);
  await deleteDoc(docRef);
}

// GESTION DE PROFESORES
export async function getTeacherByCode(codTeacher: string) {
  const teachersRef = collection(db, 'Teacher');
  const q = query(teachersRef, where('codTeacher', '==', codTeacher));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const teacherDoc = querySnapshot.docs[0];
  return { id: teacherDoc.id, ...teacherDoc.data() } as Teacher;
}

const generateRandomPassword = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
// crear profesor
export async function createTeacher(teacher: {
  codTeacher: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string
  sex: string;
  state: boolean;
  profilePictureLink?: string;
  schoolId: string
}) {
  try {
    // Verificar si ya existe un profesor con el mismo código
    const teacherExist = await getTeacherByCode(teacher.codTeacher);
    if (teacherExist) {
      throw new Error("Teacher already exists");
    }
    // verificar si ya existe un profesor con el mismo email
    const teacherByEmail = await getTeacherByEmail(teacher.email);
    if (teacherByEmail) {
      throw new Error("Teacher already exists");
    }
    const teacherData = { ...teacher, password: generateRandomPassword() };
    const docRef = doc(collection(db, "Teacher"));
    await setDoc(docRef, teacherData);

    return { id: docRef.id, password: teacherData.password };
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw new Error("Failed to create teacher");
  }
}
// actualizar profesor
export async function updateTeacher(teacherId: string, teacher: {
  codTeacher: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string
  sex: string;
  state: boolean;
  profilePictureLink?: string;
  schoolId: string
}) {
  const docRef = doc(db, 'Teacher', teacherId);
  await setDoc(docRef, teacher, { merge: true });
}
// eliminar profesor
export async function deleteTeacher(teacherId: string) {
  const docRef = doc(db, 'Teacher', teacherId);
  await deleteDoc(docRef);
}


// archivar profesor
export async function archiveTeacher(teacherId: string) {
  const docRef = doc(db, 'Teacher', teacherId);
  await setDoc(docRef, { state: false }, { merge: true });
}

// GESTION DE ESTUDIANTES
export async function getStudentByCode(codStudent: string) {
  const studentsRef = collection(db, 'Student');
  const q = query(studentsRef, where('codStudent', '==', codStudent));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const studentDoc = querySnapshot.docs[0];
  return { id: studentDoc.id, ...studentDoc.data() } as Student;
}
// crear estudiante
export async function createStudent(student:{
  codStudent: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string
  sex: string;
  state: boolean;
  profilePictureLink?: string;
  schoolId: string;
  currentGrade: number;
}) {

  try {
    // Verificar si ya existe un estudiante con el mismo código
    const studentExist = await getStudentByCode(student.codStudent);
    if (studentExist) {
      throw new Error("Student already exists");
    }
    // verificar si ya existe un estudiante con el mismo email
    const studentByEmail = await getStudentByEmail(student.email);
    if (studentByEmail) {
      throw new Error("Student already exists");
    }
    const studentData = { ...student, password: generateRandomPassword() };
    const docRef = doc(collection(db, "Student"));
    await setDoc(docRef, studentData);

    return { id: docRef.id, password: studentData.password };
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }
}
// actualizar estudiante
export async function updateStudent(studentId: string, student: {
  codStudent: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string
  sex: string;
  state: boolean;
  profilePictureLink?: string;
  schoolId: string;
  currentGrade: number;
}) {
  const docRef = doc(db, 'Student', studentId);
  await setDoc(docRef, student, { merge: true });
}
// eliminar estudiante
export async function deleteStudent(studentId: string) {
  const docRef = doc(db, 'Student', studentId);
  await deleteDoc(docRef);
}
// archivar estudiante
export async function archiveStudent(studentId: string) {
  const docRef = doc(db, 'Student', studentId);
  await setDoc(docRef, { state: false }, { merge: true });
}

export async function assignStudentsToClassroom(studentId: string[], classroomId: string) {
  // actualizar el array de studentIds del classroom
  const classroomRef = doc(db, 'Classroom', classroomId);
  const classroomSnap = await getDoc(classroomRef);
  console.log('assignStudentToClassroom')

  if (!classroomSnap.exists()) {
    throw new Error("Classroom not found in database");
  }

  const classroomData = classroomSnap.data() as Classroom;
  classroomData.studentIds = studentId;
  await setDoc(classroomRef, classroomData, { merge: true });
}