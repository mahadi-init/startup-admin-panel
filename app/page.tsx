import SubmitButton from "@/components/SubmitButton";
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
import prisma from "@/lib/prisma";
import { createJWT } from "@/utils/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const admin = await prisma.admins.findFirst({
      where: { phone: phone, password: password },
    });

    if (admin) {
      const payload = {
        name: admin.name,
        phone: admin.phone,
      };

      const token = await createJWT(payload);

      if (token) {
        (await cookies()).set("auth-token", token);
      }

      redirect("/dashboard");
    }
  };

  return (
    <form
      action={handleSubmit}
      className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                placeholder="Enter phone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter password"
                type="password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Login" />
        </CardFooter>
      </Card>
    </form>
  );
}
