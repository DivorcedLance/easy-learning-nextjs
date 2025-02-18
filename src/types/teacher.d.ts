export interface Teacher {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  codTeacher: string;
  sex: string;
  profilePictureLink: string | null;
  state: boolean | null;
  dni: string | null;
}