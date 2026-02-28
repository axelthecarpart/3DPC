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

import { Plus, HardDrive, ArrowLeftRight } from "lucide-react"
const apiUrl = "https://api.3dpc.me"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo, useEffect } from "react"


interface AddStorageProps {
    onStorageSelect: (storage: any) => void
    selectedStorage: any
    hasExisting?: boolean
}

export default function AddStorage({ onStorageSelect, selectedStorage, hasExisting }: AddStorageProps) {
    const [storage, setstorage] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<Record<string, any>>({})
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedStorageModel, setSelectedStorageModel] = useState<any>(null)
    const [variantDialogOpen, setVariantDialogOpen] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const fetchStorage = async (isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}/storage`)
            if (!response.ok) throw new Error("Failed to fetch Storage")
            const data = await response.json()
            setstorage(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occured")
        } finally {
            if (isInitial) setLoading(false)
        }
    }

    useEffect(() => {
        if (dialogOpen && isInitialLoad) {
            setIsInitialLoad(false)
            fetchStorage(true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                 fetchStorage(false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])

    const filteredstorage = useMemo(() => {
        return storage.filter((s) => {
            // Manufacturer filter
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(s.manufacturer)) return false
            // type (SSD/HDD)
            if (filters.type && filters.type.length > 0 && !filters.type.includes(s.type)) return false
            // interface (PCIe, SATA, etc.)
            if (filters.interface && filters.interface.length > 0) {
                if (!filters.interface.includes(s.interface)) return false
            }
            if (filters.formFactor && filters.formFactor.length > 0 && !filters.formFactor.includes(s.form_factor)) return false
            
            // Capacity filter (range)
            if (filters.capacity && filters.capacity.length === 2) {
                const [minCapacity, maxCapacity] = filters.capacity
                const hasMatchingCapacity = s.variants?.some((v: any) => 
                    v.capacityGB >= minCapacity && v.capacityGB <= maxCapacity
                )
                if (!hasMatchingCapacity) return false
            }
            
            return true
        })
    }, [storage, filters])

    const handleAddStorage = (s: any, variant: any) => {
        onStorageSelect({ ...s, selectedVariant: variant })
        setDialogOpen(false)
        setVariantDialogOpen(false)
    }

    const handleChooseCapacity = (s: any) => {
        setSelectedStorageModel(s)
        setVariantDialogOpen(true)
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setDialogOpen(open)
                if (open) fetchStorage()
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-1/2">
                    {hasExisting ? (
                        <>
                            <Plus />
                            Select additional Storage
                        </>
                    ) : selectedStorage ? (
                        <>
                            <ArrowLeftRight />
                            Replace
                        </>
                    ) : (
                        <>
                            <Plus />
                            Select Storage
                        </>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex gap-2 items-center">
                            <HardDrive />Select Storage
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex gap-4">
                            <BuilderFilters componentType="storage" onFilterChange={setFilters} components={storage} />
                            <div className="flex-1">
                                {loading && <p>Loading...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                    {filteredstorage.map((s: any, index: number) => (
                                        <Item key={s.name || index} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32">
                                                <ItemMedia className="h-full flex items-center justify-center">
                                                    <img
                                                        src={`${apiUrl}/data/storage/images/${s.id}.png`}
                                                        alt={s.name}
                                                        className="h-24 object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none"
                                                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                                        }}
                                                    />
                                                    <div className="hidden">
                                                        <div className="flex justify-center items-center flex-col gap-2">
                                                            <HardDrive className="h-12 w-12 text-muted-foreground" />
                                                            <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                        </div>
                                                    </div>
                                                </ItemMedia>
                                            </ItemHeader>
                                            <ItemContent className="p-4">
                                                <ItemTitle className="line-clamp-2 mb-2">{s.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div className="truncate">
                                                        {(() => {
                                                            const capacities = s.variants?.map((v: any) => v.capacityGB).filter(Boolean).sort((a: number, b: number) => a - b) || []
                                                            if (capacities.length === 0) return 'N/A'
                                                            const min = capacities[0]
                                                            const max = capacities[capacities.length - 1]
                                                            const formatCapacity = (gb: number) => gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`
                                                            return min === max ? formatCapacity(min) : `${formatCapacity(min)} - ${formatCapacity(max)}`
                                                        })()}
                                                    </div>
                                                    <div className="truncate">Type: {s.type}</div>
                                                    <div className="truncate">Interface: {s.interface}</div>
                                                    <div className="truncate">Form Factor: {s.form_factor || 'N/A'}</div>
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Button variant="outline" className="w-auto right-0" onClick={() => handleChooseCapacity(s)}>
                                                    Choose Capacity 
                                                </Button>
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
            
            {/* Capacity Variant Selection Dialog */}
            <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
                <DialogContent className="sm:max-w-4xl w-full h-[50vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Choose Capacity - {selectedStorageModel?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                        {selectedStorageModel?.variants?.map((variant: any) => {
                            const formatCapacity = (gb: number) => gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`
                            return (
                                <>
                                <div>
                                <Item variant="outline" className="p-0 overflow-clip">
                                    <ItemHeader className="justify-center bg-white p-4 h-32">
                                        <ItemMedia className="h-full flex items-center justify-center">
                                                <img
                                                        src={'x.png'}
                                                        alt={variant.metadata?.name}
                                                        className="h-24 object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none"
                                                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                                        }}
                                                    />
                                                    <div className="hidden">
                                                        <div className="flex justify-center items-center flex-col gap-2">
                                                        <HardDrive className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                        </div>
                                                    </div>
                                        </ItemMedia>
                                    </ItemHeader>
                                    <ItemContent className="p-4">
                                        <ItemTitle className="line-clamp-2 mb-2">Capacity: {formatCapacity(variant.capacityGB)}</ItemTitle>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="truncate">Cache: {variant.cacheMB ? `${variant.cacheMB} MB` : 'N/A'}</div>
                                                <div className="truncate">Read: {variant.performance?.sequencial?.readMBps ? `${variant.performance.sequencial.readMBps} MB/s` : 'N/A'}</div>
                                                <div className="truncate">Write: {variant.performance?.sequencial?.writeMBps ? `${variant.performance.sequencial.writeMBps} MB/s` : 'N/A'}</div>                                            </div>
                                    </ItemContent>
                                    <ItemFooter className="p-4 pt-0">
                                        <Button variant="outline" className="w-auto right-0" onClick={() => handleAddStorage(selectedStorageModel, variant)}>
                                            <Plus />Add
                                        </Button>
                                    </ItemFooter>
                                </Item>
                                </div>
                                </>
                            )
                        })}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}