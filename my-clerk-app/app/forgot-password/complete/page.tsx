import { TaskResetPassword } from "@clerk/nextjs";

export default function ResetPasswordTaskPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <TaskResetPassword redirectUrlComplete="/sign-in" />
    </div>
  );
}
