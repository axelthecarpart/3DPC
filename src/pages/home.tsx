import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import '../App.css'
import { Hammer } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
                <br></br>
                <p>Pick parts and view in 3D</p>
            </div>
            <br></br>
            <div>
                <Link to="/builder">
                    <Button variant="default" size="lg">
                        <Hammer /> Build your PC!
                    </Button>
                </Link>
            </div>
        </div>
    )
}
