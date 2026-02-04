import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Cpu, X, Gpu, MemoryStick, Fan, PcCase, CircuitBoard, HardDrive, Cable, Zap, Banknote, Rotate3D, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item"
import AddCpu from "@/components/add-cpu"
import AddGpu from "@/components/add-gpu"
import AddStorage from "@/components/add-storage"
import { useState, useMemo } from "react"

const apiUrl = "http://localhost:5000"


export default function BuilderPage() {
    const [selectedCpu, setSelectedCpu] = useState<any>(null);
    const [selectedGpu, setSelectedGpu] = useState<any>(null);
    const [selectedStorage, setSelectedStorage] = useState<any>(null);
    const [cpuImageLoaded, setCpuImageLoaded] = useState(false);
    const [gpuImageLoaded, setGpuImageLoaded] = useState(false);
    const [storageImageLoaded, setStorageImageLoaded] = useState(false);

    // find first seller with a non-empty URL for the selected CPU
    const selectedCpuSeller = selectedCpu?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "");

    // compute estimated wattage: CPU base TDP + GPU TDP + small system overhead
    const wattage = useMemo(() => {
        const parseNumber = (v: any) => {
            if (v == null) return 0
            const n = Number(v)
            return Number.isFinite(n) ? n : 0
        }

        const cpuTdp = parseNumber(
            selectedCpu?.metadata?.tdp?.max
        )

        const gpuTdp = parseNumber(
            selectedGpu?.Tdp
        )

        return cpuTdp + gpuTdp
    }, [selectedCpu, selectedGpu])



  return (
    <>
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">PC Builder</h1>
      <Separator className="mb-4" />
      <div className="justify-between flex mb-4">
        <ButtonGroup className="mb-4">
            <Button variant="outline" size="lg"><Zap />{Math.round(wattage)}W</Button>
            <Button variant="outline" size="lg"><Banknote />$</Button>
        </ButtonGroup>
        <Button variant="default" size="lg" className="ml-4"><Rotate3D />3D View</Button>
      </div>
        <div className="flex gap-4">
        {/* Left side - Main components grid */}
        <div className="flex-1 w-1/2">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 p-1">
            {/* CPU */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
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
                                    alt={selectedCpu.metadata?.name} 
                                    className={`h-24 object-contain ${cpuImageLoaded ? '' : 'hidden'}`}
                                    onLoad={() => setCpuImageLoaded(true)}
                                    onError={() => setCpuImageLoaded(false)}
                                />
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><Cpu />CPU</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.metadata?.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div className="truncate">{selectedCpu.specifications?.cores?.total} Cores / {selectedCpu.specifications?.cores?.threads} Threads</div>
                                <div className="truncate">{selectedCpu.specifications?.clocks?.performance?.base} GHz Base / {selectedCpu.specifications?.clocks?.performance?.boost} GHz Boost</div>
                                <div className="truncate">{selectedCpu.metadata?.tdp?.base}W TDP</div>
                                <div className="truncate">Socket: {selectedCpu.metadata?.socket}</div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="flex-1"><AddCpu onCpuSelect={(cpu) => { setSelectedCpu(cpu); setCpuImageLoaded(false); }} selectedCpu={selectedCpu}/></div>
                                <Button
                                    variant="default"
                                    onClick={() => selectedCpuSeller && window.open(selectedCpuSeller.url, '_blank')}
                                    disabled={!selectedCpuSeller}
                                >
                                    <ShoppingCart />Buy
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => { setSelectedCpu(null); setCpuImageLoaded(false); }}><X /></Button>
                            </div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Cpu />CPU</ItemTitle>
                            <AddCpu onCpuSelect={(cpu) => { setSelectedCpu(cpu); setCpuImageLoaded(false); }} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>

            {/* CPU Cooler */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                    <ItemTitle className="text-lg font-semibold"><Fan />CPU Cooler</ItemTitle>
                    <Button variant="outline" className="w-full">Select CPU Cooler</Button>
                </ItemContent>
            </Item>

            {/* Motherboard */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                    <ItemTitle className="text-lg font-semibold"><CircuitBoard />Motherboard</ItemTitle>
                    <Button variant="outline" className="w-full">Select Motherboard</Button>
                </ItemContent>
            </Item>
            {/* Case */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                    <ItemTitle className="text-lg font-semibold"><PcCase />Case</ItemTitle>
                    <Button variant="outline" className="w-full">Select Case</Button>
                </ItemContent>
            </Item>





            {/* Power Supply */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                    <ItemTitle className="text-lg font-semibold"><Cable />Power Supply</ItemTitle>
                    <Button variant="outline" className="w-full">Select Power Supply</Button>
                </ItemContent>
            </Item>
        </div>
        </div>

        {/* Right side - Storage */}
        <div className="flex-1 w-1/2 p-1">
        <div className="flex flex-col gap-4">
            {/* RAM */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                    <ItemTitle className="text-lg font-semibold"><MemoryStick />RAM</ItemTitle>
                    <Button variant="outline" className="w-full">Select RAM</Button>
                </ItemContent>
            </Item>

                            {/* Storage */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedStorage ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                {!storageImageLoaded && (
                                    <div className="flex justify-center items-center flex-col gap-2">
                                        <HardDrive className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                    </div>
                                )}
                                <img 
                                    src={`${apiUrl}/data/storage/images/${selectedStorage.name?.toLowerCase().replace(/ /g, '-')}.png`} 
                                    alt={selectedStorage.name} 
                                    className={`h-24 object-contain ${storageImageLoaded ? '' : 'hidden'}`}
                                    onLoad={() => setStorageImageLoaded(true)}
                                    onError={() => setStorageImageLoaded(false)}
                                />
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><HardDrive />Storage</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedStorage.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div className="truncate">{selectedStorage.selectedVariant?.capacityGB >= 1000 ? `${selectedStorage.selectedVariant?.capacityGB / 1000} TB` : `${selectedStorage.selectedVariant?.capacityGB} GB`}</div>
                                <div className="truncate">Type: {selectedStorage.type}</div>
                                <div className="truncate">Interface: {selectedStorage.interface?.join(', ')}</div>
                                <div className="truncate">Form Factor: {selectedStorage.formFactor}</div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="flex-1"><AddStorage onStorageSelect={(s) => { setSelectedStorage(s); setStorageImageLoaded(false); }} selectedStorage={selectedStorage} /></div>
                                <Button variant="destructive" size="icon" onClick={() => { setSelectedStorage(null); setStorageImageLoaded(false); }}><X /></Button>
                            </div>
                        </ItemContent>
                    </>
                ) : (
                    <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                        <ItemTitle className="text-lg font-semibold"><HardDrive />Storage</ItemTitle>
                        <AddStorage onStorageSelect={(s) => { setSelectedStorage(s); setStorageImageLoaded(false); }} selectedStorage={selectedStorage} />
                    </ItemContent>
                )}
            </Item>
                        {/* GPU */}
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedGpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                {!gpuImageLoaded && (
                                    <div className="flex justify-center items-center flex-col gap-2">
                                        <Gpu className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                    </div>
                                )}
                                <img 
                                    src={`${apiUrl}/data/gpus/images/${selectedGpu.id}.png`} 
                                    alt={selectedGpu.name} 
                                    className={`h-24 object-contain ${gpuImageLoaded ? '' : 'hidden'}`}
                                    onLoad={() => setGpuImageLoaded(true)}
                                    onError={() => setGpuImageLoaded(false)}
                                />
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><Gpu />Graphics Card</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedGpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div className="truncate">{selectedGpu.memory} GB {selectedGpu.memoryType} Memory</div>
                                <div className="truncate">{selectedGpu.baseClock} GHz Base / {selectedGpu.boostClock} GHz Boost</div>
                                <div className="truncate">{selectedGpu.Tdp}W TDP</div>
                                <div className="font-semibold text-foreground truncate">${selectedGpu.price}</div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="flex-1"><AddGpu onGpuSelect={(gpu) => { setSelectedGpu(gpu); setGpuImageLoaded(false); }} selectedGpu={selectedGpu}/></div>
                                <Button variant="destructive" size="icon" onClick={() => { setSelectedGpu(null); setGpuImageLoaded(false); }}><X /></Button>
                            </div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Gpu />Graphics Card</ItemTitle>
                            <AddGpu onGpuSelect={(gpu) => { setSelectedGpu(gpu); setGpuImageLoaded(false); }} selectedGpu={selectedGpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>
        </div>
        </div>
        </div>
    </div>
    </>
    )
}