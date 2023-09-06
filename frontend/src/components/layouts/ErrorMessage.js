import { XCircleIcon } from "@heroicons/react/solid";
import { useAuth } from "../../contexts/AuthContext";

export default function ErrorMessage() {
    const { error, setError } = useAuth();

    return(
        error && (
            <div className="absolute left-1/2 buttom-0 transform -translate-x-1/2 z-10">
                <div className="rounded-md max-w-md w-full bg-red-50 p-4 mt-4">
                    <div className="flex max-w-md">
                        <button className="flex-shrink-0" onClick={() => setError("")}>
                            <XCircleIcon
                                className="h-5 w-5 text-red-400"
                                aria-hidden="true"
                            />
                        </button>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                {error}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}