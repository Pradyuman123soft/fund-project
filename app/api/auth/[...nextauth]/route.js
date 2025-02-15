import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import mongoose from 'mongoose'
import User from '@/models/User'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'

import GithubProvider from "next-auth/providers/github"
// import Username from '@/app/[username]/page'

export const authOptions = NextAuth({
  providers: [
    // OAuth authentication providers...
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log()
      if (account.provider == "github") {
      //  connect to the database
        await connectDB(); 
        // check if the user is already exist in database 
        const currentuser = await User.findOne({ email: user.email })
        if (!currentuser) {
          const newUser = new User({
            email: user.email,
            username: user.email.split("@")[0]
          })
          await newUser.save();
        }
        return true;  
      }
    },
  //   async session({ session, user, token }) {
    //     const dbUser = await User.findOne({email: session.user.email})
    //     session.user.name = dbUser.username
    //     return session
    //   }
  
    }
})

export { authOptions as GET, authOptions as POST }