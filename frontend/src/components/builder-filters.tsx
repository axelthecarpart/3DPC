/// <reference types="react" />
import { useState, useMemo, type JSX } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BuilderFiltersProps {
  componentType: string
  onFilterChange: (filters: Record<string, any>) => void
  components: any[]
}

export function BuilderFilters({ componentType, onFilterChange, components }: BuilderFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Get unique sorted values from actual component data
  const uniqueSortedValues = useMemo<{
    cores: number[]
    threads: number[]
    tdps: number[]
    l2Cache: number[]
    l3Cache: number[]
    capacity: number[]
    vram: number[]
    coreClock: number[]
    boostClock: number[]
    gpuTdp: number[]
  }>(() => {
    if (componentType === 'cpu' && components.length > 0) {
      const cores = [...new Set(components.map(cpu => cpu.cores).filter(v => v != null))].sort((a, b) => a - b)
      const threads = [...new Set(components.map(cpu => cpu.threads).filter(v => v != null))].sort((a, b) => a - b)
      const tdps = [...new Set(components.map(cpu => cpu.tdp).filter(v => v != null))].sort((a, b) => a - b)
      const l2Cache = [...new Set(components.map(cpu => cpu.l2_cache).filter(v => v != null))].sort((a, b) => a - b)
      const l3Cache = [...new Set(components.map(cpu => cpu.l3_cache).filter(v => v != null))].sort((a, b) => a - b)
      
      return { cores, threads, tdps, l2Cache, l3Cache, capacity: [], vram: [], coreClock: [], boostClock: [], gpuTdp: [] }
    }
    if (componentType === 'gpu' && components.length > 0) {
      const vram = [...new Set(components.map(gpu => gpu.memory).filter(v => v != null))].sort((a, b) => a - b)
      const coreClock = [...new Set(components.map(gpu => gpu.core_clock).filter(v => v != null))].sort((a, b) => a - b)
      const boostClock = [...new Set(components.map(gpu => gpu.boost_clock).filter(v => v != null))].sort((a, b) => a - b)
      const gpuTdp = [...new Set(components.map(gpu => gpu.tdp).filter(v => v != null))].sort((a, b) => a - b)
      return { cores: [], threads: [], tdps: [], l2Cache: [], l3Cache: [], capacity: [], vram, coreClock, boostClock, gpuTdp }
    }
    if (componentType === 'storage' && components.length > 0) {
      const capacity = [...new Set(
        components.flatMap(storage => 
          storage.variants?.map((v: any) => v.capacityGB).filter((v: any) => v != null) || []
        )
      )].sort((a, b) => a - b)
      
      return { cores: [], threads: [], tdps: [], l2Cache: [], l3Cache: [], capacity, vram: [], coreClock: [], boostClock: [], gpuTdp: [] }
    }
    return { cores: [], threads: [], tdps: [], l2Cache: [], l3Cache: [], capacity: [], vram: [], coreClock: [], boostClock: [], gpuTdp: [] }
  }, [components, componentType])

  // Calculate dynamic ranges from actual CPU data
  const ranges = useMemo<{
    cores: { min: number; max: number; values: number[] }
    threads: { min: number; max: number; values: number[] }
    tdp: { min: number; max: number; values: number[] }
    l2Cache: { min: number; max: number; values: number[] }
    l3Cache: { min: number; max: number; values: number[] }
    capacity: { min: number; max: number; values: number[] }
    vram: { min: number; max: number; values: number[] }
    coreClock: { min: number; max: number; values: number[] }
    boostClock: { min: number; max: number; values: number[] }
    gpuTdp: { min: number; max: number; values: number[] }
  }>(() => {
    if (componentType === 'cpu' && uniqueSortedValues.cores.length > 0) {
      return {
        cores: { 
          min: uniqueSortedValues.cores[0], 
          max: uniqueSortedValues.cores[uniqueSortedValues.cores.length - 1],
          values: uniqueSortedValues.cores
        },
        threads: { 
          min: uniqueSortedValues.threads[0], 
          max: uniqueSortedValues.threads[uniqueSortedValues.threads.length - 1],
          values: uniqueSortedValues.threads
        },
        tdp: { 
          min: uniqueSortedValues.tdps[0], 
          max: uniqueSortedValues.tdps[uniqueSortedValues.tdps.length - 1],
          values: uniqueSortedValues.tdps
        },
        l2Cache: { 
          min: uniqueSortedValues.l2Cache[0], 
          max: uniqueSortedValues.l2Cache[uniqueSortedValues.l2Cache.length - 1],
          values: uniqueSortedValues.l2Cache
        },
        l3Cache: { 
          min: uniqueSortedValues.l3Cache[0], 
          max: uniqueSortedValues.l3Cache[uniqueSortedValues.l3Cache.length - 1],
          values: uniqueSortedValues.l3Cache
        },
        capacity: {
          min: uniqueSortedValues.capacity.length > 0 ? uniqueSortedValues.capacity[0] : 0,
          max: uniqueSortedValues.capacity.length > 0 ? uniqueSortedValues.capacity[uniqueSortedValues.capacity.length - 1] : 0,
          values: uniqueSortedValues.capacity
        },
        vram: { min: 0, max: 32, values: [] },
        coreClock: { min: 0, max: 3000, values: [] },
        boostClock: { min: 0, max: 4000, values: [] },
        gpuTdp: { min: 0, max: 600, values: [] }
      }
    }
    if (componentType === 'storage' && uniqueSortedValues.capacity.length > 0) {
      return {
        cores: { min: 0, max: 256, values: [] },
        threads: { min: 0, max: 512, values: [] },
        tdp: { min: 0, max: 1000, values: [] },
        l2Cache: { min: 0, max: 256, values: [] },
        l3Cache: { min: 0, max: 256, values: [] },
        capacity: {
          min: uniqueSortedValues.capacity[0],
          max: uniqueSortedValues.capacity[uniqueSortedValues.capacity.length - 1],
          values: uniqueSortedValues.capacity
        },
        vram: { min: 0, max: 32, values: [] },
        coreClock: { min: 0, max: 3000, values: [] },
        boostClock: { min: 0, max: 4000, values: [] },
        gpuTdp: { min: 0, max: 600, values: [] }
      }
    }
    if (componentType === 'gpu' && uniqueSortedValues.vram.length > 0) {
      return {
        cores: { min: 0, max: 256, values: [] },
        threads: { min: 0, max: 512, values: [] },
        tdp: { min: 0, max: 1000, values: [] },
        l2Cache: { min: 0, max: 256, values: [] },
        l3Cache: { min: 0, max: 256, values: [] },
        capacity: { min: 0, max: 4000, values: [] },
        vram: {
          min: uniqueSortedValues.vram[0],
          max: uniqueSortedValues.vram[uniqueSortedValues.vram.length - 1],
          values: uniqueSortedValues.vram
        },
        coreClock: {
          min: uniqueSortedValues.coreClock[0],
          max: uniqueSortedValues.coreClock[uniqueSortedValues.coreClock.length - 1],
          values: uniqueSortedValues.coreClock
        },
        boostClock: {
          min: uniqueSortedValues.boostClock[0],
          max: uniqueSortedValues.boostClock[uniqueSortedValues.boostClock.length - 1],
          values: uniqueSortedValues.boostClock
        },
        gpuTdp: {
          min: uniqueSortedValues.gpuTdp[0],
          max: uniqueSortedValues.gpuTdp[uniqueSortedValues.gpuTdp.length - 1],
          values: uniqueSortedValues.gpuTdp
        }
      }
    }
    return { 
      cores: { min: 0, max: 256, values: [] }, 
      threads: { min: 0, max: 512, values: [] }, 
      tdp: { min: 0, max: 1000, values: [] },
      l2Cache: { min: 0, max: 256, values: [] },
      l3Cache: { min: 0, max: 256, values: [] },
      capacity: { min: 0, max: 4000, values: [] },
      vram: { min: 0, max: 32, values: [] },
      coreClock: { min: 0, max: 3000, values: [] },
      boostClock: { min: 0, max: 4000, values: [] },
      gpuTdp: { min: 0, max: 600, values: [] }
    }
  }, [uniqueSortedValues, componentType])

  // Extract unique values from components
  const uniqueValues = useMemo(() => {
    if (componentType === 'cpu' && components.length > 0) {
      const manufacturers = [...new Set(components.map(cpu => cpu.manufacturer).filter(Boolean))]
      const sockets = [...new Set(components.map(cpu => cpu.socket).filter(Boolean))]
      const hasGpu = [...new Set(components.map(cpu => 
        cpu.integratedGraphics?.model ? 'Yes' : 'No'
      ))]
      const microarchitectures = [...new Set(components.map(cpu => cpu.microarchitecture).filter(Boolean))]
      
      return { manufacturers, sockets, hasGpu, microarchitectures }
    }
    if (componentType === 'motherboard' && components.length > 0) {
      const manufacturers = [...new Set(components.map(mb => mb.metadata?.manufacturer).filter(Boolean))]
      const sockets = [...new Set(components.map(mb => mb.metadata?.socket).filter(Boolean))]
      const chipsets = [...new Set(components.map(mb => mb.specifications?.chipset).filter(Boolean))]
      const formFactors = [...new Set(components.map(mb => mb.specifications?.formFactor).filter(Boolean))]
      const memoryTypes = [...new Set(components.map(mb => mb.specifications?.memory?.type).filter(Boolean))]
      
      return { manufacturers, sockets, chipsets, formFactors, memoryTypes }
    }
    if (componentType === 'cpu_cooler' && components.length > 0) {
      const manufacturers = [...new Set(components.map(cooler => cooler.manufacturer).filter(Boolean))]
      const types = [...new Set(components.map(cooler => cooler.type).filter(Boolean))]
      const sockets = [...new Set(components.flatMap(cooler => cooler.sockets || []).filter(Boolean))]
      const colors = [...new Set(components.map(cooler => cooler.color).filter(Boolean))]

      return { manufacturers, sockets, types, colors }
    }
    if (componentType === 'gpu' && components.length > 0) {
      const manufacturers = [...new Set(components.map(gpu => gpu.manufacturer).filter(Boolean))]
      const chipsets = [...new Set(components.map(gpu => gpu.chipset).filter(Boolean))]
      const memoryTypes = [...new Set(components.map(gpu => gpu.memory_type).filter(Boolean))]
      const colors = [...new Set(components.map(gpu => gpu.color).filter(Boolean))]
      return { manufacturers, chipsets, memoryTypes, colors }
    }
    if (componentType === 'storage' && components.length > 0) {
      const manufacturers = [...new Set(components.map(storage => storage.manufacturer || storage.name?.split(' ')[0]).filter(Boolean))]
      const types = [...new Set(components.map(storage => storage.type).filter(Boolean))]
      const interfaces = [...new Set(components.flatMap(storage => storage.interface || []).filter(Boolean))]
      const formFactors = [...new Set(components.map(storage => storage.formFactor).filter(Boolean))]
      
      // Get all unique capacities from variants
      const capacities = [...new Set(
        components.flatMap(storage => 
          storage.variants?.map((v: any) => v.capacityGB).filter(Boolean) || []
        )
      )].sort((a, b) => a - b)
      
      return { manufacturers, types, interfaces, formFactors, capacities }
    }
    return { manufacturers: [], sockets: [], hasGpu: [], microarchitectures: [], types: [], colors: [] }
  }, [components, componentType])

  // Memory-specific derived data
  const memoryUniqueValues = useMemo(() => {
    if (componentType !== 'memory' || components.length === 0)
      return { manufacturers: [] as string[], types: [] as string[], colors: [] as string[] }
    const allVariants = components.flatMap((r: any) => r.variants || [])
    const manufacturers = [...new Set(components.map((r: any) => r.manufacturer).filter(Boolean))] as string[]
    const types = [...new Set(components.map((r: any) => r.type).filter(Boolean))] as string[]
    const colors = [...new Set(allVariants.map((v: any) => v.color).filter(Boolean))] as string[]
    return { manufacturers, types, colors }
  }, [components, componentType])

  const memoryRanges = useMemo(() => {
    const empty = { speeds: [] as number[], capacities: [] as number[] }
    if (componentType !== 'memory' || components.length === 0) return empty
    const allVariants = components.flatMap((r: any) => r.variants || [])
    const speeds = [...new Set(allVariants.map((v: any) => v.speed).filter((v: any) => v != null))]
      .sort((a: number, b: number) => a - b) as number[]
    const capacities = [...new Set(allVariants.map((v: any) => v.capacity).filter((v: any) => v != null))]
      .sort((a: number, b: number) => a - b) as number[]
    return { speeds, capacities }
  }, [components, componentType])

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const renderCheckboxGroup = (
    items: string[],
    renderItem: (item: string) => JSX.Element,
    maxVisible: number = 5
  ) => {
    if (items.length <= maxVisible) {
      return <div className="space-y-2">{items.map(renderItem)}</div>
    }

    return (
      <ScrollArea className="h-40 pr-2">
        <div className="space-y-2">{items.map(renderItem)}</div>
      </ScrollArea>
    )
  }

  // Helper function to snap slider values to nearest actual value
  const snapToNearestValue = (value: number, values: number[]) => {
    if (values.length === 0) return value
    return values.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    )
  }

  // Helper to calculate thumb position percentage
  const getThumbPosition = (value: number, min: number, max: number) => {
    if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) return 0
    if (max <= min) return 0
    return ((value - min) / (max - min)) * 100
  }

  // Stabilize label rendering (prevents vertical jump at scroll edges)
  const labelCommon: React.CSSProperties = {
    top: '50%',
    transform: 'translate(-50%, -50%) translateZ(0)',
    transition: 'none',
    willChange: 'transform',
    WebkitTransform: 'translate(-50%, -50%) translateZ(0)',
    WebkitBackfaceVisibility: 'hidden'
  }
  
  if (componentType === 'cpu') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <div className="flex flex-col space-y-1.5 p-8">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {/* Manufacturer Filter */}
          {uniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(uniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        const updated = checked
                          ? [...current, brand]
                          : current.filter((b: string) => b !== brand)
                        updateFilter('manufacturer', updated)
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Socket Filter */}
          {Array.isArray(uniqueValues.sockets) && uniqueValues.sockets.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Socket</Label>
                {renderCheckboxGroup(uniqueValues.sockets, (socket) => (
                  <div key={socket} className="flex items-center space-x-2">
                    <Checkbox
                      id={`socket-${socket}`}
                      checked={filters.socket?.includes(socket)}
                      onCheckedChange={(checked) => {
                        const current = filters.socket || []
                        const updated = checked
                          ? [...current, socket]
                          : current.filter((s: string) => s !== socket)
                        updateFilter('socket', updated)
                      }}
                    />
                    <label htmlFor={`socket-${socket}`} className="text-sm cursor-pointer">
                      {socket}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Cores Range */}
          {ranges.cores.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Cores</Label>
                <div className="relative">
                  <Slider
                    min={ranges.cores.min}
                    max={ranges.cores.max}
                    step={1}
                    value={filters.cores || [ranges.cores.min, ranges.cores.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.cores.values),
                        snapToNearestValue(value[1], ranges.cores.values)
                      ]
                      updateFilter('cores', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.cores?.[0] || ranges.cores.min, ranges.cores.min, ranges.cores.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.cores?.[0] || ranges.cores.min}
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.cores?.[1] || ranges.cores.max, ranges.cores.min, ranges.cores.max)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'none'
                      }}
                    >
                      {filters.cores?.[1] || ranges.cores.max}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Threads Range */}
          {ranges.threads.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Threads</Label>
                <div className="relative">
                  <Slider
                    min={ranges.threads.min}
                    max={ranges.threads.max}
                    step={1}
                    value={filters.threads || [ranges.threads.min, ranges.threads.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.threads.values),
                        snapToNearestValue(value[1], ranges.threads.values)
                      ]
                      updateFilter('threads', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.threads?.[0] || ranges.threads.min, ranges.threads.min, ranges.threads.max)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'none'
                      }}
                    >
                      {filters.threads?.[0] || ranges.threads.min}
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.threads?.[1] || ranges.threads.max, ranges.threads.min, ranges.threads.max)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'none'
                      }}
                    >
                      {filters.threads?.[1] || ranges.threads.max}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* TDP Range */}
          {ranges.tdp.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">TDP</Label>
                <div className="relative">
                  <Slider
                    min={ranges.tdp.min}
                    max={ranges.tdp.max}
                    step={1}
                    value={filters.tdp || [ranges.tdp.min, ranges.tdp.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.tdp.values),
                        snapToNearestValue(value[1], ranges.tdp.values)
                      ]
                      updateFilter('tdp', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.tdp?.[0] || ranges.tdp.min, ranges.tdp.min, ranges.tdp.max)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'none'
                      }}
                    >
                      {filters.tdp?.[0] || ranges.tdp.min}W
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.tdp?.[1] || ranges.tdp.max, ranges.tdp.min, ranges.tdp.max)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'none'
                      }}
                    >
                      {filters.tdp?.[1] || ranges.tdp.max}W
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Integrated Graphics Filter */}
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasGpu"
                checked={!!filters.hasGpu}
                onCheckedChange={(checked) => {
                  updateFilter('hasGpu', checked ? true : undefined)
                }}
              />
              <label htmlFor="hasGpu" className="text-sm cursor-pointer">Integrated Graphics</label>
            </div>
            <Separator />
          </>

          {/* Microarchitecture Filter */}
          {uniqueValues.microarchitectures && uniqueValues.microarchitectures.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Microarchitecture</Label>
                {renderCheckboxGroup(uniqueValues.microarchitectures, (arch) => (
                  <div key={arch} className="flex items-center space-x-2">
                    <Checkbox
                      id={`arch-${arch}`}
                      checked={filters.microarchitecture?.includes(arch)}
                      onCheckedChange={(checked) => {
                        const current = filters.microarchitecture || []
                        const updated = checked
                          ? [...current, arch]
                          : current.filter((a: string) => a !== arch)
                        updateFilter('microarchitecture', updated)
                      }}
                    />
                    <label htmlFor={`arch-${arch}`} className="text-sm cursor-pointer">
                      {arch}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}
          <>
            <div>
              {ranges.l3Cache.values.length > 0 && (
                <>
                  <Label className="text-sm font-medium mb-2 block">L3 Cache (MB)</Label>
                  <div className="relative">
                    <Slider
                      min={ranges.l3Cache.min}
                      max={ranges.l3Cache.max}
                      step={1}
                      value={filters.l3Cache || [ranges.l3Cache.min, ranges.l3Cache.max]}
                      onValueChange={(value) => {
                        const snapped = [
                          snapToNearestValue(value[0], ranges.l3Cache.values),
                          snapToNearestValue(value[1], ranges.l3Cache.values)
                        ]
                        updateFilter('l3Cache', snapped)
                      }}
                      className="mt-2"
                    />
                    <div className="relative h-6 mt-1">
                      <span
                        className="absolute text-xs text-muted-foreground pointer-events-none"
                        style={{
                          left: `${getThumbPosition(filters.l3Cache?.[0] || ranges.l3Cache.min, ranges.l3Cache.min, ranges.l3Cache.max)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'none'
                        }}
                      >
                        {filters.l3Cache?.[0] || ranges.l3Cache.min}MB
                      </span>
                      <span
                        className="absolute text-xs text-muted-foreground pointer-events-none"
                        style={{
                          left: `${getThumbPosition(filters.l3Cache?.[1] || ranges.l3Cache.max, ranges.l3Cache.min, ranges.l3Cache.max)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'none'
                        }}
                      >
                        {filters.l3Cache?.[1] || ranges.l3Cache.max}MB
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Separator />
            <div>
              {ranges.l2Cache.values.length > 0 && (
                <>
                  <Label className="text-sm font-medium mb-2 block">L2 Cache (MB)</Label>
                  <div className="relative">
                    <Slider
                      min={ranges.l2Cache.min}
                      max={ranges.l2Cache.max}
                      step={1}
                      value={filters.l2Cache || [ranges.l2Cache.min, ranges.l2Cache.max]}
                      onValueChange={(value: number[]) => {
                        const snapped = [
                          snapToNearestValue(value[0], ranges.l2Cache.values),
                          snapToNearestValue(value[1], ranges.l2Cache.values)
                        ]
                        updateFilter('l2Cache', snapped)
                      }}
                      className="mt-2"
                    />
                    <div className="relative h-6 mt-1">
                      <span
                        className="absolute text-xs text-muted-foreground pointer-events-none"
                        style={{
                          left: `${getThumbPosition(filters.l2Cache?.[0] || ranges.l2Cache.min, ranges.l2Cache.min, ranges.l2Cache.max)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'none'
                        }}
                      >
                        {filters.l2Cache?.[0] || ranges.l2Cache.min}MB
                      </span>
                      <span
                        className="absolute text-xs text-muted-foreground pointer-events-none"
                        style={{
                          left: `${getThumbPosition(filters.l2Cache?.[1] || ranges.l2Cache.max, ranges.l2Cache.min, ranges.l2Cache.max)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'none'
                        }}
                      >
                        {filters.l2Cache?.[1] || ranges.l2Cache.max}MB
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        </div>
      </div>
    )
  }
  if (componentType === 'gpu') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {/* Manufacturer Filter */}
          {uniqueValues.manufacturers && uniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(uniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        const updated = checked
                          ? [...current, brand]
                          : current.filter((b: string) => b !== brand)
                        updateFilter('manufacturer', updated)
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Chipset Filter */}
          {uniqueValues.chipsets && uniqueValues.chipsets.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Chipset</Label>
                {renderCheckboxGroup(uniqueValues.chipsets, (chipset) => (
                  <div key={chipset} className="flex items-center space-x-2">
                    <Checkbox
                      id={`chipset-${chipset}`}
                      checked={filters.chipset?.includes(chipset)}
                      onCheckedChange={(checked) => {
                        const current = filters.chipset || []
                        const updated = checked
                          ? [...current, chipset]
                          : current.filter((c: string) => c !== chipset)
                        updateFilter('chipset', updated)
                      }}
                    />
                    <label htmlFor={`chipset-${chipset}`} className="text-sm cursor-pointer">
                      {chipset}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Memory Type Filter */}
          {uniqueValues.memoryTypes && uniqueValues.memoryTypes.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Memory Type</Label>
                {renderCheckboxGroup(uniqueValues.memoryTypes, (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`memtype-${type}`}
                      checked={filters.memoryType?.includes(type)}
                      onCheckedChange={(checked) => {
                        const current = filters.memoryType || []
                        const updated = checked
                          ? [...current, type]
                          : current.filter((t: string) => t !== type)
                        updateFilter('memoryType', updated)
                      }}
                    />
                    <label htmlFor={`memtype-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* VRAM Range Filter */}
          {ranges.vram.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">VRAM (GB)</Label>
                <div className="relative">
                  <Slider
                    min={ranges.vram.min}
                    max={ranges.vram.max}
                    step={1}
                    value={filters.memorySize || [ranges.vram.min, ranges.vram.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.vram.values),
                        snapToNearestValue(value[1], ranges.vram.values)
                      ]
                      updateFilter('memorySize', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.memorySize?.[0] ?? ranges.vram.min, ranges.vram.min, ranges.vram.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.memorySize?.[0] ?? ranges.vram.min}GB
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.memorySize?.[1] ?? ranges.vram.max, ranges.vram.min, ranges.vram.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.memorySize?.[1] ?? ranges.vram.max}GB
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Core Clock Range Filter */}
          {ranges.coreClock.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Core Clock (MHz)</Label>
                <div className="relative">
                  <Slider
                    min={ranges.coreClock.min}
                    max={ranges.coreClock.max}
                    step={1}
                    value={filters.coreClock || [ranges.coreClock.min, ranges.coreClock.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.coreClock.values),
                        snapToNearestValue(value[1], ranges.coreClock.values)
                      ]
                      updateFilter('coreClock', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.coreClock?.[0] ?? ranges.coreClock.min, ranges.coreClock.min, ranges.coreClock.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.coreClock?.[0] ?? ranges.coreClock.min}MHz
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.coreClock?.[1] ?? ranges.coreClock.max, ranges.coreClock.min, ranges.coreClock.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.coreClock?.[1] ?? ranges.coreClock.max}MHz
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Boost Clock Range Filter */}
          {ranges.boostClock.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Boost Clock (MHz)</Label>
                <div className="relative">
                  <Slider
                    min={ranges.boostClock.min}
                    max={ranges.boostClock.max}
                    step={1}
                    value={filters.boostClock || [ranges.boostClock.min, ranges.boostClock.max]}
                    onValueChange={(value) => {
                      const snapped = [
                        snapToNearestValue(value[0], ranges.boostClock.values),
                        snapToNearestValue(value[1], ranges.boostClock.values)
                      ]
                      updateFilter('boostClock', snapped)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.boostClock?.[0] ?? ranges.boostClock.min, ranges.boostClock.min, ranges.boostClock.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.boostClock?.[0] ?? ranges.boostClock.min}MHz
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(filters.boostClock?.[1] ?? ranges.boostClock.max, ranges.boostClock.min, ranges.boostClock.max)}%`,
                        ...labelCommon
                      }}
                    >
                      {filters.boostClock?.[1] ?? ranges.boostClock.max}MHz
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* TDP Range Filter */}
          {ranges.gpuTdp.values.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Power (W)</Label>
              <div className="relative">
                <Slider
                  min={ranges.gpuTdp.min}
                  max={ranges.gpuTdp.max}
                  step={1}
                  value={filters.tdp || [ranges.gpuTdp.min, ranges.gpuTdp.max]}
                  onValueChange={(value) => {
                    const snapped = [
                      snapToNearestValue(value[0], ranges.gpuTdp.values),
                      snapToNearestValue(value[1], ranges.gpuTdp.values)
                    ]
                    updateFilter('tdp', snapped)
                  }}
                  className="mt-2"
                />
                <div className="relative h-6 mt-1">
                  <span
                    className="absolute text-xs text-muted-foreground pointer-events-none"
                    style={{
                      left: `${getThumbPosition(filters.tdp?.[0] ?? ranges.gpuTdp.min, ranges.gpuTdp.min, ranges.gpuTdp.max)}%`,
                      ...labelCommon
                    }}
                  >
                    {filters.tdp?.[0] ?? ranges.gpuTdp.min}W
                  </span>
                  <span
                    className="absolute text-xs text-muted-foreground pointer-events-none"
                    style={{
                      left: `${getThumbPosition(filters.tdp?.[1] ?? ranges.gpuTdp.max, ranges.gpuTdp.min, ranges.gpuTdp.max)}%`,
                      ...labelCommon
                    }}
                  >
                    {filters.tdp?.[1] ?? ranges.gpuTdp.max}W
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (componentType === 'motherboard') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {/* Manufacturer Filter */}
          {uniqueValues.manufacturers && uniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(uniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        const updated = checked
                          ? [...current, brand]
                          : current.filter((b: string) => b !== brand)
                        updateFilter('manufacturer', updated)
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Socket Filter */}
          {uniqueValues.sockets && uniqueValues.sockets.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Socket</Label>
                {renderCheckboxGroup(uniqueValues.sockets, (socket) => (
                  <div key={socket} className="flex items-center space-x-2">
                    <Checkbox
                      id={`socket-${socket}`}
                      checked={filters.socket?.includes(socket)}
                      onCheckedChange={(checked) => {
                        const current = filters.socket || []
                        const updated = checked
                          ? [...current, socket]
                          : current.filter((s: string) => s !== socket)
                        updateFilter('socket', updated)
                      }}
                    />
                    <label htmlFor={`socket-${socket}`} className="text-sm cursor-pointer">
                      {socket}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Chipset Filter */}
          {uniqueValues.chipsets && uniqueValues.chipsets.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Chipset</Label>
                {renderCheckboxGroup(uniqueValues.chipsets, (chipset) => (
                  <div key={chipset} className="flex items-center space-x-2">
                    <Checkbox
                      id={`chipset-${chipset}`}
                      checked={filters.chipset?.includes(chipset)}
                      onCheckedChange={(checked) => {
                        const current = filters.chipset || []
                        const updated = checked
                          ? [...current, chipset]
                          : current.filter((c: string) => c !== chipset)
                        updateFilter('chipset', updated)
                      }}
                    />
                    <label htmlFor={`chipset-${chipset}`} className="text-sm cursor-pointer">
                      {chipset}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Form Factor Filter */}
          {uniqueValues.formFactors && uniqueValues.formFactors.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Form Factor</Label>
                {renderCheckboxGroup(uniqueValues.formFactors, (formFactor) => (
                  <div key={formFactor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`formFactor-${formFactor}`}
                      checked={filters.formFactor?.includes(formFactor)}
                      onCheckedChange={(checked) => {
                        const current = filters.formFactor || []
                        const updated = checked
                          ? [...current, formFactor]
                          : current.filter((f: string) => f !== formFactor)
                        updateFilter('formFactor', updated)
                      }}
                    />
                    <label htmlFor={`formFactor-${formFactor}`} className="text-sm cursor-pointer">
                      {formFactor}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Memory Type Filter */}
          {uniqueValues.memoryTypes && uniqueValues.memoryTypes.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Memory Type</Label>
                {renderCheckboxGroup(uniqueValues.memoryTypes, (memoryType) => (
                  <div key={memoryType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`memoryType-${memoryType}`}
                      checked={filters.memoryType?.includes(memoryType)}
                      onCheckedChange={(checked) => {
                        const current = filters.memoryType || []
                        const updated = checked
                          ? [...current, memoryType]
                          : current.filter((m: string) => m !== memoryType)
                        updateFilter('memoryType', updated)
                      }}
                    />
                    <label htmlFor={`memoryType-${memoryType}`} className="text-sm cursor-pointer">
                      {memoryType}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  if (componentType === 'cpu_cooler') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {uniqueValues.manufacturers && uniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(uniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        const updated = checked
                          ? [...current, brand]
                          : current.filter((b: string) => b !== brand)
                        updateFilter('manufacturer', updated)
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {uniqueValues.types && uniqueValues.types.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Type</Label>
                {renderCheckboxGroup(uniqueValues.types, (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.type?.includes(type)}
                      onCheckedChange={(checked) => {
                        const current = filters.type || []
                        const updated = checked
                          ? [...current, type]
                          : current.filter((t: string) => t !== type)
                        updateFilter('type', updated)
                      }}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {Array.isArray(uniqueValues.sockets) && uniqueValues.sockets.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Socket</Label>
                {renderCheckboxGroup(uniqueValues.sockets, (socket) => (
                  <div key={socket} className="flex items-center space-x-2">
                    <Checkbox
                      id={`socket-${socket}`}
                      checked={filters.socket?.includes(socket)}
                      onCheckedChange={(checked) => {
                        const current = filters.socket || []
                        const updated = checked
                          ? [...current, socket]
                          : current.filter((s: string) => s !== socket)
                        updateFilter('socket', updated)
                      }}
                    />
                    <label htmlFor={`socket-${socket}`} className="text-sm cursor-pointer">
                      {socket}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {uniqueValues.colors && uniqueValues.colors.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                {renderCheckboxGroup(uniqueValues.colors, (color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.color?.includes(color)}
                      onCheckedChange={(checked) => {
                        const current = filters.color || []
                        const updated = checked
                          ? [...current, color]
                          : current.filter((c: string) => c !== color)
                        updateFilter('color', updated)
                      }}
                    />
                    <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  if (componentType === 'storage') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {uniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(uniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        const updated = checked
                          ? [...current, brand]
                          : current.filter((b: string) => b !== brand)
                        updateFilter('manufacturer', updated)
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Type Filter (SSD/HDD) */}
          {uniqueValues.types && uniqueValues.types.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Type</Label>
                {renderCheckboxGroup(uniqueValues.types, (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.type?.includes(type)}
                      onCheckedChange={(checked) => {
                        const current = filters.type || []
                        const updated = checked
                          ? [...current, type]
                          : current.filter((t: string) => t !== type)
                        updateFilter('type', updated)
                      }}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Interface Filter */}
          {uniqueValues.interfaces && uniqueValues.interfaces.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Interface</Label>
                {renderCheckboxGroup(uniqueValues.interfaces, (iface) => (
                  <div key={iface} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interface-${iface}`}
                      checked={filters.interface?.includes(iface)}
                      onCheckedChange={(checked) => {
                        const current = filters.interface || []
                        const updated = checked
                          ? [...current, iface]
                          : current.filter((i: string) => i !== iface)
                        updateFilter('interface', updated)
                      }}
                    />
                    <label htmlFor={`interface-${iface}`} className="text-sm cursor-pointer">
                      {iface}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Form Factor Filter */}
          {uniqueValues.formFactors && uniqueValues.formFactors.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Form Factor</Label>
                {renderCheckboxGroup(uniqueValues.formFactors, (formFactor) => (
                  <div key={formFactor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`formFactor-${formFactor}`}
                      checked={filters.formFactor?.includes(formFactor)}
                      onCheckedChange={(checked) => {
                        const current = filters.formFactor || []
                        const updated = checked
                          ? [...current, formFactor]
                          : current.filter((f: string) => f !== formFactor)
                        updateFilter('formFactor', updated)
                      }}
                    />
                    <label htmlFor={`formFactor-${formFactor}`} className="text-sm cursor-pointer">
                      {formFactor}
                    </label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Capacity Filter */}
          {uniqueValues.capacities && uniqueValues.capacities.length > 0 && ranges.capacity && ranges.capacity.values.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Capacity</Label>
                <div className="relative">
                  <Slider
                    min={0}
                    max={ranges.capacity.values.length - 1}
                    step={1}
                    value={[
                      filters.capacity?.[0] != null 
                        ? ranges.capacity.values.indexOf(filters.capacity[0])
                        : 0,
                      filters.capacity?.[1] != null
                        ? ranges.capacity.values.indexOf(filters.capacity[1])
                        : ranges.capacity.values.length - 1
                    ]}
                    onValueChange={(value) => {
                      const actualValues = [
                        ranges.capacity.values[value[0]],
                        ranges.capacity.values[value[1]]
                      ]
                      updateFilter('capacity', actualValues)
                    }}
                    className="mt-2"
                  />
                  <div className="relative h-6 mt-1">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(
                          filters.capacity?.[0] != null ? ranges.capacity.values.indexOf(filters.capacity[0]) : 0,
                          0,
                          ranges.capacity.values.length - 1
                        )}%`,
                        whiteSpace: 'nowrap',
                        ...labelCommon
                      }}
                    >
                      {(() => {
                        const gb = filters.capacity?.[0] || ranges.capacity.min
                        return gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`
                      })()}
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(
                          filters.capacity?.[1] != null ? ranges.capacity.values.indexOf(filters.capacity[1]) : ranges.capacity.values.length - 1,
                          0,
                          ranges.capacity.values.length - 1
                        )}%`,
                        whiteSpace: 'nowrap',
                        ...labelCommon
                      }}
                    >
                      {(() => {
                        const gb = filters.capacity?.[1] || ranges.capacity.max
                        return gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (componentType === 'memory') {
    return (
      <div className="w-64 h-fit rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          {/* Manufacturer */}
          {memoryUniqueValues.manufacturers.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Manufacturer</Label>
                {renderCheckboxGroup(memoryUniqueValues.manufacturers, (brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${brand}`}
                      checked={filters.manufacturer?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.manufacturer || []
                        updateFilter('manufacturer', checked ? [...current, brand] : current.filter((b: string) => b !== brand))
                      }}
                    />
                    <label htmlFor={`manufacturer-${brand}`} className="text-sm cursor-pointer">{brand}</label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Type (DDR4/DDR5) */}
          {memoryUniqueValues.types.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Type</Label>
                {renderCheckboxGroup(memoryUniqueValues.types, (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.type?.includes(type)}
                      onCheckedChange={(checked) => {
                        const current = filters.type || []
                        updateFilter('type', checked ? [...current, type] : current.filter((t: string) => t !== type))
                      }}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">{type}</label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Color */}
          {memoryUniqueValues.colors.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                {renderCheckboxGroup(memoryUniqueValues.colors, (color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.color?.includes(color)}
                      onCheckedChange={(checked) => {
                        const current = filters.color || []
                        updateFilter('color', checked ? [...current, color] : current.filter((c: string) => c !== color))
                      }}
                    />
                    <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">{color}</label>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Speed */}
          {memoryRanges.speeds.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">Speed (MHz)</Label>
                <div className="relative">
                  <Slider
                    min={0}
                    max={memoryRanges.speeds.length - 1}
                    step={1}
                    value={[
                      filters.speed?.[0] != null ? memoryRanges.speeds.indexOf(filters.speed[0]) : 0,
                      filters.speed?.[1] != null ? memoryRanges.speeds.indexOf(filters.speed[1]) : memoryRanges.speeds.length - 1
                    ]}
                    onValueChange={(value) => {
                      updateFilter('speed', [memoryRanges.speeds[value[0]], memoryRanges.speeds[value[1]]])
                    }}
                    className="mt-2 px-2"
                  />
                  <div className="relative h-6 mt-1 overflow-visible">
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(
                          filters.speed?.[0] != null ? memoryRanges.speeds.indexOf(filters.speed[0]) : 0,
                          0, memoryRanges.speeds.length - 1
                        )}%`,
                        whiteSpace: 'nowrap',
                        ...labelCommon
                      }}
                    >
                      {filters.speed?.[0] ?? memoryRanges.speeds[0]} MHz
                    </span>
                    <span
                      className="absolute text-xs text-muted-foreground pointer-events-none"
                      style={{
                        left: `${getThumbPosition(
                          filters.speed?.[1] != null ? memoryRanges.speeds.indexOf(filters.speed[1]) : memoryRanges.speeds.length - 1,
                          0, memoryRanges.speeds.length - 1
                        )}%`,
                        whiteSpace: 'nowrap',
                        ...labelCommon
                      }}
                    >
                      {filters.speed?.[1] ?? memoryRanges.speeds[memoryRanges.speeds.length - 1]} MHz
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Capacity */}
          {memoryRanges.capacities.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Capacity (GB)</Label>
              <div className="relative">
                <Slider
                  min={0}
                  max={memoryRanges.capacities.length - 1}
                  step={1}
                  value={[
                    filters.capacity?.[0] != null ? memoryRanges.capacities.indexOf(filters.capacity[0]) : 0,
                    filters.capacity?.[1] != null ? memoryRanges.capacities.indexOf(filters.capacity[1]) : memoryRanges.capacities.length - 1
                  ]}
                  onValueChange={(value) => {
                    updateFilter('capacity', [memoryRanges.capacities[value[0]], memoryRanges.capacities[value[1]]])
                  }}
                  className="mt-2 px-2"
                />
                <div className="relative h-6 mt-1 overflow-visible">
                  <span
                    className="absolute text-xs text-muted-foreground pointer-events-none"
                    style={{
                      left: `${getThumbPosition(
                        filters.capacity?.[0] != null ? memoryRanges.capacities.indexOf(filters.capacity[0]) : 0,
                        0, memoryRanges.capacities.length - 1
                      )}%`,
                      whiteSpace: 'nowrap',
                      ...labelCommon
                    }}
                  >
                    {filters.capacity?.[0] ?? memoryRanges.capacities[0]} GB
                  </span>
                  <span
                    className="absolute text-xs text-muted-foreground pointer-events-none"
                    style={{
                      left: `${getThumbPosition(
                        filters.capacity?.[1] != null ? memoryRanges.capacities.indexOf(filters.capacity[1]) : memoryRanges.capacities.length - 1,
                        0, memoryRanges.capacities.length - 1
                      )}%`,
                      whiteSpace: 'nowrap',
                      ...labelCommon
                    }}
                  >
                    {filters.capacity?.[1] ?? memoryRanges.capacities[memoryRanges.capacities.length - 1]} GB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}