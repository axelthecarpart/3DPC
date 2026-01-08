import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Plus, Cpu, X, Gpu, MemoryStick, Fan, PcCase, CircuitBoard, HardDrive, Cable, Zap, Banknote, Rotate3D, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item"
import AddCpu from "@/components/add-cpu"
import AddGpu from "@/components/add-gpu"
import { useState, useEffect, useMemo } from "react"

const apiUrl = "http://localhost:5000"


export default function BuilderPage() {
    const [selectedCpu, setSelectedCpu] = useState<any>(null);
    const [selectedGpu, setSelectedGpu] = useState<any>(null);
    



  return (
    <>
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">PC Builder</h1>
      <Separator className="mb-4" />
      <div>
        <ButtonGroup className="mb-4">
            <Button variant="outline" size="sm"><Zap />0W</Button>
            <Button variant="outline" size="sm"><Banknote />$</Button>
        </ButtonGroup>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4 h-32">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"  onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}/>
                                <div className="hidden flex justify-center items-center flex-col gap-2">
                                    <Cpu className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground text-md">Image Coming Soon!</p>
                                </div>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><Cpu />CPU</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="default" onClick={() => selectedCpu.amazonLink && window.open(selectedCpu.amazonLink, '_blank')}><ShoppingCart />Buy</Button><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Cpu />CPU</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><Fan />CPU Cooler</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Fan />CPU Cooler</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><CircuitBoard />Motherboard</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><CircuitBoard />Motherboard</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><MemoryStick />Ram</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><MemoryStick />Ram</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><HardDrive />Storage</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><HardDrive />Storage</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedGpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/gpus${selectedGpu.image}`} alt={selectedGpu.name} className="h-24 object-contain"/>
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
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddGpu onGpuSelect={setSelectedGpu} selectedGpu={selectedGpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedGpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Gpu />Graphics Card</ItemTitle>
                            <AddGpu onGpuSelect={setSelectedGpu} selectedGpu={selectedGpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><PcCase />Case</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><PcCase />Case</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>


            <Item variant="outline" className="p-0 overflow-clip min-h-fit">
                {selectedCpu ? (
                    <>
                        <ItemHeader>
                            <ItemMedia className="justify-center bg-white w-full p-4">
                                <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-24 object-contain"/>
                            </ItemMedia>
                        </ItemHeader>
                        <ItemContent className="p-4">
                            <ItemTitle className="text-lg font-semibold mb-2"><Cable />Power Supply</ItemTitle>
                            <ItemTitle className="line-clamp-2 mb-2">{selectedCpu.name}</ItemTitle>
                            <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="truncate">{selectedCpu.cores} Cores / {selectedCpu.threads} Threads</div>
                                    <div className="truncate">{selectedCpu.baseClock} GHz Base / {selectedCpu.boostClock} GHz Boost</div>
                                    <div className="truncate">{selectedCpu.baseTdp}W TDP</div>
                                    <div className="truncate">Socket: {selectedCpu.socket}</div>
                                    <div className="font-semibold text-foreground truncate">${selectedCpu.price}</div>
                                </div>
                            <div className="flex gap-2 mt-4"><div className="flex-1"><AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/></div><Button variant="destructive" size="icon" onClick={() => setSelectedCpu(null)}><X /></Button></div>
                        </ItemContent>
                    </>
                ):(
                    <>
                        <ItemContent className="flex flex-col items-center justify-center p-4 gap-4" style={{ minHeight: '400px' }}>
                            <ItemTitle className="text-lg font-semibold"><Cable />Power Supply</ItemTitle>
                            <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
                        </ItemContent>
                    </>
                )}
            </Item>

        </div>
        {/*<div className="flex items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center w-32">
                    <Cpu />
                    <span>CPU</span>
                </div>
                {selectedCpu && (
                    <div className="flex items-center gap-2">
                        <div className="h-16 w-16 flex items-center justify-center border rounded-sm bg-white transition-transform hover:scale-175">
                        <img src={`${apiUrl}/data/cpus${selectedCpu.image}`} alt={selectedCpu.name} className="h-12 object-contain"/>
                        </div>
                        <span className="text-sm">{selectedCpu.name}</span>
                        <span className="text-sm font-semibold">${selectedCpu.price}</span>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedCpu(null)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <AddCpu onCpuSelect={setSelectedCpu} selectedCpu={selectedCpu}/>
            </div>
            
            
        </div>*/}
        {/*<Separator className="mb-4" />
        <div className="flex items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center w-32">
                    <Gpu />
                    <span>GPU</span>
                </div>
            </div>
            <Button variant="outline" size="sm"><Plus />Add</Button>
        </div>
        <Separator className="mb-4" />
        <div className="flex items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center w-32">
                    <MemoryStick />
                    <span>Memory</span>
                </div>
            </div>
            <Button variant="outline" size="sm"><Plus />Add</Button>
        </div>*/}
    </div>
    </>
    )
}