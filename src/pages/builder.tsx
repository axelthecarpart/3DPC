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
import { Plus, Cpu, Gpu, MemoryStick, Fan, PcCase, CircuitBoard, HardDrive, Cable } from "lucide-react"
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

export default function BuilderPage() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold mb-4">PC Builder</h1>
            </div>
            <Dialog>
                <div>
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Cpu />
                            <span>CPU</span>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Component</DialogTitle>
                        <DialogDescription>
                            Choose a component for your PC build.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="component-name">Component Name</Label>
                            <Input id="component-name" name="name" placeholder="Enter component name" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Component</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Separator className="my-4" />
        </>
    )
}