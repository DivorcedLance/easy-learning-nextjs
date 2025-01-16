import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getTeacherByEmail, getTeacherById, getSchoolById } from "@/lib/firebaseUtils";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validar que se ingresen las credenciales
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar el maestro por email
        const teacher = await getTeacherByEmail(credentials.email);
        console.log(teacher);
        if (!teacher) {
          return null;
        }

        // Validar la contraseña
        const isValidPassword = credentials.password === teacher.password;
        if (!isValidPassword) {
          return null;
        }

        // Devolver solo el ID del maestro
        return {
          id: teacher.id,
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.id) {
        throw new Error("User ID is missing in token");
      }

      const user = await getTeacherById(token.id as string);

      if (!user) {
        throw new Error("User data is empty");
      }

      session.user = {
        id: token.id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        codTeacher: user.codTeacher,
        sex: user.sex,
        profilePictureLink: user.profilePictureLink,
      };

      // Obtener la información de la escuela asociada
      const school = await getSchoolById(user.schoolId);

      session.school = school;

      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
});
