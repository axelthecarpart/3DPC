import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import filterConfig from "../components/builder-filters.json"
interface BuilderFiltersProps {
  componentType: string
  onFilterChange?: (filters: any) => void
  components?: any[]
}

export function BuilderFilters({ componentType, onFilterChange, components = [] }: BuilderFiltersProps) {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})

  const config = filterConfig.find((c) => c.type === componentType)

  // Reset filters when component type changes
  useEffect(() => {
    setFilterValues({})
    onFilterChange?.({})
  }, [componentType])

  if (!config) {
    return null
  }

  // Get unique sorted values for a numeric field
  const getUniqueValues = (fieldName: string): number[] => {
    const values = components
      .map(comp => {
        const val = comp[fieldName]
        return typeof val === 'number' ? val : parseInt(val || '0')
      })
      .filter(val => !isNaN(val) && val > 0)
    
    return [...new Set(values)].sort((a, b) => a - b)
  }

  const handleCheckboxChange = (filterId: string, option: string, checked: boolean) => {
    const currentValues = filterValues[filterId] || []
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v: string) => v !== option)

    const updated = { ...filterValues, [filterId]: newValues }
    setFilterValues(updated)
    onFilterChange?.(updated)
  }

  const handleRangeChange = (filterId: string, values: number[]) => {
    console.log('Range change:', filterId, values)
    const updated = { ...filterValues, [filterId]: values }
    setFilterValues(updated)
    onFilterChange?.(updated)
  }

  return (
    <div className="w-64 pr-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <Separator className="my-2" />
        <div className="space-y-4 px-2">
            {config.filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label className="text-sm font-medium">{filter.label}</Label>
                {filter.type === "checkbox" && (
                  <div className="space-y-2">
                    {filter.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filter.id}-${option}`}
                          checked={(filterValues[filter.id] || []).includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(filter.id, option, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`${filter.id}-${option}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {filter.type === "range" && (
                  <div className="space-y-2">
                    {(() => {
                      // Get unique values for this field
                      const uniqueValues = getUniqueValues(filter.id)
                      
                      if (uniqueValues.length === 0) {
                        // Fallback to default behavior if no data
                        const minVal = filter.min || 0
                        const maxVal = filter.max || 100
                        return (
                          <>
                            <Slider
                              min={minVal}
                              max={maxVal}
                              step={filter.step}
                              value={filterValues[filter.id] || [minVal, maxVal]}
                              onValueChange={(values) => handleRangeChange(filter.id, values)}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{filterValues[filter.id]?.[0] ?? minVal}</span>
                              <span>{filterValues[filter.id]?.[1] ?? maxVal}</span>
                            </div>
                          </>
                        )
                      }
                      
                      // Use indices for linear movement
                      const currentValues = filterValues[filter.id]
                      const minIndex = currentValues ? uniqueValues.indexOf(currentValues[0]) : 0
                      const maxIndex = currentValues ? uniqueValues.indexOf(currentValues[1]) : uniqueValues.length - 1
                      
                      return (
                        <>
                          <Slider
                            min={0}
                            max={uniqueValues.length - 1}
                            step={1}
                            value={[minIndex, maxIndex]}
                            onValueChange={(indices) => {
                              // Map indices back to actual values
                              const actualValues = [uniqueValues[indices[0]], uniqueValues[indices[1]]]
                              handleRangeChange(filter.id, actualValues)
                            }}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{uniqueValues[minIndex]}</span>
                            <span>{uniqueValues[maxIndex]}</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}