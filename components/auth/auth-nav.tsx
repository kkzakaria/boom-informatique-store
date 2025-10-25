"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, LogIn } from "lucide-react"

export function AuthNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span>{session.user?.name || session.user?.email}</span>
          {session.user?.role === "ADMIN" && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
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
          S'inscrire
        </Link>
      </Button>
    </div>
  )
}