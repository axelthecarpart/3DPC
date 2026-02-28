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

import { Plus, Cpu, ArrowLeftRight } from "lucide-react"
const apiUrl = "https://api.3dpc.me"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo, useEffect } from "react"


interface AddCpuProps {
    onCpuSelect: (cpu: any) => void;
    selectedCpu: any;
}

export default function AddCpu({ onCpuSelect, selectedCpu }: AddCpuProps) {
    const [cpus, setCpus] = useState<any[]>([]);
    const [initialCpus, setInitialCpus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchCPUs = async (currentFilters: Record<string, any>, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const url = `${apiUrl}/cpus`

            const response = await fetch(url)
            if (!response.ok) throw new Error("Failed to fetch CPUs")
            const data = await response.json()
            
            const resultList = Array.isArray(data) ? data : [];
            setCpus(resultList)
            
            if (Object.keys(currentFilters).length === 0 && initialCpus.length === 0) {
                 setInitialCpus(resultList);
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
            fetchCPUs(filters, true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                 fetchCPUs(filters, false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])
        
    const filteredCpus = useMemo(() => {
        return cpus.filter((cpu) => {
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(cpu.manufacturer)) {
                return false;
            }
            // Cores range filter
            if (filters.cores && Array.isArray(filters.cores)) {
                const [min, max] = filters.cores;
                const totalCores = cpu.cores || 0;
                if (totalCores < min || totalCores > max) return false;
            }
            // Threads range filter
            if (filters.threads && Array.isArray(filters.threads)) {
                const [min, max] = filters.threads;
                const threads = cpu.threads || 0;
                if (threads < min || threads > max) return false;
            }
            // TDP range filter
            if (filters.tdp && Array.isArray(filters.tdp)) {
                const [min, max] = filters.tdp;
                const baseTdp = cpu.base_tdp || 0;
                if (baseTdp < min || baseTdp > max) return false;
            }
            // Integrated Graphics filter
            if (filters.hasGpu) {
                if (!cpu.graphics) return false;
            }
            if (filters.l3Cache && Array.isArray(filters.l3Cache)) {
                const [min, max] = filters.l3Cache;
                const l3 = cpu.l3_cache || 0;
                if (l3 < min || l3 > max) return false;
            }
            if (filters.l2Cache && Array.isArray(filters.l2Cache)) {
                const [min, max] = filters.l2Cache;
                const l2 = cpu.l2_cache || 0;
                if (l2 < min || l2 > max) return false;
            }
            if (filters.socket && filters.socket.length > 0 && !filters.socket.includes(cpu.socket)) {
                return false;
            }
            return true;
        });
    }, [cpus, filters]);
        
    const handleAddCpu = (cpu: any) => {
        onCpuSelect(cpu);
        setDialogOpen(false);
    };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex gap-4">
                                <BuilderFilters componentType="cpu" onFilterChange={setFilters} components={initialCpus.length > 0 ? initialCpus : cpus} />
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
                                        {!loading && filteredCpus.map((cpu: any, index: number) => (
                                        <Item key={cpu.id || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img 
                                                        src={`${apiUrl}/data/cpus/images/${cpu.id}.png`}
                                                        alt={cpu.name} 
                                                        className="h-24 object-contain" 
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                    <div className="hidden flex justify-center items-center flex-col gap-2">
                                                        <Cpu className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                    </div>
                                                </ItemMedia>
                                            </ItemHeader>
                                            <ItemContent className="p-4">
                                                <ItemTitle className="line-clamp-2 mb-2">{cpu.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">
                                                        {cpu.cores} Cores / {cpu.threads} Threads
                                                    </div>
                                                    <div className="truncate">
                                                        {cpu.base_clock} GHz Base / {cpu.boost_clock} GHz Boost
                                                    </div>
                                                    <div className="truncate">Socket {cpu.socket}</div>
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Button variant="outline" size="default" className="w-auto right-0" onClick={() => handleAddCpu(cpu)}><Plus />Add</Button>
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