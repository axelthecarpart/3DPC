import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Cpu, X, Fan, CircuitBoard, HardDrive, Banknote, Rotate3D, ShoppingCart, LayoutGrid, List, Gpu, Zap, Box, MemoryStick } from "lucide-react"

import { useState, useMemo } from "react"

import AddCpu from "@/components/add-cpu"
import AddStorage from "@/components/add-storage"
import AddMotherboard from "@/components/add-motherboard"
import AddCpuCooler from "@/components/add-cpu-cooler"
import AddGpu from "@/components/add-gpu"
import AddRam from "@/components/add-ram"
import WattageDialog from "@/components/wattage"

const apiUrl = "https://api.3dpc.me"
const amazonAffiliateTag = "3dpc043-20"

export default function BuilderPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


    const [selectedCpu, setSelectedCpu] = useState<any>(null);
    const [selectedGpus, setSelectedGpus] = useState<any[]>([]);
    const [selectedMemories, setSelectedMemories] = useState<any[]>([]);
    const [memoryImageLoadedMap, setMemoryImageLoadedMap] = useState<Record<number, boolean>>({});
    const [selectedStorageDevices, setSelectedStorageDevices] = useState<any[]>([]);
    const [cpuImageLoaded, setCpuImageLoaded] = useState(false);
    const [storageImageLoadedMap, setStorageImageLoadedMap] = useState<Record<number, boolean>>({});
    const [selectedMotherboard, setSelectedMotherboard] = useState<any>(null);
    const [motherboardImageLoaded, setMotherboardImageLoaded] = useState(false);
    const [selectedCpuCooler, setSelectedCpuCooler] = useState<any>(null);
    const [cpuCoolerImageLoaded, setCpuCoolerImageLoaded] = useState(false);
    const [gpuImageLoadedMap, setGpuImageLoadedMap] = useState<Record<number, boolean>>({});
    const selectedMotherboardSeller = selectedMotherboard?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "");


    const wattage = useMemo(() => {
    const parseNumber = (v: any) => {
        if (v == null) return 0
        const n = Number(v)
        return Number.isFinite(n) ? n : 0
    }

    const cpuTdp = parseNumber(selectedCpu?.max_tdp)

    const gpuTdp = selectedGpus.reduce((sum: number, gpu: any) => sum + parseNumber(gpu?.tdp), 0)

    const coolerType: string = selectedCpuCooler?.type ?? ""
    const coolerWattage = coolerType === "Air" ? 10
        : coolerType.startsWith("AIO") ? 15
        : 0

    const storageWattage = selectedStorageDevices.reduce((sum: number, s: any) => {
        const tdpMax = s.selectedVariant?.tdp?.max
        if (tdpMax != null && Number.isFinite(Number(tdpMax))) return sum + Number(tdpMax)
        // fallback estimate
        const iface: string = s.interface ?? ""
        const type: string = s.type ?? ""
        const isNvme = /nvme|m\.2/i.test(iface) || /nvme/i.test(type)
        const isHdd = /hdd|hard disk/i.test(type)
        return sum + (isHdd ? 7 : isNvme ? 5 : 3)
    }, 0)

    const memoryWattage = selectedMemories.reduce((sum: number, m: any) => sum + parseNumber(m?.selectedVariant?.wattage ?? 5), 0)

        return cpuTdp + gpuTdp + coolerWattage + storageWattage + memoryWattage
    }, [selectedCpu, selectedGpus, selectedCpuCooler, selectedStorageDevices, selectedMemories])
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">PC Builder</h1>
            <Separator className="mb-4" />
            <div className="justify-between flex mb-4">
                <div className="flex gap-4">

                <ButtonGroup className="mb-4">
                    <WattageDialog
                        totalWattage={wattage}
                        selectedCpu={selectedCpu}
                        selectedGpus={selectedGpus}
                        selectedCpuCooler={selectedCpuCooler}
                        selectedStorageDevices={selectedStorageDevices}
                        selectedMemoryModules={selectedMemories}
                    />
                    <Button variant="outline" size="lg"><Banknote />$</Button>
                </ButtonGroup>
                <ButtonGroup className="mb-4">
                    <Button variant={viewMode === "grid" ? "default" : "outline"} size="lg" onClick={() => setViewMode('grid')}><LayoutGrid /></Button>
                    <Button variant={viewMode === "list" ? "default" : "outline"} size="lg" onClick={() => setViewMode('list')}><List /></Button>
                </ButtonGroup>
                </div>
                <Button variant="default" size="lg" className="ml-4" disabled><Rotate3D />3D View</Button>
            </div>
            <div>
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit content-start">
                                {selectedCpu ? (
                                    <>
                                        <ItemHeader>
                                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                                {!cpuImageLoaded && (
                                                <div className="flex justify-center items-center flex-col gap-2">
                                                    <Cpu className="h-12 w-12 text-muted-foreground" />
                                                    <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                </div>
                                                )}
                                                <img 
                                                    src={`${apiUrl}/data/cpus/images/${selectedCpu.id}.png`} 
                                                    alt={selectedCpu.name} 
                                                    className={`h-24 object-contain ${cpuImageLoaded ? '' : 'hidden'}`}
                                                    onLoad={() => setCpuImageLoaded(true)}
                                                    onError={() => setCpuImageLoaded(false)}
                                                />
                                            </ItemMedia>
                                            </ItemHeader>
                                        <ItemContent className="p-4 flex flex-col justify-between" style={{ minHeight: '260px' }}>
                                            <div>
                                                <ItemTitle className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 w-full"><Cpu />CPU</ItemTitle>
                                                <ItemTitle className="line-clamp-2 mb-2 flex items-center justify-center w-full">{selectedCpu.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground px-4 pb-2">
                                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                                    <div className="truncate">{selectedCpu.clocks?.base} GHz Base / {selectedCpu.clocks?.boost} GHz Boost</div>
                                                    <div className="truncate">{selectedCpu.tdp}W TDP</div>
                                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <div className="flex-1"><AddCpu onCpuSelect={(cpu) => { setSelectedCpu(cpu); setCpuImageLoaded(false); }} selectedCpu={selectedCpu}/></div>
                                                    <Button variant="default" onClick={() => selectedCpu && window.open(`https://www.amazon.com/dp/${selectedCpu.amazon_sku}?tag=${amazonAffiliateTag}`, '_blank')} disabled={!selectedCpu || !selectedCpu.amazon_sku}>
                                                        <ShoppingCart />Buy
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => { setSelectedCpu(null); setCpuImageLoaded(false); }}><X /></Button>
                                            </div>
                                        </ItemContent>
                                    </>
                                ):(
                                    <>
                                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                            <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Cpu />CPU</ItemTitle>
                                            <AddCpu onCpuSelect={(cpu) => { setSelectedCpu(cpu); setCpuImageLoaded(false); }} selectedCpu={selectedCpu}/>
                                        </ItemContent>
                                    </>
                                )}
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit content-start">
                                {selectedCpuCooler ? (
                                    <>
                                        <ItemHeader>
                                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                                {!cpuCoolerImageLoaded && (
                                                    <div className="flex justify-center items-center flex-col gap-2">
                                                        <Fan className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                    </div>
                                                )}
                                                <img
                                                    src={`${apiUrl}/data/cpu_coolers/images/${selectedCpuCooler.id}.png`}
                                                    alt={selectedCpuCooler.name}
                                                    className={`h-24 object-contain ${cpuCoolerImageLoaded ? '' : 'hidden'}`}
                                                    onLoad={() => setCpuCoolerImageLoaded(true)}
                                                    onError={() => setCpuCoolerImageLoaded(false)}
                                                />
                                            </ItemMedia>
                                        </ItemHeader>
                                        <ItemContent className="p-4 flex flex-col justify-between" style={{ minHeight: '260px' }}>
                                            <div>
                                                <ItemTitle className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 w-full"><Fan />CPU Cooler</ItemTitle>
                                                <ItemTitle className="line-clamp-2 mb-2 flex items-center justify-center w-full">{selectedCpuCooler.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground px-4 pb-2">
                                                    <div className="truncate">Type: {selectedCpuCooler.type || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <div className="flex-1"><AddCpuCooler onCoolerSelect={(cooler) => { setSelectedCpuCooler(cooler); setCpuCoolerImageLoaded(false); }} selectedCooler={selectedCpuCooler} /></div>
                                                <Button variant="destructive" size="icon" onClick={() => { setSelectedCpuCooler(null); setCpuCoolerImageLoaded(false); }}><X /></Button>
                                            </div>
                                        </ItemContent>
                                    </>
                                ) : (
                                    <>
                                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                            <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Fan />CPU Cooler</ItemTitle>
                                            <AddCpuCooler onCoolerSelect={(cooler) => { setSelectedCpuCooler(cooler); setCpuCoolerImageLoaded(false); }} selectedCooler={selectedCpuCooler} />
                                        </ItemContent>
                                    </>
                                )}
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit content-start">
                                {selectedMotherboard ? (
                                    <>
                                        <ItemHeader>
                                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                                {!motherboardImageLoaded && (
                                                    <div className="flex justify-center items-center flex-col gap-2">
                                                        <CircuitBoard className="h-12 w-12 text-muted-foreground" />
                                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                                    </div>
                                                )}
                                                <img 
                                                    src={`${apiUrl}/data/motherboards/images/${selectedMotherboard.id}.png`} 
                                                    alt={selectedMotherboard.metadata?.name} 
                                                    className={`h-24 object-contain ${motherboardImageLoaded ? '' : 'hidden'}`}
                                                    onLoad={() => setMotherboardImageLoaded(true)}
                                                    onError={() => setMotherboardImageLoaded(false)}
                                                />
                                            </ItemMedia>
                                        </ItemHeader>
                                        <ItemContent className="p-4 flex flex-col justify-between" style={{ minHeight: '260px' }}>
                                            <div>
                                                <ItemTitle className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 w-full"><CircuitBoard />Motherboard</ItemTitle>
                                                <ItemTitle className="line-clamp-2 mb-2 flex items-center justify-center w-full">{selectedMotherboard.metadata?.name}</ItemTitle>
                                                <div className="text-sm text-muted-foreground px-4 pb-2">
                                                    <div className="truncate">Chipset: {selectedMotherboard.specifications?.chipset}</div>
                                                    <div className="truncate">Socket: {selectedMotherboard.metadata?.socket}</div>
                                                    <div className="truncate">Form Factor: {selectedMotherboard.specifications?.formFactor}</div>
                                                    <div className="truncate">{selectedMotherboard.specifications?.memory?.type} - {selectedMotherboard.specifications?.memory?.slots} Slots</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <div className="flex-1"><AddMotherboard onMotherboardSelect={(motherboard) => { setSelectedMotherboard(motherboard); setMotherboardImageLoaded(false); }} selectedMotherboard={selectedMotherboard}/></div>
                                                <Button
                                                    variant="default"
                                                    onClick={() => selectedMotherboardSeller && window.open(selectedMotherboardSeller.url, '_blank')}
                                                    disabled={!selectedMotherboardSeller}
                                                >
                                                    <ShoppingCart />Buy
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => { setSelectedMotherboard(null); setMotherboardImageLoaded(false); }}><X /></Button>
                                            </div>
                                        </ItemContent>
                                    </>
                                ):(
                                    <>
                                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                            <ItemTitle className="text-lg font-semibold flex items-center gap-2"><CircuitBoard />Motherboard</ItemTitle>
                                            <AddMotherboard onMotherboardSelect={(motherboard) => { setSelectedMotherboard(motherboard); setMotherboardImageLoaded(false); }} selectedMotherboard={selectedMotherboard}/>
                                        </ItemContent>
                                    </>
                                )}
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit content-start">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Zap />Power Supply</ItemTitle>
                                    <Button variant="outline" className="w-full" disabled><Zap />Select Power Supply</Button>
                                </ItemContent>
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit content-start">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Box />Case</ItemTitle>
                                    <Button variant="outline" className="w-full" disabled><Box />Select Case</Button>
                                </ItemContent>
                            </Item>
                        </div>    
                        <div className="flex flex-col gap-4 h-full">
                            <Item variant="outline" className="p-0 overflow-clip flex-1">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Gpu />GPU</ItemTitle>
                                    {selectedGpus.length > 0 ? (
                                        <ScrollArea className="w-full h-64">
                                            {selectedGpus.map((gpu, index) => (
                                                <Item key={gpu.id || index} variant="outline" className="p-0 overflow-clip min-h-fit mb-2 justify-between">
                                                    <div className="flex items-stretch h-24">
                                                        <div className="w-24 bg-white shrink-0 flex items-center justify-center p-2 border-r">
                                                            <ItemMedia className="justify-center bg-white w-full h-full flex items-center">
                                                                {!gpuImageLoadedMap[index] && <Gpu className="h-8 w-8 text-muted-foreground" />}
                                                            </ItemMedia>
                                                            <img
                                                                src={`${apiUrl}/data/gpus/images/${gpu.id}.png`}
                                                                alt={gpu.name}
                                                                className={`h-full w-full object-contain ${gpuImageLoadedMap[index] ? '' : 'hidden'}`}
                                                                onLoad={() => setGpuImageLoadedMap(prev => ({ ...prev, [index]: true }))}
                                                                onError={() => setGpuImageLoadedMap(prev => ({ ...prev, [index]: false }))}
                                                            />
                                                        </div>
                                                        <div className="align-middle flex-1 p-4">
                                                            <ItemTitle className="line-clamp-2 mb-1">{gpu.name}</ItemTitle>
                                                            <ScrollArea className="h-16">
                                                                <div className="space-y-1 pb-4 pr-4 text-sm text-muted-foreground">
                                                                    <div className="truncate">Chipset: {gpu.chipset}</div>
                                                                    <div className="truncate">{gpu.memory} GB {gpu.memory_type}</div>
                                                                    <div className="truncate">Core: {gpu.core_clock} MHz / Boost: {gpu.boost_clock} MHz</div>
                                                                    <div className="truncate">TDP: {gpu.tdp}W</div>
                                                                    <div className="truncate">Color: {gpu.color || 'N/A'}</div>
                                                                </div>
                                                            </ScrollArea>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center pr-4 gap-2">
                                                        <Button variant="default" onClick={() => gpu.amazon_sku && window.open(`https://www.amazon.com/dp/${gpu.amazon_sku}?tag=${amazonAffiliateTag}`, '_blank')} disabled={!gpu.amazon_sku}>
                                                            <ShoppingCart className="h-4 w-4" />Buy
                                                        </Button>
                                                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                                            setSelectedGpus(prev => prev.filter((_, i) => i !== index));
                                                            setGpuImageLoadedMap(prev => { const m = { ...prev }; delete m[index]; return m; });
                                                        }}><X className="h-4 w-4" /></Button>
                                                    </div>
                                                </Item>
                                            ))}
                                            <div className="flex justify-center w-full">
                                                <AddGpu onGpuSelect={(gpu) => setSelectedGpus(prev => [...prev, gpu])} selectedGpu={null} hasExisting={true} />
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <AddGpu onGpuSelect={(gpu) => setSelectedGpus(prev => [...prev, gpu])} selectedGpu={null} />
                                    )}
                                </ItemContent>
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip flex-1">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><MemoryStick />Memory</ItemTitle>
                                    {selectedMemories.length > 0 ? (
                                        <ScrollArea className="w-full h-64">
                                            {selectedMemories.map((memory, index) => (
                                                <Item key={`${memory.id}-${index}`} variant="outline" className="p-0 overflow-clip min-h-fit mb-2 justify-between">
                                                    <div className="flex items-stretch h-24">
                                                        <div className="w-24 bg-white shrink-0 flex items-center justify-center p-2 border-r">
                                                            <ItemMedia className="justify-center bg-white w-full h-full flex items-center">
                                                                {!memoryImageLoadedMap[index] && <MemoryStick className="h-8 w-8 text-muted-foreground" />}
                                                            </ItemMedia>
                                                            <img
                                                                src={`${apiUrl}/data/memory/images/${memory.id}.png`}
                                                                alt={memory.name}
                                                                className={`h-full w-full object-contain ${memoryImageLoadedMap[index] ? '' : 'hidden'}`}
                                                                onLoad={() => setMemoryImageLoadedMap(prev => ({ ...prev, [index]: true }))}
                                                                onError={() => setMemoryImageLoadedMap(prev => ({ ...prev, [index]: false }))}
                                                            />
                                                        </div>
                                                        <div className="align-middle flex-1 p-4">
                                                            <ItemTitle className="line-clamp-2 mb-1">{memory.name}</ItemTitle>
                                                            <ScrollArea className="h-16">
                                                                <div className="space-y-1 pb-4 pr-4 text-sm text-muted-foreground">
                                                                    <div className="truncate">Type: {memory.type}</div>
                                                                    <div className="truncate">{memory.selectedVariant?.modules}× {memory.selectedVariant && memory.selectedVariant.capacity / memory.selectedVariant.modules} GB &mdash; {memory.selectedVariant?.capacity} GB Total</div>
                                                                    <div className="truncate">Speed: {memory.selectedVariant?.speed} MHz</div>
                                                                    <div className="truncate">CL{memory.selectedVariant?.cl} &mdash; {memory.selectedVariant?.timings}</div>
                                                                    <div className="truncate">Voltage: {memory.selectedVariant?.voltage}V</div>
                                                                </div>
                                                            </ScrollArea>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center pr-4 gap-2">
                                                        {memory.selectedVariant?.amazon_sku && (
                                                            <Button variant="default" onClick={() => window.open(`https://www.amazon.com/dp/${memory.selectedVariant.amazon_sku}?tag=${amazonAffiliateTag}`, '_blank')}>
                                                                <ShoppingCart className="h-4 w-4" />Buy
                                                            </Button>
                                                        )}
                                                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                                            setSelectedMemories(prev => prev.filter((_, i) => i !== index));
                                                            setMemoryImageLoadedMap(prev => { const m = { ...prev }; delete m[index]; return m; });
                                                        }}><X className="h-4 w-4" /></Button>
                                                    </div>
                                                </Item>
                                            ))}
                                            <div className="flex justify-center w-full">
                                                <AddRam onRamSelect={(ram) => setSelectedMemories(prev => [...prev, ram])} selectedRam={null} hasExisting={true} />
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <AddRam onRamSelect={(ram) => setSelectedMemories(prev => [...prev, ram])} selectedRam={null} />
                                    )}
                                </ItemContent>
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip flex-1">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><HardDrive />Storage</ItemTitle>
                                    {selectedStorageDevices.length > 0 ? (
                                        <ScrollArea className="w-full h-64">
                                            {selectedStorageDevices.map((storage, index) => (
                                                <Item key={storage.id || index} variant="outline" className="p-0 overflow-clip min-h-fit mb-2 justify-between">
                                                    <div className="flex items-stretch h-28">
                                                        <div className="w-28 bg-white shrink-0 flex items-center justify-center p-2 border-r">
                                                            <ItemMedia className="justify-center bg-white w-full h-full flex items-center">
                                                            {!storageImageLoadedMap[index] && (
                                                                    <HardDrive className="h-8 w-8 text-muted-foreground" />
                                                            )}
                                                            </ItemMedia>
                                                            <img 
                                                                src={`${apiUrl}/data/storage/images/${storage.id}.png`} 
                                                                alt={storage.name} 
                                                                className={`h-full w-full object-contain ${storageImageLoadedMap[index] ? '' : 'hidden'}`}
                                                                onLoad={() => setStorageImageLoadedMap(prev => ({...prev, [index]: true}))}
                                                                onError={() => setStorageImageLoadedMap(prev => ({...prev, [index]: false}))}
                                                            />
                                                        </div>
                                                        <div className="align-middle flex-1 p-4">
                                                            <ItemTitle className="line-clamp-2 mb-2">{storage.name}</ItemTitle>
                                                            <ScrollArea className="h-16">
                                                                <div className="space-y-1 pb-4 pr-4 text-muted-foreground">
                                                                    <div className="truncate">Capacity: {(() => {
                                                                        const capacityGB = storage.selectedVariant?.capacityGB;
                                                                        return capacityGB >= 1000 ? `${capacityGB / 1000} TB` : `${capacityGB} GB`;
                                                                    })()}</div>
                                                                    <div className="truncate">Type: {storage.type}</div>
                                                                    <div className="truncate">Interface: {storage.interface || 'N/A'}</div>
                                                                    <div className="truncate">Cache: {storage.selectedVariant?.cacheMB ? `${storage.selectedVariant.cacheMB} MB` : 'N/A'}</div>
                                                                    <div className="truncate">Read: {storage.selectedVariant?.performance?.sequencial?.readMBps ? `${storage.selectedVariant.performance.sequencial.readMBps} MB/s` : 'N/A'}</div>
                                                                    <div className="truncate">Write: {storage.selectedVariant?.performance?.sequencial?.writeMBps ? `${storage.selectedVariant.performance.sequencial.writeMBps} MB/s` : 'N/A'}</div>
                                                                </div>
                                                            </ScrollArea>
                                                        </div>


                                                    </div>
                                                        <div className="flex items-center pr-4 gap-4">
                                                            <Button
                                                                variant="default"
                                                                onClick={() => {
                                                                    const sku = storage.selectedVariant?.links?.sellers?.amazon_sku;
                                                                    if (sku) window.open(`https://www.amazon.com/dp/${sku}?tag=${amazonAffiliateTag}`, '_blank');
                                                                }}
                                                                disabled={!storage.selectedVariant?.links?.sellers?.amazon_sku}
                                                            >
                                                                <ShoppingCart className="h-4 w-4" />Buy
                                                            </Button>
                                                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                                                setSelectedStorageDevices((prev) => prev.filter((_, i) => i !== index));
                                                                setStorageImageLoadedMap((prev) => {
                                                                    const newMap = { ...prev };
                                                                    delete newMap[index];
                                                                    return newMap;
                                                                }); 
                                                            }}><X className="h-4 w-4" /></Button>
                                                        </div>
                                                </Item>
                                            ))}
                                            <div className="flex justify-center w-full">
                                                <AddStorage onStorageSelect={(storage) => {setSelectedStorageDevices((prev) => [...prev, storage]);}} selectedStorage={null} hasExisting={true} />
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <AddStorage onStorageSelect={(storage) => {setSelectedStorageDevices((prev) => [...prev, storage]);}} selectedStorage={selectedStorageDevices[0] ?? null} />
                                    )}
                                </ItemContent>
                            </Item>
                        </div>                    
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                    </div>
                )}
            </div>
        </div>
    )
}