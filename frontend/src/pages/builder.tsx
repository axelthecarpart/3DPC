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
import { BuilderFilters } from "@/components/builder-filters"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Plus, Cpu, X, Gpu, MemoryStick, Fan, PcCase, CircuitBoard, Cable, Zap, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect, useMemo } from "react"

export default function BuilderPage() {
    const [components, setComponents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [currentComponentType, setCurrentComponentType] = useState<string>('')
    const [selectedComponents, setSelectedComponents] = useState<{[key: string]: any}>({})
    const [filters, setFilters] = useState<Record<string, any>>({})

    useEffect(() => {
        if (isOpen && currentComponentType) {
            fetchComponents(currentComponentType)
        }
    }, [isOpen, currentComponentType])

    const fetchComponents = async (type: string) => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:5000/pc-parts/${type}`)
            const data = await response.json()
            setComponents(data.items || [])
        } catch (error) {
            console.error('Error fetching components:', error)
            setComponents([])
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = (type: string) => {
        setCurrentComponentType(type)
        setIsOpen(true)
        setFilters({})
    }

    const handleSelectComponent = (component: any) => {
        setSelectedComponents(prev => ({
            ...prev,
            [currentComponentType]: component
        }))
        setIsOpen(false)
    }

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters)
    }

    const filterComponents = (components: any[], filters: Record<string, any>) => {
        console.log('Filtering with filters:', filters)
        return components.filter((component) => {
            // Check each filter
            for (const [filterId, filterValue] of Object.entries(filters)) {
                console.log(`Checking filter ${filterId}:`, filterValue)
                // Skip empty filters
                if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
                    console.log(`Skipping empty filter ${filterId}`)
                    continue
                }

                // Handle range filters (arrays with [min, max]) - CHECK THIS FIRST!
                if (Array.isArray(filterValue) && filterValue.length === 2 && typeof filterValue[0] === 'number' && typeof filterValue[1] === 'number') {
                    const [min, max] = filterValue
                    
                    // Cores filter
                    if (filterId === 'cores') {
                        const cores = typeof component.cores === 'number' ? component.cores : parseInt(component.cores || '0')
                        console.log(`Checking cores: ${cores} against range [${min}, ${max}]`)
                        if (cores < min || cores > max) return false
                    }
                    // Threads filter
                    else if (filterId === 'threads') {
                        const threads = typeof component.threads === 'number' ? component.threads : parseInt(component.threads || '0')
                        console.log(`Checking threads: ${threads} against range [${min}, ${max}]`)
                        if (threads < min || threads > max) return false
                    }
                    // TDP filter
                    else if (filterId === 'tdp') {
                        const tdpValue = component.baseTdp || component.tdp || '0'
                        const tdp = typeof tdpValue === 'number' ? tdpValue : parseInt(tdpValue)
                        console.log(`Checking tdp: ${tdp} against range [${min}, ${max}]`)
                        if (tdp < min || tdp > max) return false
                    }
                }
                // Handle checkbox filters (arrays)
                else if (Array.isArray(filterValue) && filterValue.length > 0) {
                    // Manufacturer filter
                    if (filterId === 'manufacturer') {
                        const componentManufacturer = component.manufacturer || component.brand || ''
                        if (!filterValue.some(v => componentManufacturer.toLowerCase().includes(v.toLowerCase()))) {
                            return false
                        }
                    }
                    // Socket filter
                    else if (filterId === 'socket') {
                        const componentSocket = component.socket || ''
                        if (!filterValue.includes(componentSocket)) {
                            return false
                        }
                    }
                    // Has GPU filter (integrated graphics)
                    else if (filterId === 'hasGpu') {
                        const hasIntegratedGraphics = component.graphics && component.graphics !== 'None' && component.graphics !== ''
                        const wantsGpu = filterValue.includes('Yes')
                        const wantsNoGpu = filterValue.includes('No')
                        
                        // If both or neither are selected, show all
                        if ((wantsGpu && wantsNoGpu) || (!wantsGpu && !wantsNoGpu)) {
                            // Show all
                        }
                        // If only wants GPU, show only those with integrated graphics
                        else if (wantsGpu && !wantsNoGpu) {
                            if (!hasIntegratedGraphics) return false
                        }
                        // If only wants no GPU, show only those without integrated graphics
                        else if (!wantsGpu && wantsNoGpu) {
                            if (hasIntegratedGraphics) return false
                        }
                    }
                }
            }
            
            return true
        })
    }

    const filteredComponents = useMemo(() => {
        return filterComponents(components, filters)
    }, [components, filters])

    const getComponentLabel = (type: string) => {
        const labels: {[key: string]: string} = {
            'cpu': 'CPU',
            'cpu-cooler': 'CPU Cooler',
            'motherboard': 'Motherboard',
            'ram': 'RAM',
            'gpu': 'GPU',
            'case': 'Case',
            'psu': 'PSU'
        }
        return labels[type] || type
    }
    const getMaxTdp = (comp: any) => {
        if (!comp) return 0
        const keys = ['maxTdp','tdpMax','tdp_peak','tdpPeak','tdp_boost','boostTdp','peakPower','powerMax','maxPower','powerPeak','tdp','watt','power','powerDraw']
        for (const k of keys) {
            const v = comp[k]
            if (v !== undefined && v !== null && v !== '') {
                const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9\.]/g, ''))
                if (!Number.isNaN(n) && n > 0) return n
            }
        }
        return 0
    }

    const totalWattage = useMemo(() => {
        return Object.values(selectedComponents).reduce((sum: number, comp: any) => {
            return sum + getMaxTdp(comp)
        }, 0)
    }, [selectedComponents])

    const dataFolder = (type: string) => {
        // Backend folders use some irregular names
        if (type === 'psu') return 'power supplies'
        if (type === 'cpu-cooler') return 'cpu coolers'
        return `${type}s`
    }

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold mt-8 mb-4">PC Builder</h1>
            </div>
            <div>
                <ButtonGroup>
                    <Button variant="outline"><Zap />{totalWattage}W</Button>
                    <Button variant="outline"><Banknote />$1000</Button>
                </ButtonGroup>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cpu />
                            <span className="w-32 text-left">CPU</span>
                                                        {selectedComponents['cpu'] && (
                                                            <img
                                                                src={`http://localhost:5000/data/${dataFolder('cpu')}` + selectedComponents['cpu'].image}
                                                                alt={selectedComponents['cpu'].name}
                                                                className="h-16 w-16 object-contain rounded bg-white border"
                                                            />
                                                        )}
                            <span>
                              {selectedComponents['cpu'] ? selectedComponents['cpu'].name : ""}
                            </span>
                        </div>
                        {selectedComponents['cpu'] ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setSelectedComponents(prev => ({ ...prev, cpu: undefined }))
                            }
                            aria-label="Remove CPU"
                          >
                            <X />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog('cpu')}
                            aria-label="Add CPU"
                          >
                            <Plus />
                          </Button>
                        )}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Fan />
                            <span className="w-32 text-left">CPU Cooler</span>
                            <span>{selectedComponents['cpu-cooler'] ? selectedComponents['cpu-cooler'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('cpu-cooler')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CircuitBoard />
                            <span className="w-32 text-left">Motherboard</span>
                            <span>{selectedComponents['motherboard'] ? selectedComponents['motherboard'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('motherboard')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MemoryStick />
                            <span className="w-32 text-left">RAM</span>
                            <span>{selectedComponents['ram'] ? selectedComponents['ram'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('ram')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MemoryStick />
                            <span className="w-32 text-left">Storage</span>
                            <span>{selectedComponents['storage'] ? selectedComponents['storage'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('storage')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Gpu />
                            <span className="w-32 text-left">GPU</span>
                            <span>{selectedComponents['gpu'] ? selectedComponents['gpu'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('gpu')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PcCase />
                            <span className="w-32 text-left">Case</span>
                            <span>{selectedComponents['case'] ? selectedComponents['case'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('case')}>
                            <Plus />
                        </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cable />
                            <span className="w-32 text-left">Power Supply</span>
                            <span>{selectedComponents['psu'] ? selectedComponents['psu'].name : ""}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('psu')}>
                            <Plus />
                        </Button>
                    </div>
                </div>
                <DialogContent className="sm:max-w-360 w-full h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select {getComponentLabel(currentComponentType)}</DialogTitle>
                        <DialogDescription>
                            {filteredComponents.length} of {components.length} {getComponentLabel(currentComponentType)}s
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 relative">
                        {loading ? (
                            <div className="text-center py-8">Loading components...</div>
                        ) : components.length > 0 ? (
                            <div className="flex">
                                <BuilderFilters componentType={currentComponentType} onFilterChange={handleFilterChange} />
                                
                            <div className="grid grid-cols-4 gap-4 flex-1">
                                {filteredComponents.map((component, index) => (
                                    <div key={index}>
                                        <Item variant="outline" className="p-0 overflow-hidden">
                                            <ItemHeader className="p-0 m-0">
                                                <div className="bg-white w-full p-4 h-35 flex items-center justify-center">
                                                    {component.image && (
                                                        <img 
                                                            src={`http://localhost:5000/data/${dataFolder(currentComponentType)}` + component.image}
                                                            alt={component.name}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                            </ItemHeader>
                                            <ItemMedia />
                                            <ItemContent>
                                                <ItemTitle>{component.name || 'Unknown CPU'}</ItemTitle>
                                                {component.cores && <ItemDescription>Core Count: {component.cores}</ItemDescription>}
                                                {component.baseClock && <ItemDescription>Base Clock: {component.baseClock} GHz</ItemDescription>}
                                                {component.boostClock && <ItemDescription>Boost Clock: {component.boostClock} GHz</ItemDescription>}
                                                {component.baseTdp && <ItemDescription>Base TDP: {component.baseTdp}W</ItemDescription>}
                                                {component.integratedGraphics && <ItemDescription>Integrated Graphics: {component.integratedGraphics}</ItemDescription>}
                                            </ItemContent>
                                            <ItemActions />
                                            <ItemFooter className="p-4">
                                                <Button size="sm" variant="outline" onClick={() => handleSelectComponent(component)}>Add</Button>
                                            </ItemFooter>
                                        </Item>
                                    </div>
                                ))}
                            </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No components available
                            </div>
                        )}
                        
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Separator className="my-4" />
        </>
    )
}