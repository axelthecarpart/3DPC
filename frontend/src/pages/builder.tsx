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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Plus, Cpu, Gpu, MemoryStick, Fan, PcCase, CircuitBoard, HardDrive, Cable, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function BuilderPage() {
    const [components, setComponents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCpu, setSelectedCpu] = useState<any>(null)

    useEffect(() => {
        if (isOpen) {
            fetchComponents()
        }
    }, [isOpen])

    const fetchComponents = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5000/pc-parts/cpu')
            const data = await response.json()
            setComponents(data.items || [])
        } catch (error) {
            console.error('Error fetching components:', error)
            setComponents([])
        } finally {
            setLoading(false)
        }
    }

    const handleSelectComponent = (component: any) => {
        setSelectedCpu(component)
        setIsOpen(false)
    }
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold mb-4">PC Builder</h1>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <div>
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Cpu />
                            <span>CPU</span>
                        </div>
                        <div>{selectedCpu ? selectedCpu.name : "Component Placeholder"}</div>
                        <div className="ml-auto">
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                                <Plus />
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Fan />
                            <span>CPU Cooler</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <CircuitBoard />
                            <span>Motherboard</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <MemoryStick />
                            <span>RAM</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <HardDrive />
                            <span>Storage</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Gpu />
                            <span>GPU</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <PcCase />
                            <span>Case</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Cable />
                            <span>PSU</span>
                        </div>
                        <div>Component Placeholder</div>
                        <div className="ml-auto">
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>
                        </div>
                    </div>
                </div>
                <DialogContent className="sm:max-w-[1200px] w-full">
                    <DialogHeader>
                        <DialogTitle>Select CPU</DialogTitle>
                        <DialogDescription>
                            {components.length} CPUs available
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                        {loading ? (
                            <div className="text-center py-8">Loading components...</div>
                        ) : components.length > 0 ? (
                            <div className="grid grid-cols-4 gap-4">
                                {components.map((component, index) => (
                                    <div key={index}>
                                        <Item variant="outline" className="p-0 overflow-hidden">
                                            <ItemHeader className="p-0 m-0">
                                                <div className="bg-white w-full p-4 h-[140px] flex items-center justify-center">
                                                    {component.image && (
                                                        <img 
                                                            src={"http://localhost:5000/data/cpus" + component.image}
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
                                                {component.tdp && <ItemDescription>TDP: {component.tdp}W</ItemDescription>}
                                                {component.integratedGraphics && <ItemDescription>Integrated Graphics: {component.integratedGraphics}</ItemDescription>}
                                            </ItemContent>
                                            <ItemActions />
                                            <ItemFooter className="p-4"><Button size="sm" variant="outline" onClick={() => handleSelectComponent(component)}>Add</Button></ItemFooter>
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