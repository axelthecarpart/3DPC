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

import { Plus, ArrowLeftRight, CircuitBoard } from "lucide-react"
const apiUrl = "https://api.3dpc.me" // Changed from 5000 to 3000
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo, useEffect } from "react"


interface AddMotherboardProps {
    onMotherboardSelect: (cpu: any) => void;
    selectedMotherboard: any;
}

export default function AddMotherboard({ onMotherboardSelect, selectedMotherboard }: AddMotherboardProps) {
    const [motherboards, setMotherboards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchMotherboards = async (isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/motherboards`)
            if (!response.ok) throw new Error("Failed to fetch motherboards")
            const data = await response.json()
            setMotherboards((Array.isArray(data) ? data.map((item: any) => item.data) : []) || [])
        } catch (err) {
            setError(err instanceof Error ? err.message: "An error occured")
        } finally {
            if (isInitial) setLoading(false)
        }
    }

    useEffect(() => {
        if (dialogOpen && isInitialLoad) {
            setIsInitialLoad(false)
            fetchMotherboards(true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                 fetchMotherboards(false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])
        
    const filteredMotherboards = useMemo(() => {
        return motherboards.filter((motherboard) => {
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0) {
                const manufacturer = motherboard.metadata?.manufacturer;
                if (!manufacturer || !filters.manufacturer.includes(manufacturer)) {
                    return false;
                }
            }
            // Chipset filter
            if (filters.chipset && filters.chipset.length > 0) {
                const chipset = motherboard.specifications?.chipset;
                if (!chipset || !filters.chipset.includes(chipset)) {
                    return false;
                }
            }
            // Form Factor filter
            if (filters.formFactor && filters.formFactor.length > 0) {
                const formFactor = motherboard.specifications?.formFactor;
                if (!formFactor || !filters.formFactor.includes(formFactor)) {
                    return false;
                }
            }
            // Socket filter
            if (filters.socket && filters.socket.length > 0) {
                const socket = motherboard.metadata?.socket;
                if (!socket || !filters.socket.includes(socket)) {
                    return false;
                }
            }
            // Memory Type filter
            if (filters.memoryType && filters.memoryType.length > 0) {
                const memoryType = motherboard.specifications?.memory?.type;
                if (!memoryType || !filters.memoryType.includes(memoryType)) {
                    return false;
                }
            }
            return true;
        });
    }, [motherboards, filters]);
        
    const handleAddMotherboard = (motherboard: any) => {
        onMotherboardSelect(motherboard);
        setDialogOpen(false);
    };
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) fetchMotherboards();
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        {selectedMotherboard ? (
                            <>
                                <ArrowLeftRight />
                                Replace
                            </>
                        ) : (
                            <>
                                <Plus />
                                Select Motherboard
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                    <DialogHeader>
                        <DialogTitle><div className="flex gap-2 items-center"><CircuitBoard />Select Motherboard</div></DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex gap-4">
                                <BuilderFilters componentType="motherboard" onFilterChange={setFilters} components={motherboards} />
                                <div className="flex-1">
                                    {loading && <p>Loading...</p>}
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                        {filteredMotherboards.map((motherboard: any, index: number) => (
                                        <Item key={motherboard.id || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img 
                                                        src={`${apiUrl}/data/motherboards/images/${motherboard.id}.png`}
                                                        alt={motherboard.metadata?.name} 
                                                        className="h-24 object-contain" 
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                    <div className="hidden">
                                                        <div className="flex justify-center items-center flex-col gap-2">
                                                        <CircuitBoard className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                        </div>
                                                    </div>
                                                </ItemMedia>
                                            </ItemHeader>
                                            <ItemContent className="p-4">
                                                <ItemTitle className="line-clamp-2 mb-2">{motherboard.metadata?.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">Chipset: {motherboard.specifications?.chipset}</div>
                                                    <div className="truncate">Socket: {motherboard.metadata?.socket}</div>
                                                    <div className="truncate">Form Factor: {motherboard.specifications?.formFactor}</div>
                                                    <div className="truncate">{motherboard.specifications?.memory?.type} - {motherboard.specifications?.memory?.slots} Slots</div>
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Button variant="outline" className="w-auto right-0" onClick={() => handleAddMotherboard(motherboard)}>Add</Button>
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