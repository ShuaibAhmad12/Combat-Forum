import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-md rounded-lg"
          }
        }}
      />
    </div>
  );
}