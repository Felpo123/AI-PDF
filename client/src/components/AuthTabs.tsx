"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthTabs() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [errorMsg, setErorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    mutate: register,
    isPending,
    isSuccess,
  } = trpc.auth.createUser.useMutation();

  const handleLogin = (email: string) => {
    try {
      setErorMsg("Procesando...");
      setLoading(true);
      signIn("credentials", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      }).then((res) => {
        if (!res?.error) {
          router.push("/dashboard");
        } else {
          setErorMsg("Email no encontrado");
        }
      });
    } catch (error) {
      setErorMsg("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="ingreso" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ingreso">Ingreso</TabsTrigger>
        <TabsTrigger value="registro">Registro</TabsTrigger>
      </TabsList>
      <TabsContent value="ingreso">
        <Card>
          <CardHeader>
            <CardTitle>Ingreso</CardTitle>
            <CardDescription>Ingresa a tu cuenta con tu email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                handleLogin(email);
              }}
            >
              Ingresar
            </Button>
            {loading && <p>Ingresando...</p>}
            {errorMsg && <p>{errorMsg}</p>}
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="registro">
        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Regístrate con tu email y nombre.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                register({ email, name });
              }}
              disabled={isPending}
            >
              Registrar
            </Button>
            {isPending && <p>Registrando...</p>}
            {isSuccess && <p>Registrado correctamente</p>}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
