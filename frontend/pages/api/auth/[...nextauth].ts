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
      // Using the well-known configuration allows the provider to auto-configure endpoints.
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
          // Explicitly set redirect_uri to match your production settings:
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
        },
      },
      profile: (profile: any) => {
        // Adjust this mapping if LinkedIn returns different field names.
        return {
          id: profile.sub,
          name: `${profile.localizedFirstName || profile.name} ${profile.localizedLastName || ""}`.trim(),
          email: profile.emailAddress,
          image: profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id;
        token.name = profile.name;
        token.email = profile.email;
        token.image = profile.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
      };
      return session;
    },
  },
});