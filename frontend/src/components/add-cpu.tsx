import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Plus, Cpu, X, Zap, Banknote, Rotate3D, ArrowLeftRight } from "lucide-react"
const apiUrl = "http://localhost:5000"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useEffect, useMemo } from "react"


interface AddCpuProps {
    onCpuSelect: (cpu: any) => void;
    selectedCpu: any;
}

export default function AddCpu({ onCpuSelect, selectedCpu }: AddCpuProps) {
    const [cpus, setCpus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchCPUs = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/pc-parts/cpu`)
            if (!response.ok) throw new Error("Failed to fetch CPUs")
            const data = await response.json()
            setCpus(data.items || [])
        } catch (err) {
            setError(err instanceof Error ? err.message: "An error occured")
        } finally {
            setLoading(false)
        }
    }
        
    const filteredCpus = useMemo(() => {
        return cpus.filter((cpu) => {
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(cpu.manufacturer)) {
                return false;
            }
            // Socket filter
            if (filters.socket && filters.socket.length > 0 && !filters.socket.includes(cpu.socket)) {
                return false;
            }
            // Cores range filter
            if (filters.cores && Array.isArray(filters.cores)) {
                const [min, max] = filters.cores;
                if (cpu.cores < min || cpu.cores > max) return false;
            }
            // Threads range filter
            if (filters.threads && Array.isArray(filters.threads)) {
                const [min, max] = filters.threads;
                if (cpu.threads < min || cpu.threads > max) return false;
            }
            // TDP range filter (note: filter uses "tdp" but CPU property is "baseTdp")
            if (filters.tdp && Array.isArray(filters.tdp)) {
                const [min, max] = filters.tdp;
                if (cpu.baseTdp < min || cpu.baseTdp > max) return false;
            }
            // Integrated Graphics filter
            if (filters.hasGpu && filters.hasGpu.length > 0) {
                const gpuName = cpu.graphics || "None";
                const gpuStatus = gpuName === "None" ? "No" : "Yes";
                if (!filters.hasGpu.includes(gpuStatus)) return false;
            }
            return true;
        });
    }, [cpus, filters]);
        
    const handleAddCpu = (cpu: any) => {
        onCpuSelect(cpu); // Use the prop callback instead
        setDialogOpen(false);
    };
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) fetchCPUs();
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        {selectedCpu ? (
                            <>
                                <ArrowLeftRight />
                                Replace
                            </>
                        ) : (
                            <>
                                <Plus />
                                Select CPU
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                    <DialogHeader>
                        <DialogTitle><div className="flex gap-2 items-center"><Cpu />Select CPU</div></DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        <div><BuilderFilters componentType="cpu" onFilterChange={setFilters} components={cpus} /></div>
                        <div className="flex-1 overflow-y-auto">
                            {loading && <p>Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                {filteredCpus.map((cpu: any, index: number) => (
                                <Item key={index} variant="outline" className="p-0 overflow-clip">
                                    <ItemHeader className="justify-center bg-white p-4">
                                        <ItemMedia>
                                            <img src={`${apiUrl}/data/cpus${cpu.image}`} alt={cpu.name} className="h-24 object-contain" />
                                        </ItemMedia>
                                    </ItemHeader>
                                    <ItemContent className="p-4">
                                        <ItemTitle className="line-clamp-2 mb-2">{cpu.name}</ItemTitle>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="truncate">{cpu.cores} Cores / {cpu.threads} Threads</div>
                                            <div className="truncate">{cpu.baseClock} GHz Base / {cpu.boostClock} GHz Boost</div>
                                            <div className="truncate">{cpu.baseTdp}W TDP</div>
                                            <div className="truncate">Socket: {cpu.socket}</div>
                                            <div className="font-semibold text-foreground truncate">${cpu.price}</div>
                                        </div>
                                    </ItemContent>
                                    <ItemFooter className="p-4 pt-0">
                                        <Button variant="outline" className="w-auto right-0" onClick={() => handleAddCpu(cpu)}>Add</Button>
                                    </ItemFooter>
                                </Item>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
  )
}