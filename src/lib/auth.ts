import { NextAuthOptions } from "next-auth";

export interface InstagramProfile {
  id: string;
  username: string;
  name?: string;
  profile_picture?: string;
  account_type?: string;
  media_count?: number;
  follower_count?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "instagram",
      name: "Instagram",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://www.facebook.com/v22.0/dialog/oauth",
        params: {
          client_id: process.env.META_APP_ID,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
          scope: "instagram_business_basic,instagram_business_manage_messages,instagram_business_content_publish,instagram_business_manage_comments,pages_show_list,business_management",
          response_type: "code",
        },
      },
      token: {
        url: "https://graph.facebook.com/v22.0/oauth/access_token",
        async request({ params }) {
          const url = new URL("https://graph.facebook.com/v22.0/oauth/access_token");
          url.searchParams.set("client_id", process.env.META_APP_ID!);
          url.searchParams.set("client_secret", process.env.META_APP_SECRET!);
          url.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`);
          url.searchParams.set("code", params.code!);
          const res = await fetch(url.toString());
          const data = await res.json();
          return { tokens: data };
        },
      },
      userinfo: {
        async request({ tokens }) {
          const url = new URL("https://graph.facebook.com/v22.0/me");
          url.searchParams.set("fields", "id,name,accounts{instagram_business_account{id,username,profile_picture_url,media_count,followers_count}}");
          url.searchParams.set("access_token", tokens.access_token!);
          const res = await fetch(url.toString());
          const data = await res.json();
          const igAccount = data.accounts?.data?.[0]?.instagram_business_account;
          return {
            id: igAccount?.id || data.id,
            username: igAccount?.username || data.name,
            name: data.name,
            profile_picture: igAccount?.profile_picture_url,
            media_count: igAccount?.media_count,
            follower_count: igAccount?.followers_count,
            account_type: "instagram_business",
          };
        },
      },
      profile(profile: InstagramProfile) {
        return {
          id: profile.id,
          name: profile.name || profile.username,
          email: `${profile.username}@instagram.oauth`,
          image: profile.profile_picture,
          username: profile.username,
        };
      },
      clientId: process.env.META_APP_ID,
      clientSecret: process.env.META_APP_SECRET,
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.instagramId = profile?.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        instagramId: token.instagramId,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
