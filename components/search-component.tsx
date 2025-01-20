import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useId } from "react";

export default function SearchComponent() {
    const id = useId();
    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    id={id}
                    className="peer pe-9 ps-9 bg-[#27272A] text-slate-100 placeholder:text-slate-400 border-none text-sm"
                    placeholder="Search..."
                    type="search"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Search size={16} strokeWidth={2} />
                </div>
                <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors hover:text-slate-200 focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="submit"
                >
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
