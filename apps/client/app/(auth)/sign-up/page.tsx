import { SignUpForm } from "@/components/forms/sign-up-form";
import Image from "next/image";

export default function SignUpPage() {
    return (
        <main className="container bg-[#FAFBFC] max-w-screen max-h-screen overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
                <SignUpForm />
                <div className="absolute bottom-0 left-0 hidden md:inline-block">
                    <Image
                        src="/default_left.558fbf68.svg"
                        alt="left planners"
                        width={550}
                        height={450}
                        className="object-cover w-110 h-auto isolate"
                    />
                </div>
                <div className="absolute bottom-0 right-0 hidden md:inline-block">
                    <Image
                        src="/default_right.f8462257.svg"
                        alt="left planners"
                        width={550}
                        height={450}
                        className="object-cover w-110 h-auto isolate"
                    />
                </div>
            </div>
        </main>
    )
}