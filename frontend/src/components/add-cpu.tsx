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

import { Plus, Cpu, ArrowLeftRight } from "lucide-react"
const apiUrl = "https://api.3dpc.me"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo } from "react"


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
            const response = await fetch(`${apiUrl}/cpus`)
            if (!response.ok) throw new Error("Failed to fetch CPUs")
            const data = await response.json()
            setCpus((Array.isArray(data) ? data.map((item: any) => item.data) : []) || [])
        } catch (err) {
            setError(err instanceof Error ? err.message: "An error occured")
        } finally {
            setLoading(false)
        }
    }
        
    const filteredCpus = useMemo(() => {
        return cpus.filter((cpu) => {
            // Extract manufacturer from CPU name (e.g., "AMD Ryzen..." -> "AMD")
            const manufacturer = cpu.metadata?.manufacturer
            
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(manufacturer)) {
                return false;
            }
            // Socket filter
            if (filters.socket && filters.socket.length > 0 && !filters.socket.includes(cpu.metadata?.socket)) {
                return false;
            }
            // Cores range filter
            if (filters.cores && Array.isArray(filters.cores)) {
                const [min, max] = filters.cores;
                const totalCores = cpu.specifications?.cores?.total || 0;
                if (totalCores < min || totalCores > max) return false;
            }
            // Threads range filter
            if (filters.threads && Array.isArray(filters.threads)) {
                const [min, max] = filters.threads;
                const threads = cpu.specifications?.cores?.threads || 0;
                if (threads < min || threads > max) return false;
            }
            // TDP range filter
            if (filters.tdp && Array.isArray(filters.tdp)) {
                const [min, max] = filters.tdp;
                const baseTdp = cpu.metadata?.tdp?.base || 0;
                if (baseTdp < min || baseTdp > max) return false;
            }
            // Integrated Graphics filter
            if (filters.hasGpu && filters.hasGpu.length > 0) {
                const hasGpu = cpu.specifications?.integratedGraphics?.model ? "Yes" : "No";
                if (!filters.hasGpu.includes(hasGpu)) return false;
            }
            if (filters.l3Cache && Array.isArray(filters.l3Cache)) {
                const [min, max] = filters.l3Cache;
                const l3 = cpu.specifications?.cache?.l3 || 0;
                if (l3 < min || l3 > max) return false;
            }
            if (filters.l2Cache && Array.isArray(filters.l2Cache)) {
                const [min, max] = filters.l2Cache;
                const l2 = cpu.specifications?.cache?.l2 || 0;
                if (l2 < min || l2 > max) return false;
            }
            return true;
        });
    }, [cpus, filters]);
        
    const handleAddCpu = (cpu: any) => {
        onCpuSelect(cpu);
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
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex gap-4">
                                <BuilderFilters componentType="cpu" onFilterChange={setFilters} components={cpus} />
                                <div className="flex-1">
                                    {loading && <p>Loading...</p>}
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                        {filteredCpus.map((cpu: any, index: number) => (
                                        <Item key={cpu.id || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img 
                                                        src={`${apiUrl}/data/cpus/images/${cpu.id}.png`}
                                                        alt={cpu.metadata?.name} 
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
                                                <ItemTitle className="line-clamp-2 mb-2">{cpu.metadata?.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">
                                                        {cpu.specifications?.cores?.total} Cores / {cpu.specifications?.cores?.threads} Threads
                                                    </div>
                                                    <div className="truncate">
                                                        {cpu.specifications?.clocks?.performance?.base} GHz Base / {cpu.specifications?.clocks?.performance?.boost} GHz Boost
                                                    </div>
                                                    <div className="truncate">{cpu.metadata?.tdp?.base}W TDP</div>
                                                    <div className="truncate">Socket: {cpu.metadata?.socket}</div>
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