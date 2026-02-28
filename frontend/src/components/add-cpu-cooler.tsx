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
import { Fan, Plus, ArrowLeftRight } from "lucide-react"
import { BuilderFilters } from "@/components/builder-filters"
import { useEffect, useMemo, useState } from "react"

const apiUrl = "https://api.3dpc.me"

interface AddCpuCoolerProps {
    onCoolerSelect: (cooler: any) => void
    selectedCooler: any
}

export default function AddCpuCooler({ onCoolerSelect, selectedCooler }: AddCpuCoolerProps) {
    const [coolers, setCoolers] = useState<any[]>([])
    const [initialCoolers, setInitialCoolers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<Record<string, any>>({})
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const fetchCoolers = async (currentFilters: Record<string, any>, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/cpu_coolers`)
            if (!response.ok) throw new Error("Failed to fetch CPU coolers")
            const data = await response.json()
            const resultList = Array.isArray(data) ? data : []
            setCoolers(resultList)

            if (Object.keys(currentFilters).length === 0 && initialCoolers.length === 0) {
                setInitialCoolers(resultList)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occured")
        } finally {
            if (isInitial) setLoading(false)
        }
    }

    useEffect(() => {
        if (dialogOpen && isInitialLoad) {
            setIsInitialLoad(false)
            fetchCoolers(filters, true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                fetchCoolers(filters, false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])

    const filteredCoolers = useMemo(() => {
        return coolers.filter((cooler) => {
            if (filters.manufacturer && filters.manufacturer.length > 0) {
                if (!cooler.manufacturer || !filters.manufacturer.includes(cooler.manufacturer)) {
                    return false
                }
            }
            if (filters.type && filters.type.length > 0) {
                if (!cooler.type || !filters.type.includes(cooler.type)) {
                    return false
                }
            }
            if (filters.socket && filters.socket.length > 0) {
                const sockets = Array.isArray(cooler.sockets) ? cooler.sockets : []
                if (sockets.length === 0 || !filters.socket.some((s: string) => sockets.includes(s))) {
                    return false
                }
            }
            if (filters.color && filters.color.length > 0) {
                if (!cooler.color || !filters.color.includes(cooler.color)) {
                    return false
                }
            }
            return true
        })
    }, [coolers, filters])

    const handleAddCooler = (cooler: any) => {
        onCoolerSelect(cooler)
        setDialogOpen(false)
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    {selectedCooler ? (
                        <>
                            <ArrowLeftRight />
                            Replace
                        </>
                    ) : (
                        <>
                            <Plus />
                            Select CPU Cooler
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex gap-2 items-center">
                            <Fan />Select CPU Cooler
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex gap-4">
                            <BuilderFilters
                                componentType="cpu_cooler"
                                onFilterChange={setFilters}
                                components={initialCoolers.length > 0 ? initialCoolers : coolers}
                            />
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
                                    {!loading && filteredCoolers.map((cooler: any, index: number) => (
                                        <Item key={cooler.id || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img
                                                        src={`${apiUrl}/data/cpu_coolers/images/${cooler.id}.png`}
                                                        alt={cooler.name}
                                                        className="h-24 object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                        }}
                                                    />
                                                    <div className="hidden flex justify-center items-center flex-col gap-2">
                                                        <Fan className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                    </div>
                                                </ItemMedia>
                                            </ItemHeader>
                                            <ItemContent className="p-4">
                                                <ItemTitle className="line-clamp-2 mb-2">{cooler.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">Type: {cooler.type}</div>
                                                    <div className="truncate">Color: {cooler.color}</div>
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Button variant="outline" size="default" className="w-auto right-0" onClick={() => handleAddCooler(cooler)}><Plus />Add</Button>
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