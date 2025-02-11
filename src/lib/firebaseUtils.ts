import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
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
  const teacherSnap = await getDoc(teachersRef);

  if (!teacherSnap.exists()) {
    return null
  }

  return { id: teacherId, ...teacherSnap.data() } as Teacher;
}

// Función para obtener una escuela por ID
export async function getSchoolById(schoolId: string) {
  const schoolRef = doc(db, "School", schoolId);
  const schoolSnap = await getDoc(schoolRef);

  if (!schoolSnap.exists()) {
    throw new Error("School not found in database");
  }

  return { id: schoolId, ...schoolSnap.data() } as School;
}

// Función para obtener un salón por ID
export async function getClassroomById(classroomId: string) {
  const classroomRef = doc(db, "Classroom", classroomId);
  const classroomSnap = await getDoc(classroomRef);

  if (!classroomSnap.exists()) {
    throw new Error("Classroom not found in database");
  }
  const classroomData = classroomSnap.data() as Classroom;


  const courseDocRef = doc(db, 'Course', classroomData.courseId);
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

  const querySnapshot = await getDocs(q);
  const classrooms: Classroom[] = [];

  for (const docSnap of querySnapshot.docs) {
    const classroomData = docSnap.data() as Classroom;

    // Obtener información del curso a partir del courseId
    if (classroomData.courseId) {
      const courseDocRef = doc(db, 'Course', classroomData.courseId);
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

  const querySnapshot = await getDocs(q);
  const classrooms: Classroom[] = [];

  for (const docSnap of querySnapshot.docs) {
    const classroomData = docSnap.data() as Classroom;

    // Obtener información del curso a partir del courseId
    if (classroomData.courseId) {
      const courseDocRef = doc(db, 'Course', classroomData.courseId);
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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
}

export async function getTemplates(): Promise<Template[]> {
  const questionsRef = collection(db, 'QuestionTemplate');
  const querySnapshot = await getDocs(questionsRef);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
}

export async function getTemplateById(templateId: string) {
  const templateRef = doc(db, 'QuestionTemplate', templateId);
  const templateDoc = await getDoc(templateRef);

  if (!templateDoc.exists()) {
    throw new Error("Template not found in database");
  }

  return { id: templateId, ...templateDoc.data() } as Template;
}



export async function getCourseByClassroomId(classroomId: string) {
  const classroom = await getClassroomById(classroomId);

  const courseDocRef = doc(db, 'Course', classroom.courseId);
  const courseDoc = await getDoc(courseDocRef);

  if (!courseDoc.exists()) {
    throw new Error("Course not found in database");
  }

  const courseData = courseDoc.data();
  return { id: classroom.courseId, ...courseData } as Course;
}

export async function getCourseById(courseId: string) {
  const courseDocRef = doc(db, 'Course', courseId);
  const courseDoc = await getDoc(courseDocRef);

  if (!courseDoc.exists()) {
    throw new Error("Course not found in database");
  }

  const courseData = courseDoc.data();
  return { id: courseId, ...courseData } as Course;
}

export async function getQuestionById(questionId: string) {
  const questionDocRef = doc(db, 'Question', questionId);
  const questionDoc = await getDoc(questionDocRef);

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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
}

// Función para obtener pruebas semanales por IDs
export async function getEvaluationsByIds(evaluationIds: string[]) {
  if (!evaluationIds?.length) return [];

  const evaluationsRef = collection(db, 'Evaluation');
  const q = query(evaluationsRef, where('__name__', 'in', evaluationIds));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Evaluation[];
}

export async function getEvaluationById(evaluationId: string) {
  const evaluationDocRef = doc(db, 'Evaluation', evaluationId);
  const evaluationDoc = await getDoc(evaluationDocRef);

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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
}

export async function getSilabusBySchool(schoolId: string) {
  const silabusRef = collection(db, 'CourseGrade');
  const q = query(silabusRef, where('schoolId', '==', schoolId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Silabo[];
}

export async function createCourse(
  course: Omit<Course, 'id'>, classrooms: NewClassroom[]
) {
  const courseTarget = await getCoursesBySchool(course.schoolId);
  const courseExist = courseTarget.find((c) => c.courseName === course.courseName);
  if (courseExist) {
    throw new Error("Course already exists in the school");
  }

  const school = await getSchoolById(course.schoolId);
  const cantidad = (await getClassroomsBySchool(course.schoolId)).length;
  const courseSend = {
    codCourse: course.codCourse ? course.codCourse : String((school.code)*100 + cantidad + 1),
    courseName: course.courseName,
    schoolId: course.schoolId,
  };
  const courseRef = doc(collection(db, "Course"));
  await setDoc(courseRef, courseSend);

  if (classrooms.length > 0) {
    for (const classroom of classrooms) {
      const classroomSend = {
        courseId: courseRef.id,
        grade: classroom.grade,
        schoolId: course.schoolId,
        section: classroom.section,
        teacherId: classroom.teacherId,
        studentIds: [] as string[],
      };
      const classroomRef = doc(collection(db, "Classroom"));
      await setDoc(classroomRef, classroomSend);
    }
  }

  return courseRef.id;
}

export async function createSilabus(silabus : Omit<Silabo, 'id'>){
  try {
    console.log("silabus");
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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LearningStyle[];
}

export async function getLearningStyleById(learningStyleId: string) {
  const learningStyleRef = doc(db, 'LearningStyle', learningStyleId);
  const learningStyleDoc = await getDoc(learningStyleRef);

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

export async function updateCourse(courseId: string, course: Omit<Course, 'id'>, classrooms: NewClassroom[]) {
  const docRef = doc(db, 'Course', courseId);
  await setDoc(docRef, course, { merge: true });

  const classroomsRef = collection(db, 'Classroom');

  // Obtener los salones existentes en Firestore
  const existingClassroomsSnapshot = await getDocs(query(classroomsRef, where("courseId", "==", courseId)));

  const existingClassrooms = new Set(
    existingClassroomsSnapshot.docs.map(doc => JSON.stringify({
      grade: doc.data().grade,
      section: doc.data().section,
      teacherId: doc.data().teacherId
    }))
  );

  // Filtrar los salones que no existen en la colección
  const newClassrooms = classrooms.filter(
    classroom => !existingClassrooms.has(JSON.stringify({
      grade: classroom.grade,
      section: classroom.section,
      teacherId: classroom.teacherId
    }))
  );

  // Agregar solo los nuevos salones a Firestore
  for (const classroom of newClassrooms) {
    await addDoc(classroomsRef, {
      courseId,
      grade: classroom.grade,
      section: classroom.section,
      teacherId: classroom.teacherId,
      studentIds: [] as string[],
      schoolId: course.schoolId
    });
  }
  
}

// extraer student por id
export async function getStudentById(studentId: string) {
  const studentRef = doc(db, 'Student', studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    return null
  }

  return { id: studentId, ...studentSnap.data() } as Student;
}

// PRINCIPAL
// extraer director por email
export async function getPrincipalByEmail(email: string): Promise<Principal & { password: string } | null> {
  const principalsRef = collection(db, "Principal");
  const q = query(principalsRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const principalDoc = querySnapshot.docs[0];
  return { id: principalDoc.id, ...principalDoc.data() } as Principal & { password: string };
}

export async function getUserById(id: string) {

  let user : User | null = null;
  // Intentar encontrar al usuario en cada tabla
  const teacher = await getTeacherById(id);
  if (teacher) {
    user = { ...teacher, role: "teacher" };
  }else{
    const principal = await getPrincipalById(id);
    if (principal) {
      user = { ...principal, role: "principal" };
    }else{
      const student = await getStudentById(id);
      if (student) {
        user = { ...student, role: "student" };
      }else{
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

  if (!principalSnap.exists()) {
    return null
  }

  return { id: principalId, ...principalSnap.data() } as Principal;
}

export async function getUserByEmail(email: string) {
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

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[];
}