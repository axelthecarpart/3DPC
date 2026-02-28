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
import { Skeleton } from "@/components/ui/skeleton"

import { Plus, Gpu, ArrowLeftRight } from "lucide-react"
const apiUrl = "https://api.3dpc.me"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo, useEffect } from "react"


interface AddGpuProps {
    onGpuSelect: (gpu: any) => void;
    selectedGpu: any;
    hasExisting?: boolean;
}

export default function AddGpu({ onGpuSelect, selectedGpu, hasExisting }: AddGpuProps) {
    const [gpus, setGpus] = useState<any[]>([]);
    const [initialGpus, setInitialGpus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchGpus = async (isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/gpus`)
            if (!response.ok) throw new Error("Failed to fetch GPUs")
            const data = await response.json()
            const resultList = Array.isArray(data) ? data : [];
            setGpus(resultList)
            if (Object.keys(filters).length === 0 && initialGpus.length === 0) {
                setInitialGpus(resultList);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message: "An error occured")
        } finally {
            if (isInitial) setLoading(false)
        }
    }

    useEffect(() => {
        if (dialogOpen && isInitialLoad) {
            setIsInitialLoad(false)
            fetchGpus(true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                 fetchGpus(false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])
        
    const filteredGpus = useMemo(() => {
        return gpus.filter((gpu) => {
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(gpu.manufacturer)) {
                return false;
            }
            if (filters.chipset && filters.chipset.length > 0 && !filters.chipset.includes(gpu.chipset)) {
                return false;
            }
            if (filters.coreClock && Array.isArray(filters.coreClock)) {
                const [min, max] = filters.coreClock;
                if (gpu.core_clock < min || gpu.core_clock > max) return false;
            }
            if (filters.boostClock && Array.isArray(filters.boostClock)) {
                const [min, max] = filters.boostClock;
                if (gpu.boost_clock < min || gpu.boost_clock > max) return false;
            }
            if (filters.memorySize && Array.isArray(filters.memorySize)) {
                const [min, max] = filters.memorySize;
                if (gpu.memory < min || gpu.memory > max) return false;
            }
            if (filters.memoryType && filters.memoryType.length > 0 && !filters.memoryType.includes(gpu.memory_type)) {
                return false;
            }
            if (filters.tdp && Array.isArray(filters.tdp)) {
                const [min, max] = filters.tdp;
                if (gpu.tdp < min || gpu.tdp > max) return false;
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-1/2">
                        {hasExisting ? (
                            <>
                                <Plus />
                                Select additional GPU
                            </>
                        ) : selectedGpu ? (
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
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex gap-4">
                                <BuilderFilters componentType="gpu" onFilterChange={setFilters} components={initialGpus.length > 0 ? initialGpus : gpus} />
                                <div className="flex-1">
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                        {loading && Array.from({ length: 8 }).map((_, i) => (
                                            <Item key={i} variant="outline" className="p-0 overflow-clip">
                                                <ItemHeader className="justify-center bg-white p-4 h-32">
                                                </ItemHeader>
                                                <ItemContent className="p-4">
                                                    <Skeleton className="h-4 mb-4 w-1/2" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-3/5" />
                                                        <Skeleton className="h-4 w-4/5" />
                                                        <Skeleton className="h-4 w-3/5" />
                                                    </div>
                                                </ItemContent>
                                                <ItemFooter className="p-4 pt-0">
                                                    <Skeleton className="h-9 w-16" />
                                                </ItemFooter>
                                            </Item>
                                        ))}
                                        {!loading && filteredGpus.map((gpu: any, index: number) => (
                                        <Item key={gpu.id || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img src={`${apiUrl}/data/gpus/images/${gpu.id}.png`} alt={gpu.name} className="h-24 object-contain" onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }} />
                                                    <div className="hidden justify-center items-center flex-col gap-2">
                                                        <Gpu className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                    </div>
                                                </ItemMedia>
                                            </ItemHeader>
                                            <ItemContent className="p-4">
                                                <ItemTitle className="line-clamp-2 mb-2">{gpu.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">{gpu.memory} GB {gpu.memory_type}</div>
                                                    <div className="truncate">{gpu.core_clock} MHz Base / {gpu.boost_clock} MHz Boost</div>
                                                    <div className="truncate">{gpu.tdp}W TDP</div>
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Button variant="outline" className="w-auto" onClick={() => handleAddGpu(gpu)}><Plus />Add</Button>
                                            </ItemFooter>
                                        </Item>
                                        ))}
                                    </div>
                                </div>
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