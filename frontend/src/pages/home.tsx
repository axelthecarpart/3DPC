//import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import '../App.css'
import { Hammer } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="text-center">
                <h1 className="text-3xl font-bold">3DPC</h1>
                <br></br>
                <p>Pick parts and view in 3D</p>
            </div>
            <br></br>
            <div className="items-center justify-center">
                <div className="flex items-center justify-center mb-4">
                    <Link to="/builder">
                        <Button variant="default" size="lg">
                            <Hammer /> Build your PC!
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center">
                    <Link to="/deals">
                        <Button variant="link" size="lg">
                            Check out the latest deals!
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
