import {
  Item,
  ItemContent,
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

import { Plus, Gpu, ArrowLeftRight } from "lucide-react"
const apiUrl = "http://localhost:5000"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo } from "react"


interface AddGpuProps {
    onGpuSelect: (gpu: any) => void;
    selectedGpu: any;
}

export default function AddGpu({ onGpuSelect, selectedGpu }: AddGpuProps) {
    const [gpus, setGpus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchGpus = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/pc-parts/gpu`)
            if (!response.ok) throw new Error("Failed to fetch GPUs")
            const data = await response.json()
            setGpus(data.items || [])
        } catch (err) {
            setError(err instanceof Error ? err.message: "An error occured")
        } finally {
            setLoading(false)
        }
    }
        
    const filteredGpus = useMemo(() => {
        return gpus.filter((gpu) => {
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(gpu.manufacturer)) {
                return false;
            }
            //Chipset Manufacturer filter
            if (filters.chipsetManufacturer && filters.chipsetManufacturer.length > 0 && !filters.chipsetManufacturer.includes(gpu.chipsetManufacturer)) {
                return false;
            }
            if (filters.chipset && filters.chipset.length > 0 && !filters.chipset.includes(gpu.chipset)) {
                return false;
            }
            if (filters.coreClock && Array.isArray(filters.coreClock)) {
                const [min, max] = filters.coreClock;
                if (gpu.coreClock < min || gpu.coreClock > max) return false;
            }
            if (filters.boostClock && Array.isArray(filters.boostClock)) {
                const [min, max] = filters.boostClock;
                if (gpu.boostClock < min || gpu.boostClock > max) return false;
            }
            if (filters.memorySize && Array.isArray(filters.memorySize)) {
                const [min, max] = filters.memorySize;
                if (gpu.memory < min || gpu.memory > max) return false;
            }
            if (filters.memoryType && filters.memoryType.length > 0 && !filters.memoryType.includes(gpu.memoryType)) {
                return false;
            }
            if (filters.tdp && Array.isArray(filters.tdp)) {
                const [min, max] = filters.tdp;
                if (gpu.tdp < min || gpu.tdp > max) return false;
            }
            if (filters.interface && filters.interface.length > 0 && !filters.interface.includes(gpu.interface)) {
                return false;
            }
            if (filters.color && filters.color.length > 0 && !filters.color.includes(gpu.color)) {
                return false;
            }
            return true;
        });
    }, [gpus, filters]);
        
    const handleAddGpu = (gpu: any) => {
        onGpuSelect(gpu); // Use the prop callback instead
        setDialogOpen(false);
    };
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) fetchGpus();
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        {selectedGpu ? (
                            <>
                                <ArrowLeftRight />
                                Replace
                            </>
                        ) : (
                            <>
                                <Plus />
                                Select GPU
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                    <DialogHeader>
                        <DialogTitle><div className="flex gap-2 items-center"><Gpu />Select GPU</div></DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        <div><BuilderFilters componentType="gpu" onFilterChange={setFilters} components={gpus} /></div>
                        <div className="flex-1 overflow-y-auto">
                            {loading && <p>Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                {filteredGpus.map((gpu: any, index: number) => (
                                <Item key={index} variant="outline" className="p-0 overflow-clip">
                                    <ItemHeader className="justify-center bg-white p-4 h-32">
                                        <ItemMedia>
                                            <img src={`${apiUrl}/data/gpus${gpu.image}`} alt={gpu.name} className="h-24 object-contain"onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }} />
                                            <div className="hidden flex justify-center items-center flex-col gap-2">
                                                <Gpu className="h-12 w-12 text-muted-foreground" />
                                                <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                            </div>
                                        </ItemMedia>
                                    </ItemHeader>
                                    <ItemContent className="p-4">
                                        <ItemTitle className="line-clamp-2 mb-2">{gpu.name}</ItemTitle>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="truncate">{gpu.memory} GB {gpu.memoryType} Memory</div>
                                            <div className="truncate">{gpu.baseClock} GHz Base / {gpu.boostClock} GHz Boost</div>
                                            <div className="truncate">{gpu.tdp}W TDP</div>
                                            <div className="font-semibold text-foreground truncate">${gpu.price}</div>
                                        </div>
                                    </ItemContent>
                                    <ItemFooter className="p-4 pt-0">
                                        <Button variant="outline" className="w-auto right-0" onClick={() => handleAddGpu(gpu)}>Add</Button>
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