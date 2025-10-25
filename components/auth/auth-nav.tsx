"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, LogIn } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: string
}

export function AuthNav() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        // Get user profile from our custom users table
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('id', authUser.id)
          .single()

        setUser(profile)
      }

      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('id', session.user.id)
          .single()

        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span>{user.name || user.email}</span>
          {user.role === "ADMIN" && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/signin">
          <LogIn className="h-4 w-4 mr-2" />
          Connexion
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/auth/signup">
          S&apos;inscrire
        </Link>
      </Button>
    </div>
  )
}