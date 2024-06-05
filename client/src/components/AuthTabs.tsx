"use client";

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

export function AuthTabs() {
  // const router = useRouter();
  // const [email, setEmail] = useState<string>("");
  // const [errorMsg, setErorMsg] = useState<string | null>(null);

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
            <Input id="email" defaultValue="john@gmail.com" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                signIn("credentials", {
                  email: "",
                  redirect: true,
                  callbackUrl: "/dashboard",
                });
              }}
            >
              Ingresar
            </Button>
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
              <Input id="email" type="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" type="text" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Registrar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
