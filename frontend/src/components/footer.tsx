import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background/50 backdrop-blur-sm py-4 text-center text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <div className="text-left">
                    <h1 className="text-lg font-bold">3DPC</h1>
                    <Separator className="my-2" />
                    <br></br>
                    <Link to="/builder" className="text-sm text-muted-foreground hover:underline">Builder</Link>
                    <br></br>
                    <br></br>
                    <Link to="/compare" className="text-sm text-muted-foreground hover:underline">Compare</Link>
                    <br></br>
                    <br></br>
                    <Link to="/deals" className="text-sm text-muted-foreground hover:underline">Deals</Link>  
                </div>
                <div>
                    <h1 className="text-lg font-bold">Information</h1>
                    <Separator className="my-2" />
                    <br></br>
                    <Link to="/affiliatedisclosure" className="text-sm text-muted-foreground hover:underline">Affiliate Disclosure</Link>   
                </div>
            </div>
        </footer>
    )
}