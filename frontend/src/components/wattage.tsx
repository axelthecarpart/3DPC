import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Zap, Cpu, Gpu, Fan, HardDrive, MemoryStick } from "lucide-react"

interface WattageDialogProps {
    totalWattage: number
    selectedCpu?: any
    selectedGpus?: any[]
    selectedCpuCooler?: any
    selectedStorageDevices?: any[]
    selectedMemoryModules?: any[]
}

interface WattageRowProps {
    icon: React.ReactNode
    label: string
    sublabel?: string
    watts: number
}

function WattageRow({ icon, label, sublabel, watts }: WattageRowProps) {
    return (
        <div className="flex items-center justify-between gap-6 py-4">
            <div className="flex items-center gap-4">
                <div className="text-muted-foreground">{icon}</div>
                <div>
                    <div className="text-md">{label}</div>
                    {sublabel && <div className="text-sm text-muted-foreground">{sublabel}</div>}
                </div>
            </div>
            <div className="text-base font-mono font-semibold tabular-nums shrink-0">
                {watts}W
            </div>
        </div>
    )
}

export default function WattageDialog({ totalWattage, selectedCpu, selectedGpus = [], selectedCpuCooler, selectedStorageDevices = [], selectedMemoryModules = [] }: WattageDialogProps) {
    const parseNumber = (v: any) => {
        if (v == null) return 0
        const n = Number(v)
        return Number.isFinite(n) ? n : 0
    }

    const cpuWatts = parseNumber(selectedCpu?.max_tdp)
    const coolerType: string = selectedCpuCooler?.type ?? ""
    const coolerWattsDefault = coolerType === "Air" ? 10 : coolerType.startsWith("AIO") ? 15 : 0
    const coolerWatts = selectedCpuCooler?.wattage != null && Number.isFinite(Number(selectedCpuCooler.wattage))
        ? Number(selectedCpuCooler.wattage)
        : coolerWattsDefault

    const storageWatts = (storage: any) => {
        const tdpMax = storage.selectedVariant?.tdp?.max
        if (tdpMax != null && Number.isFinite(Number(tdpMax))) return Number(tdpMax)
        // fallback estimate
        const type: string = storage.type ?? ""
        const iface: string = storage.interface ?? ""
        const isHdd = /hdd|hard disk/i.test(type)
        const isNvme = /nvme|m\.2/i.test(iface) || /nvme/i.test(type)
        return isHdd ? 7 : isNvme ? 5 : 3
    }

    const rows: WattageRowProps[] = [
        ...(selectedCpu ? [{
            icon: <Cpu className="h-6 w-6" />,
            label: selectedCpu.name,
            sublabel: "CPU",
            watts: cpuWatts,
        }] : []),
        ...selectedGpus.map((gpu: any) => ({
            icon: <Gpu className="h-6 w-6" />,
            label: gpu.Name ?? "GPU",
            sublabel: "GPU (TDP)",
            watts: parseNumber(gpu?.tdp),
        })),
        ...(selectedCpuCooler ? [{
            icon: <Fan className="h-6 w-6" />,
            label: selectedCpuCooler.name,
            sublabel: "CPU Cooler",
            watts: coolerWatts,
        }] : []),
        ...selectedMemoryModules.map((m: any) => ({
            icon: <MemoryStick className="h-6 w-6" />,
            label: m.name ?? "Memory",
            sublabel: "RAM",
            watts: parseNumber(m?.wattage ?? 5),
        })),
        ...selectedStorageDevices.map((s: any) => ({
            icon: <HardDrive className="h-6 w-6" />,
            label: s.name ?? "Storage",
            sublabel: `Storage (${s.type ?? "Unknown"})`,
            watts: storageWatts(s),
        })),
    ]

    const hasAnyPart = rows.length > 0

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                    <Zap />{Math.round(totalWattage)}W
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[40vh] w-[50vw] max-w-none flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Power Consumption
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden mt-2 flex flex-col">
                    {!hasAnyPart ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                            <Zap className="h-8 w-8" />
                            <span className="text-sm">No Parts Selected</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-y-auto flex-1 pr-1">
                                {rows.map((row, i) => (
                                    <div key={i}>
                                        <WattageRow
                                            icon={row.icon}
                                            label={row.label}
                                            sublabel={row.sublabel}
                                            watts={row.watts}
                                        />
                                        {i < rows.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between py-4 shrink-0">
                                <div className="flex items-center gap-4">
                                    <Zap className="h-6 w-6" />
                                    <span className="text-base font-semibold">Estimated Total</span>
                                </div>
                                <div className="text-base font-mono font-bold tabular-nums">
                                    {Math.round(totalWattage)}W
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground shrink-0">
                                Recommended PSU: <span className="font-medium">{Math.ceil((totalWattage * 1.25) / 50) * 50}W</span>
                            </p>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
