"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@triad/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

import { LoginRequest, LoginRequestSchema } from "@/schemas/auth";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";
import { formatZodError } from "@/utils/zod-helpers";

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginRequest) {
    try {
      const validatedValues = LoginRequestSchema.parse(values);

      await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        json: validatedValues,
      });

      router.push("/");
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = formatZodError(error);
        form.setError("root.message", { message: formattedError });
        return;
      }

      throw error;
    }
  }

  return (
    <div className="flex h-full min-h-[100dvh] w-full flex-col items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>

                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
