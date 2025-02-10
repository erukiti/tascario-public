import { useRouter } from "next/router";

type EntryErrorStateProps = {
  message: string;
};

export const EntryErrorState = ({ message }: EntryErrorStateProps) => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <p className="text-red-500">{message}</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
