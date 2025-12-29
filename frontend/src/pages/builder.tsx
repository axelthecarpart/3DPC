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
    }

    const handleSelectComponent = (component: any) => {
        setSelectedComponents(prev => ({
            ...prev,
            [currentComponentType]: component
        }))
        setIsOpen(false)
    }

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
                <DialogContent className="sm:max-w-300 w-full">
                    <DialogHeader>
                        <DialogTitle>Select {getComponentLabel(currentComponentType)}</DialogTitle>
                        <DialogDescription>
                            {components.length} {getComponentLabel(currentComponentType)}s available
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-150 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="text-center py-8">Loading components...</div>
                        ) : components.length > 0 ? (
                            <div className="grid grid-cols-4 gap-4">
                                {components.map((component, index) => (
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