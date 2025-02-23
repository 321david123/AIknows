import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

export default NextAuth({
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
          // Do not set redirect_uri here; let NextAuth generate it
        },
      },
      profile: (profile: any) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.sub;
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.picture,
      };
      return session;
    },
  },
});