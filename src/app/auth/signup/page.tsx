import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <SignUp 
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