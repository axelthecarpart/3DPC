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

import { Plus, MemoryStick } from "lucide-react"
const apiUrl = "https://api.3dpc.me"
import { BuilderFilters } from "@/components/builder-filters"
import { useState, useMemo, useEffect } from "react"

interface AddRamProps {
    onRamSelect: (ram: any) => void
    selectedRam: any
    hasExisting?: boolean
}

export default function AddRam({ onRamSelect, selectedRam, hasExisting }: AddRamProps) {
    const [rams, setRams] = useState<any[]>([])
    const [allVariants, setAllVariants] = useState<any[]>([])
    const [initialRams, setInitialRams] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<Record<string, any>>({})
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedRamModel, setSelectedRamModel] = useState<any>(null)
    const [variantDialogOpen, setVariantDialogOpen] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const fetchRams = async (isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        setError(null)
        try {
            const [productsRes, variantsRes] = await Promise.all([
                fetch(`${apiUrl}/ram`),
                fetch(`${apiUrl}/ram_variants`),
            ])
            if (!productsRes.ok) throw new Error("Failed to fetch memory")
            if (!variantsRes.ok) throw new Error("Failed to fetch memory variants")
            const products = await productsRes.json()
            const variants = await variantsRes.json()
            const productList = Array.isArray(products) ? products : []
            const variantList = Array.isArray(variants) ? variants : []
            setAllVariants(variantList)
            setRams(productList)
            if (Object.keys(filters).length === 0 && initialRams.length === 0) {
                setInitialRams(productList)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            if (isInitial) setLoading(false)
        }
    }

    useEffect(() => {
        if (dialogOpen && isInitialLoad) {
            setIsInitialLoad(false)
            fetchRams(true)
        } else if (dialogOpen && !isInitialLoad) {
            const timeoutId = setTimeout(() => {
                fetchRams(false)
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [filters, dialogOpen])

    const filteredRams = useMemo(() => {
        return rams.filter((ram) => {
            if (filters.manufacturer && filters.manufacturer.length > 0 && !filters.manufacturer.includes(ram.manufacturer)) return false
            if (filters.type && filters.type.length > 0 && !filters.type.includes(ram.type)) return false
            const ramVariants = allVariants.filter((v) => v.id === ram.id)
            if (filters.color && filters.color.length > 0) {
                if (!ramVariants.some((v) => filters.color.includes(v.color))) return false
            }
            if (filters.speed && Array.isArray(filters.speed)) {
                const [min, max] = filters.speed
                if (!ramVariants.some((v) => v.speed >= min && v.speed <= max)) return false
            }
            if (filters.capacity && Array.isArray(filters.capacity)) {
                const [min, max] = filters.capacity
                if (!ramVariants.some((v) => v.capacity >= min && v.capacity <= max)) return false
            }
            return true
        })
    }, [rams, allVariants, filters])

    const handleSelectVariant = (ram: any, variant: any) => {
        onRamSelect({ ...ram, selectedVariant: variant })
        setVariantDialogOpen(false)
        setDialogOpen(false)
    }

    const handleChooseVariant = (ram: any) => {
        setSelectedRamModel(ram)
        setVariantDialogOpen(true)
    }

    const selectedModelVariants = selectedRamModel
        ? allVariants.filter((v) => v.id === selectedRamModel.id)
        : []

    const ramsWithVariants = useMemo(() =>
        (initialRams.length > 0 ? initialRams : rams).map(r => ({
            ...r,
            variants: allVariants.filter(v => v.id === r.id)
        }))
    , [initialRams, rams, allVariants])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-1/2">
                    {(hasExisting || selectedRam) ? (
                        <>
                            <Plus />
                            Select additional Memory
                        </>
                    ) : (
                        <>
                            <Plus />
                            Select Memory
                        </>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] w-full sm:max-w-360 flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex gap-2 items-center">
                            <MemoryStick />Select Memory
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex gap-4">
                            <BuilderFilters componentType="memory" onFilterChange={setFilters} components={ramsWithVariants} />
                            <div className="flex-1">
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                                    {loading && Array.from({ length: 8 }).map((_, i) => (
                                        <Item key={i} variant="outline" className="p-0 overflow-clip">
                                            <ItemHeader className="justify-center bg-white p-4 h-32" />
                                            <ItemContent className="p-4">
                                                <Skeleton className="h-4 mb-4 w-1/2" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-3/5" />
                                                    <Skeleton className="h-4 w-4/5" />
                                                    <Skeleton className="h-4 w-3/5" />
                                                </div>
                                            </ItemContent>
                                            <ItemFooter className="p-4 pt-0">
                                                <Skeleton className="h-9 w-24" />
                                            </ItemFooter>
                                        </Item>
                                    ))}
                                    {!loading && filteredRams.map((ram: any, index: number) => {
                                        const ramVariants = allVariants.filter((v) => v.id === ram.id)
                                        const speeds = ramVariants.map((v) => v.speed).filter(Boolean).sort((a: number, b: number) => a - b)
                                        const capacities = ramVariants.map((v) => v.capacity).filter(Boolean).sort((a: number, b: number) => a - b)
                                        const minCapacity = capacities[0]
                                        const maxCapacity = capacities[capacities.length - 1]
                                        const minSpeed = speeds[0]
                                        const maxSpeed = speeds[speeds.length - 1]
                                        return (
                                            <Item key={ram.id || index} variant="outline" className="p-0 overflow-clip">
                                                <ItemHeader className="justify-center bg-white p-4 h-32">
                                                    <ItemMedia className="h-full flex items-center justify-center">
                                                        <img
                                                            src={`${apiUrl}/data/memory/images/${ram.id}.png`}
                                                            alt={ram.name}
                                                            className="h-24 object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none"
                                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                                                                if (fallback) fallback.classList.remove("hidden")
                                                            }}
                                                        />
                                                        <div className="hidden justify-center items-center flex-col gap-2">
                                                            <MemoryStick className="h-12 w-12 text-muted-foreground" />
                                                            <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                        </div>
                                                    </ItemMedia>
                                                </ItemHeader>
                                                <ItemContent className="p-4">
                                                    <ItemTitle className="line-clamp-2 mb-2">{ram.name}</ItemTitle>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <div className="truncate">Type: {ram.type}</div>
                                                        <div className="truncate">
                                                            {minCapacity != null && maxCapacity != null
                                                                ? minCapacity === maxCapacity
                                                                    ? `${minCapacity} GB`
                                                                    : `${minCapacity} – ${maxCapacity} GB`
                                                                : "N/A"}
                                                        </div>
                                                        <div className="truncate">
                                                            {minSpeed != null && maxSpeed != null
                                                                ? minSpeed === maxSpeed
                                                                    ? `${minSpeed} MHz`
                                                                    : `${minSpeed} – ${maxSpeed} MHz`
                                                                : "N/A"}
                                                        </div>
                                                    </div>
                                                </ItemContent>
                                                <ItemFooter className="p-4 pt-0">
                                                    <Button variant="outline" className="w-auto" onClick={() => handleChooseVariant(ram)}>
                                                        Choose Kit
                                                    </Button>
                                                </ItemFooter>
                                            </Item>
                                        )
                                    })}
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

            {/* Variant Selection Dialog */}
            <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
                <DialogContent className="sm:max-w-4xl w-full h-[60vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Choose Kit — {selectedRamModel?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                            {selectedModelVariants.map((variant: any, idx: number) => (
                                <Item key={idx} variant="outline" className="p-0 overflow-clip">
                                    <ItemHeader className="justify-center bg-white p-4 h-32">
                                        <ItemMedia className="h-full flex items-center justify-center">
                                            <img
                                                src={`${apiUrl}/data/memory/images/${selectedRamModel.id}.png`}
                                                alt={selectedRamModel.name}
                                                className="h-24 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none"
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                                                    if (fallback) fallback.classList.remove("hidden")
                                                }}
                                            />
                                            <div className="hidden justify-center items-center flex-col gap-2">
                                                <MemoryStick className="h-12 w-12 text-muted-foreground" />
                                                <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                            </div>
                                        </ItemMedia>
                                    </ItemHeader>
                                    <ItemContent className="p-4">
                                        <ItemTitle className="line-clamp-2 mb-2">
                                            {variant.modules}× {variant.capacity / variant.modules} GB — {variant.capacity} GB Total
                                        </ItemTitle>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="truncate">Speed: {variant.speed} MHz</div>
                                            <div className="truncate">CL: {variant.cl}</div>
                                            <div className="truncate">Timings: {variant.timings}</div>
                                            <div className="truncate">Voltage: {variant.voltage != null ? `${variant.voltage}V` : 'N/A'}</div>
                                            <div className="truncate">Color: {variant.color || "N/A"}</div>
                                            {variant.intel_xmp && <div className="truncate">Intel XMP</div>}
                                            {variant.amd_expo && <div className="truncate">AMD EXPO</div>}
                                        </div>
                                    </ItemContent>
                                    <ItemFooter className="p-4 pt-0">
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" className="flex-1" onClick={() => handleSelectVariant(selectedRamModel, variant)}>
                                                <Plus />Add
                                            </Button>
                                            {variant.amazon_sku && (
                                                <Button
                                                    variant="default"
                                                    onClick={() => window.open(`https://www.amazon.com/dp/${variant.amazon_sku}?tag=3dpc043-20`, "_blank")}
                                                >
                                                    Buy
                                                </Button>
                                            )}
                                        </div>
                                    </ItemFooter>
                                </Item>
                            ))}
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
