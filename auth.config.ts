import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — no Node.js-only imports (no bcryptjs, no db)
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error:  "/login",
  },
  providers: [],   // Credentials provider added in auth.ts (Node.js only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
