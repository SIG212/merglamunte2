import { NextRequest, NextResponse } from 'next/server';
import { MASIVE_DATA } from '@/lib/constants';
import { MasivKey } from '@/types/weather';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const masiv = searchParams.get('masiv') as MasivKey;

    if (!masiv) {
        return NextResponse.json(
            { error: 'Missing required parameter: masiv' },
            { status: 400 }
        );
    }

    const masivData = MASIVE_DATA[masiv];
    if (!masivData) {
        return NextResponse.json(
            { error: 'Invalid masiv' },
            { status: 400 }
        );
    }

    const avalansaKey = masivData.avalansa_key;
    if (!avalansaKey) {
        return NextResponse.json({
            nivel: 0,
            text: 'Nu se aplică'
        });
    }

    const apiUrl = process.env.AVALANSA_URL || 'https://raw.githubusercontent.com/SIG212/Scraper-nivologie/main/date_nivologie.json';

    try {
        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Avalansa API error: ${response.status}`);
        }

        const data = await response.json();

        // New JSON format has the avalansa keys at the root
        const masivAvalansaData = data[avalansaKey];
        if (!masivAvalansaData) {
            return NextResponse.json({
                nivel: 0,
                text: 'Date indisponibile'
            });
        }

        // Use "peste_1800" data (more conservative) if available, else sub_1800
        const val = masivAvalansaData.peste_1800 !== undefined ? masivAvalansaData.peste_1800 : masivAvalansaData.sub_1800;
        const nivel = typeof val === 'number' ? val : 0;

        // Generate text based on the numeric value
        let text = 'Necunoscut';
        if (nivel === 0) text = 'Lipsă date / Fără risc';
        else if (nivel === 1) text = 'Risc 1 (Redus)';
        else if (nivel === 2) text = 'Risc 2 (Moderat)';
        else if (nivel === 3) text = 'Risc 3 (Însemnat)';
        else if (nivel === 4) text = 'Risc 4 (Mare)';
        else if (nivel === 5) text = 'Risc 5 (Foarte Mare)';

        return NextResponse.json({
            nivel: nivel,
            text: text
        });
    } catch (error) {
        console.error('Error fetching avalansa data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch avalansa data' },
            { status: 500 }
        );
    }
}
