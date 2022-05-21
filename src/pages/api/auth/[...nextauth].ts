import { query as q } from 'faunadb'

import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";

import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
      const Email = user.email

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { Email } }
          )
        )
      } catch (error) {
        console.log(error)
      }
      

      return true
    },
  }
})