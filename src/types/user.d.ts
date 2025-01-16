export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  codTeacher?: string;
  codStudent?: string;
  sex: string;
  profilePictureLink: string | null;
  grade?: number;
}