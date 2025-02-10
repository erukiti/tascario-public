import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Timestamp } from "@google-cloud/firestore";
import { db } from "~/server/db";
import { env } from "~/env";
import type { GetServerSidePropsContext } from "next";
import { GoogleAuth } from "google-auth-library";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),

    async signIn({ user, account, profile }) {
      console.log("Starting signIn callback");

      // 診断情報を出力
      try {
        const auth = new GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/datastore"],
        });
        const client = await auth.getClient();
        console.log("Current service account:", await auth.getCredentials());
      } catch (e) {
        console.error("Auth diagnostic error:", e);
      }

      if (account?.provider === "google" && profile?.sub) {
        try {
          const userRef = db.collection("users").doc(profile.sub);
          const userDoc = await userRef.get();
          const timeStamp = Timestamp.now();

          if (!userDoc.exists) {
            await userRef.set({
              email: user.email,
              name: user.name,
              photoURL: user.image,
              createdAt: timeStamp,
            });
            console.log("User created in Firestore", profile.sub);
          } else {
            console.log("User already exists in Firestore", profile.sub);
          }
          return true;
        } catch (e) {
          console.error("Error in signIn callback:", e);
          if (e instanceof Error) {
            console.error({
              message: e.message,
              stack: e.stack,
              name: e.name,
            });
          }
          return false;
        }
      }
      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

/*
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    async signIn({ user, account, profile }) {
      // とりあえずFirestoreへの書き込みをスキップしてテスト
      console.log("Starting signIn callback");
      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  debug: true, // デバッグモードを有効化
};
*/

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
