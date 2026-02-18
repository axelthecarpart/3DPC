import '../App.css'
export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Affiliate Disclosure</h1>
            </div>
            <br></br>
            <div className="items-center justify-center text-center">
                <p className='text-muted-foreground'>
                3DPC is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases. This means that if you click on a link to Amazon and make a purchase, we may receive a commission at no additional cost to you. We only recommend products that we believe will add value to our users.
                </p>
            </div>
        </div>
    )
}
