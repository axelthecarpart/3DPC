import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Cpu, X, Fan, CircuitBoard, HardDrive, Zap, Banknote, Rotate3D, ShoppingCart, LayoutGrid, List } from "lucide-react"

import { useState, useMemo } from "react"

import AddCpu from "@/components/add-cpu"
import AddStorage from "@/components/add-storage"
import AddMotherboard from "@/components/add-motherboard"

const apiUrl = "https://api.3dpc.me"
const amazonAffiliateTag = "3dpc043-20"

export default function BuilderPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


    const [selectedCpu, setSelectedCpu] = useState<any>(null);
    const [selectedGpu] = useState<any>(null);
    const [selectedMemory] = useState<any>(null);
    const [selectedStorageDevices, setSelectedStorageDevices] = useState<any[]>([]);
    const [cpuImageLoaded, setCpuImageLoaded] = useState(false);
    const [storageImageLoadedMap, setStorageImageLoadedMap] = useState<Record<number, boolean>>({});
    const [selectedMotherboard, setSelectedMotherboard] = useState<any>(null);
    const [motherboardImageLoaded, setMotherboardImageLoaded] = useState(false);

    const selectedCpuSeller = selectedCpu?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "");
    const selectedMotherboardSeller = selectedMotherboard?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "");


    const wattage = useMemo(() => {
    const parseNumber = (v: any) => {
        if (v == null) return 0
        const n = Number(v)
        return Number.isFinite(n) ? n : 0
    }

    const cpuTdp = parseNumber(
        selectedCpu?.tdpMax ?? selectedCpu?.tdp
    )

    const gpuTdp = parseNumber(
        selectedGpu?.Tdp
    )

        return cpuTdp + gpuTdp
    }, [selectedCpu, selectedGpu])
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">PC Builder</h1>
            <Separator className="mb-4" />
            <div className="justify-between flex mb-4">
                <div className="flex gap-4">
                <ButtonGroup className="mb-4">
                    <Button variant="outline" size="lg"><Zap />{Math.round(wattage)}W</Button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
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
                                                    alt={selectedCpu.name} 
                                                    className={`h-24 object-contain ${cpuImageLoaded ? '' : 'hidden'}`}
                                                    onLoad={() => setCpuImageLoaded(true)}
                                                    onError={() => setCpuImageLoaded(false)}
                                                />
                                            </ItemMedia>
                                            </ItemHeader>
                                        <ItemContent className="p-4">
                                            <ItemTitle className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 w-full"><Cpu />CPU</ItemTitle>
                                            <ItemTitle className="line-clamp-2 mb-2 flex items-center justify-center w-full">{selectedCpu.name}</ItemTitle>
                                            <div className="text-sm text-muted-foreground flex-1 p-4">
                                                <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                                <div className="truncate">{selectedCpu.clocks?.base} GHz Base / {selectedCpu.clocks?.boost} GHz Boost</div>
                                                <div className="truncate">{selectedCpu.tdp}W TDP</div>
                                                <div className="truncate">Socket: {selectedCpu.socket}</div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
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
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Fan />CPU Cooler</ItemTitle>
                                    <Button variant="outline" className="w-full">Select CPU Cooler</Button>
                                </ItemContent>
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
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
                                        <ItemContent className="p-4">
                                            <ItemTitle className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 w-full"><CircuitBoard />Motherboard</ItemTitle>
                                            <ItemTitle className="line-clamp-2 mb-2 flex items-center justify-center w-full">{selectedMotherboard.metadata?.name}</ItemTitle>
                                            <div className="text-sm text-muted-foreground flex-1 p-4">
                                                <div className="truncate">Chipset: {selectedMotherboard.specifications?.chipset}</div>
                                                <div className="truncate">Socket: {selectedMotherboard.metadata?.socket}</div>
                                                <div className="truncate">Form Factor: {selectedMotherboard.specifications?.formFactor}</div>
                                                <div className="truncate">{selectedMotherboard.specifications?.memory?.type} - {selectedMotherboard.specifications?.memory?.slots} Slots</div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
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
                        </div>    
                        <div>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><Fan />Memory</ItemTitle>
                                    {selectedMemory ? (
                                        <ScrollArea className="w-full h-64">
                                        
                                        </ScrollArea>
                                    ) : (
                                        <Button variant="outline" className="w-1/2">Select Memory</Button>
                                    )}
                                </ItemContent>
                            </Item>
                            <Item variant="outline" className="p-0 overflow-clip min-h-fit mt-4">
                                <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                                    <ItemTitle className="text-lg font-semibold flex items-center gap-2"><HardDrive />Storage</ItemTitle>
                                    {selectedStorageDevices.length > 0 ? (
                                        <ScrollArea className="w-full h-64">
                                            {selectedStorageDevices.map((storage, index) => (
                                                <Item key={storage.id || index} variant="outline" className="p-0 overflow-clip min-h-fit mb-2 justify-between">
                                                    <div className="flex items-stretch h-24">
                                                        <div className="w-24 bg-white shrink-0 flex items-center justify-center p-2 border-r">
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
                                                                    <div className="truncate">Interface: {storage.interface?.join(', ') || 'N/A'}</div>
                                                                    <div className="truncate">Cache: {storage.selectedVariant?.cacheMB ? `${storage.selectedVariant.cacheMB} MB` : 'N/A'}</div>
                                                                </div>
                                                            </ScrollArea>
                                                        </div>


                                                    </div>
                                                        <div className="flex items-center pr-4 gap-4">
                                                            <Button
                                                                variant="default"
                                                                onClick={() => {
                                                                    const seller = storage.selectedVariant?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "");
                                                                    if (seller) window.open(seller.url, '_blank');
                                                                }}
                                                                disabled={!storage.selectedVariant?.links?.sellers?.find((s: any) => s?.url && s.url.trim() !== "")}
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
                                            <AddStorage onStorageSelect={(storage) => {setSelectedStorageDevices((prev) => [...prev, storage]);}} selectedStorage={null} />
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